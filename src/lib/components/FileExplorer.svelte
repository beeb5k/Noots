<script lang="ts">
	import FilePlus from '$lib/icons/file-plus.svelte';
	import FolderPlus from '$lib/icons/folder-plus.svelte';
	import Input from '$lib/components-ui/Input.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import { FilesNdFolders } from '$lib/db/vaultItem.js';

	let { isDialogOpen = $bindable(), data } = $props();
    console.log(data);
    
	let selectedItems = $state<String>();
	let expandedFolderIds = $state<Set<String>>(new Set());

	let itemsInVault = $state<App.vaultItem[]>();
	// svelte-ignore non_reactive_update
	let inputElm: HTMLInputElement;
	let isCreate: { type: undefined | 'folder' | 'file'; isEnabled: boolean } = $state({
		type: undefined,
		isEnabled: false
	});

	$effect(() => {
		if (isDialogOpen && isCreate.isEnabled) inputElm.focus();

		(async () => {
			if (isDialogOpen) {
				itemsInVault = await FilesNdFolders.items
					.where('parentID')
					.equals(data.vault?.vaultID!)
					.toArray();
			}
		})();
	});

	function toggleInput(type: 'folder' | 'file') {
		isCreate = {
			isEnabled: type === isCreate.type ? !isCreate.isEnabled : true,
			type
		};
	}

	function handleSeletedItems(id: string) {
		selectedItems = id;

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

	function handleFileOrFolderCreation() {
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

			{#if itemsInVault}
				{#each itemsInVault as item}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						onclick={() => handleSeletedItems(item.id)}
						class="items"
						style={`${selectedItems === item.id ? 'background-color: var(--color-surface-hov);' : ''} `}>
						{#if item.type === 'folder'}
							<FolderPlus />
						{:else}
							<FilePlus />
						{/if}
						<h6>
							<span>
								{#if item.type === 'folder' && expandedFolderIds.has(item.id)}
									opened
								{:else}
									closed
								{/if}
							</span>
							{item.name}
						</h6>
					</div>
				{/each}
			{/if}

			{#if isCreate.isEnabled}
				<Input bind:thiss={inputElm} aria-label="Vault Name Input" placeholder="Enter name">
					{#if isCreate.type === 'folder'}
						<FolderPlus />
					{:else if isCreate.type === 'file'}
						<FilePlus />
					{/if}
					<button
						onclick={handleFileOrFolderCreation()}
						aria-label="submit button"
						type="submit"
						hidden></button>
				</Input>
			{/if}
		</div>
	</div>
</Dialog>

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
