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
	let itemsInVault = $state<FEtypes.vaultContentStructure>({
		folders: [],
		files: []
	});
	let { isDialogOpen = $bindable(), data }: FEtypes.IProps = $props();

	$effect(() => {
		if (isCreate && isDialogOpen && isCreate.isEnabled) inputElm.focus();

		(async () => {
			if (isDialogOpen) {
				const files = await fetchFiles(data.vaultId);
				const folders = await fetchFolders(data.vaultId);

				itemsInVault = {
					folders,
					files
				};
			}
		})();
	});

	async function fetchFiles(targetID: string): Promise<App.vaultFiles[]> {
		return await FilesNdFolders.files.where('parentID').equals(targetID).toArray();
	}

	async function fetchFolders(targetID: string): Promise<App.vaultFolder[]> {
		return await FilesNdFolders.folders.where('parentID').equals(targetID).toArray();
	}

	function toggleInput(type: App.nodeType) {
		isCreate = {
			isEnabled: type === isCreate?.type ? !isCreate.isEnabled : true,
			type
		};
	}

	/**
	 * This function handles the selected items in the file explorer
	 * @param id - id of the selected item
	 */
	function handleSelectedItems(id: string, parentID: string, type: App.nodeType) {
		const isExpanded = expandedFolderIds.has(id);

		selectedItems = {
			id,
			type,
			parentID
		};

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
	async function createFileOrFolder() {
		if (!inputElm.value || !isCreate) return;

		const newItem = {
			name: inputElm.value,
			type: isCreate.type,
			parentID: selectedItems
				? selectedItems.type === 'file'
					? selectedItems.parentID
					: selectedItems.id
				: data.vaultId,
			id: crypto.randomUUID()
		};

		try {
			if (isCreate.type === 'file') {
				await FilesNdFolders.files.add({ ...newItem, contentID: '' });
			} else if (isCreate.type === 'folder') {
				if (selectedItems?.id) {
					const parentFolder = await FilesNdFolders.folders.get(selectedItems.id);
					if (!parentFolder) throw Error('Parent folder not found');
					await FilesNdFolders.folders.put({
						...parentFolder,
						children: [...parentFolder.children, newItem.id]
					});
				}
				await FilesNdFolders.folders.add({ ...newItem, children: [] });
			}

			inputElm.value = '';
			selectedItems = undefined;
			isCreate = undefined;
			isDialogOpen = false;
		} catch (error) {
			console.error('Error creating item:', error);
		}
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

			{#if isCreate?.isEnabled && !selectedItems}
				<Input bind:thiss={inputElm} aria-label="Vault Name Input" placeholder="Enter name">
					{#if isCreate.type === 'folder'}
						<FolderPlus />
					{:else if isCreate.type === 'file'}
						<FilePlus />
					{/if}
					<button onclick={createFileOrFolder} type="submit" aria-label="submit button" hidden
					></button>
				</Input>
			{/if}

			{#if itemsInVault}
				{@render RenderItems(itemsInVault)}
			{/if}
		</div>
	</div>
</Dialog>

{#snippet RenderItems(vaultItems: FEtypes.vaultContentStructure, level = 0)}
	{#each vaultItems.folders as folder}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			onclick={() => handleSelectedItems(folder.id, folder.parentID, 'folder')}
			class="items"
			style={`${selectedItems?.id === folder.id ? 'background-color: var(--color-surface-hov);' : ''} padding-left: ${
				level * 10
			}px;`}>
			<h6>
				{expandedFolderIds.has(folder.id) ? '📂' : '🖿'}
				{folder.name}
			</h6>
		</div>
		{#if isCreate?.isEnabled && selectedItems?.id === folder.id}
			<Input bind:thiss={inputElm} aria-label="Vault Name Input" placeholder="Enter name">
				{#if isCreate.type === 'folder'}
					<FolderPlus />
				{:else if isCreate.type === 'file'}
					<FilePlus />
				{/if}
				<button onclick={createFileOrFolder} type="submit" aria-label="submit button" hidden
				></button>
			</Input>
		{/if}
		{#if expandedFolderIds.has(folder.id)}
			{#await Promise.all([fetchFolders(folder.id), fetchFiles(folder.id)]) then [folders, files]}
				{@render RenderItems({ folders, files }, level + 1)}
			{/await}
		{/if}
	{/each}

	{#each vaultItems.files as file}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			onclick={() => handleSelectedItems(file.id, file.parentID, 'file')}
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
