<!-- 
@component
FileExplorer component is a reusable component that can be used to display a file explorer with folders and files.
-->
<script lang="ts">
	import type { FEtypes } from './component';
	import FilePlus from '$lib/icons/file-plus.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import Input from '$lib/components-ui/Input.svelte';
	import { FilesNdFolders } from '$lib/db/vaultItem.js';
	import FolderPlus from '$lib/icons/folder-plus.svelte';

	// svelte-ignore non_reactive_update
	let inputElm: HTMLInputElement;
	let isCreate = $state<FEtypes.IisCreate>();
	let selectedItems = $state<FEtypes.ISelectedItems>();
	let expandedFolderIds = $state<Set<string>>(new Set());
	let itemsInVault = $state<FEtypes.vaultContentStructure>();
	let { isDialogOpen = $bindable(), data }: FEtypes.IProps = $props();

	$effect(() => {
		if (isCreate && isDialogOpen && isCreate.isEnabled) inputElm.focus();

		(async () => {
			if (isDialogOpen) {
				const folders = await FilesNdFolders.folders
					.where('parentID')
					.equals(data.vaultId)
					.toArray();
				const files = await FilesNdFolders.files.where('parentID').equals(data.vaultId).toArray();
				itemsInVault = { folders, files };
				console.log(itemsInVault);
			}
		})();
	});

	function toggleInput(type: App.nodeType) {
		if (!isCreate) return;

		isCreate = {
			isEnabled: type === isCreate.type ? !isCreate.isEnabled : true,
			type
		};
	}

	/**
	 * This function handles the selected items in the file explorer
	 * @param id - id of the selected item
	 */
	function handleSelectedItems(id: string) {
		const isExpanded = expandedFolderIds.has(id);

		if (isExpanded) {
			expandedFolderIds.delete(id);
			// Force reactivity update because Set doesn't trigger reactivity.
			expandedFolderIds = new Set(expandedFolderIds);
		} else {
			expandedFolderIds.add(id);
			// Force reactivity update because Set doesn't trigger reactivity.
			expandedFolderIds = new Set(expandedFolderIds);
		}
	}

	/**
	 * This function creates a file or folder in the current vault
	 */
	function createFileOrFolder() {
		if (!inputElm.value) return;

		return async () => {
			if (!isCreate) return;

			if (!selectedItems?.id) {
				await FilesNdFolders.files.add({
					name: inputElm.value,
					type: isCreate.type,
					parentID: data.vault.vaultID,
					contentID: '',
					id: crypto.randomUUID()
				});

				inputElm.value = '';
				selectedItems = undefined;
				isCreate = {
					type: 'file',
					isEnabled: false
				};
				isDialogOpen = false;
			}
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

			{#if isCreate}
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
			{/if}

			{#if itemsInVault}
				{@render RenderItems(itemsInVault)}
			{/if}
		</div>
	</div>
</Dialog>

{#snippet RenderItems(vaultItems: FEtypes.vaultContentStructure, level = 0)}
	{#if vaultItems}
		{#each vaultItems.folders as folder}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				onclick={() => handleSelectedItems(folder.id)}
				class="items"
				style={`${selectedItems?.id === folder.id ? 'background-color: var(--color-surface-hov);' : ''} padding-left: ${
					level * 10
				}px;`}>
				<h6>
					{expandedFolderIds.has(folder.id) ? '📂' : '🖿'}
					{folder.name}
				</h6>
			</div>
			{#if isCreate}
				{#if isCreate.isEnabled && selectedItems?.id === folder.id}
					<Input bind:thiss={inputElm} aria-label="Vault Name Input" placeholder="Enter name">
						<FolderPlus />
						<button onclick={createFileOrFolder()} type="submit" aria-label="submit button" hidden
						></button>
					</Input>
				{/if}
			{/if}

			{#if expandedFolderIds.has(folder.id) && 'children' in folder && folder.children.length > 0}
				{@render RenderItems({ folders: folder.children, files: [] }, level + 1)}
			{/if}
		{/each}

		{#each vaultItems.files as file}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				onclick={() => handleSelectedItems(file.id)}
				class="items"
				style={`${selectedItems?.id === file.id ? 'background-color: var(--color-surface-hov);' : ''} padding-left: ${
					level * 10
				}px;`}>
				<h6>
					📄
					{file.name}
				</h6>
			</div>
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
