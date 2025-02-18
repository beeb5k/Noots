<!-- 
@component
FileExplorer component is a reusable component that can be used to display a file explorer with folders and files.
-->
<script lang="ts">
	import FilePlus from '$lib/icons/file-plus.svelte';
	import FolderPlus from '$lib/icons/folder-plus.svelte';
	import Input from '$lib/components-ui/Input.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import { FilesNdFolders } from '$lib/db/vaultItem.js';

	interface SelectedItems {
		id: string;
		type: App.nodeType;
		parentID?: string;
	}

	let { isDialogOpen = $bindable(), data } = $props();

	let selectedItems = $state<SelectedItems>();
	let expandedFolderIds = $state<Set<string>>(new Set());

	let itemsInVault = $state<App.vaultItem[]>();
	// svelte-ignore non_reactive_update
	let inputElm: HTMLInputElement;
	let isCreate: { type: undefined | App.nodeType; isEnabled: boolean } = $state({
		type: undefined,
		isEnabled: false
	});

	$effect(() => {
		if (isDialogOpen && isCreate.isEnabled) inputElm.focus();

		(async () => {
			if (isDialogOpen) {
				itemsInVault = await FilesNdFolders.items
					.where('parentID')
					.equals(data.vault.vaultID)
					.toArray();
			}
		})();
	});

	function toggleInput(type: App.nodeType) {
		isCreate = {
			isEnabled: type === isCreate.type ? !isCreate.isEnabled : true,
			type
		};
	}

	/**
	 * This function finds the selected item in the file explorer
	 * time complexity: O(n)
	 * @param id - id of the selected item
	 * @param data - data to search for the parent folder id
	 * @returns parent folder id
	 */
	function findSeletedItem(id: string, data: App.vaultItem[]): App.vaultItem | undefined {
		let selectedItem: App.vaultItem | undefined;
		for (let i = 0; i < data.length; i++) {
			if (data[i].id === id) {
				selectedItem = data[i];
				break;
			}

			if (data[i].children) {
				const found = data[i].children!.find((item) => item.id === id);
				if (found) {
					selectedItem = found;
					break;
				} else {
					selectedItem = findSeletedItem(id, data[i].children!);
				}
			}
		}

		return selectedItem;
	}

	/**
	 * This function handles the selected items in the file explorer
	 * @param id - id of the selected item
	 */
	function handleSeletedItems(id: string) {
		if (itemsInVault)
			selectedItems = {
				id,
				type: findSeletedItem(id, itemsInVault)?.type!,
				parentID: findSeletedItem(id, itemsInVault)?.parentID
			};

		const isExpanded = expandedFolderIds.has(id);

		if (isExpanded) {
			expandedFolderIds.delete(id);
			// Force reactivity update
			expandedFolderIds = new Set(expandedFolderIds);
		} else {
			expandedFolderIds.add(id);
			// Force reactivity update
			expandedFolderIds = new Set(expandedFolderIds);
		}
	}

	/**
	 * This function creates a file or folder in the current vault
	 */
	function createFileOrFolder() {
		if (!inputElm.value) return;

		return async () => {
			await FilesNdFolders.items.add({
				type: isCreate.type!,
				name: inputElm.value,
				parentID: data.vault?.vaultID,
				id: crypto.randomUUID()
			});

			isDialogOpen = false;
		};
	}
</script>

<Dialog bind:isDialogOpen heading="Explorer">
	<div id="explorer">
		<div class="item-container">
			<div class="name-and-icon">
				<h6>{data.vault?.vaultName}</h6>

				<div>
					<button onclick={() => toggleInput('folder')} type="button">
						<FolderPlus />
					</button>
					<button onclick={() => toggleInput('file')} type="button">
						<FilePlus />
					</button>
				</div>
			</div>

			{#if isCreate.isEnabled && !selectedItems}
				<Input bind:thiss={inputElm} aria-label="Vault Name Input" placeholder="Enter name">
					{#if isCreate.type === 'folder'}
						<FolderPlus />
					{:else if isCreate.type === 'file'}
						<FilePlus />
					{/if}
					<button onclick={createFileOrFolder()} type="submit" aria-label="submit button" hidden
					></button>
				</Input>
			{/if}

			{#if itemsInVault}
				{@render RenderItems(itemsInVault)}
			{/if}
		</div>
	</div>
</Dialog>

{#snippet RenderItems(vaultItems: App.vaultItem[], level = 0)}
	{#if vaultItems}
		{#each vaultItems as item}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				onclick={() => handleSeletedItems(item.id)}
				class="items"
				style={`${selectedItems?.id === item.id ? 'background-color: var(--color-surface-hov);' : ''} padding-left: ${
					level * 10
				}px;`}>
				<h6>
					{item.type === 'folder' && expandedFolderIds.has(item.id)
						? '📂'
						: item.type === 'file'
							? '📄'
							: '🖿'}

					{item.name}
				</h6>
			</div>
			{#if isCreate.isEnabled && selectedItems?.id === item.id}
				<Input bind:thiss={inputElm} aria-label="Vault Name Input" placeholder="Enter name">
					{#if isCreate.type === 'folder'}
						<FolderPlus />
					{:else if isCreate.type === 'file'}
						<FilePlus />
					{/if}
					<button onclick={createFileOrFolder()} type="submit" aria-label="submit button" hidden
					></button>
				</Input>
			{/if}

			{#if item.type === 'folder' && expandedFolderIds.has(item.id) && item.children && item.children.length > 0}
				{@render RenderItems(item.children, level + 1)}
			{/if}
		{/each}
	{/if}
{/snippet}

<style>
	h6 {
		margin: 0;
		padding: 0;
		font-size: medium;
		padding-bottom: 4px;
	}

	.items :global(svg) {
		height: 15px;
		width: 15px;
	}

	.items:hover {
		background-color: var(--color-neutral-hov);
	}

	.name-and-icon {
		border-bottom: 1px solid var(--border-color);
		width: 100%;
		padding: 4px 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.name-and-icon button {
		background-color: transparent;
		margin: 0;
		border: none;
		outline: none;
		border-radius: 999px;
		align-content: center;
	}
	.name-and-icon button:hover {
		background-color: var(--color-surface-hov);
	}

	.name-and-icon button:active {
		background-color: #253025;
	}

	.name-and-icon :global(svg) {
		width: 15px;
		height: 15px;
		padding: 0.3rem;
		/* margin-left: 4px; */
	}

	#explorer {
		max-height: 65vh;
		border: solid 1px var(--border-color);
		border-radius: 0.9rem;
		padding: 10px;
	}

	.item-container {
		min-width: 250px;
		max-height: inherit;
		scrollbar-width: thin;
		overflow-y: scroll;
	}
</style>
