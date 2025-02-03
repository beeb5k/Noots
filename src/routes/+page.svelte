<script lang="ts">
	import { onMount } from 'svelte';
	/* Icons import */
	import StarFilled from '$lib/icons/StarFilled.svelte';
	import StarOutline from '$lib/icons/StarOutline.svelte';
	import ThreeDots from '$lib/icons/ThreeDots.svelte';
	import CreateIcon from '$lib/icons/CreateIcon.svelte';
	import ProfileIcon from '$lib/icons/ProfileIcon.svelte';
	import SettingsIcon from '$lib/icons/SettingsIcon.svelte';
	/* Components Import */
	import Button from '$lib/components-ui/Button.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import Input from '$lib/components-ui/Input.svelte';
	import Toolbar from '$lib/components/Toolbar.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';

	import {
		createNewVault,
		deleteVault,
		getAllVaults,
		toggleVaultFavorite,
		updateVaultName
	} from '$lib/stores/vaultStore';

	type DialogMode = 'create' | 'edit' | 'delete';

	let data = $state<App.Vault[]>([]);
	let isDialogOpen = $state(false);
	let vaultNameValue = $state('');
	// svelte-ignore non_reactive_update
	let inputElm: HTMLInputElement;
	let isDropdownOpen = $state(false);
	let position: string = $state('');
	let modalControl: { dialogCallerType: DialogMode; uid: string | undefined } = $state({
		dialogCallerType: 'create',
		uid: undefined
	});

	function handleModalOpen(type: DialogMode) {
		return () => {
			modalControl.dialogCallerType = type;
			isDialogOpen = true;
		};
	}

	function handleDialogSubmit(type: DialogMode) {
		return async () => {
			switch (type) {
				case 'create':
					await createNewVault(vaultNameValue);
					break;
				case 'edit':
					await updateVaultName(modalControl.uid!, vaultNameValue); // modalControl.uid will never be undefined here. (Hopefully 🤞)
					break;
				case 'delete':
					await deleteVault(modalControl.uid!, vaultNameValue); // here too.
					break;
			}

			vaultNameValue = '';
			isDialogOpen = false;
			await refreshVaults();
		};
	}

	function handleMoreClick(event: MouseEvent, vaultID: string) {
		event.preventDefault();
		event.stopPropagation();
		isDropdownOpen = true;
		modalControl.uid = vaultID;
		const { clientX, clientY } = event;
		position = `top: ${clientY}px; left: ${clientX}px;`;
	}

	async function refreshVaults() {
		data = await getAllVaults();
	}

	async function handleToggleFavorite(event: MouseEvent, vaultID: string, isFavorite: boolean) {
		event.preventDefault();
		await toggleVaultFavorite(vaultID, isFavorite);
		await refreshVaults();
	}

	// Focus the input element when the dialog is open.
	// prettier-ignore
	$effect(() => {if (isDialogOpen) inputElm.focus()});
	// get all vaults when the component is mounted.
	onMount(refreshVaults);

	const DropdownData = [
		{
			text: 'Edit',
			onClick: () => handleModalOpen('edit')()
		},
		{
			text: 'Delete',
			onClick: () => handleModalOpen('delete')()
		}
	];
</script>

<svelte:head>
	<title>Noots</title>
</svelte:head>

{#if isDropdownOpen}
	<Dropdown bind:position dropdownItems={DropdownData} bind:isDropdownOpen />
{/if}

{#if modalControl.dialogCallerType === 'create'}
	{@render DisplayDialog('Create Vault', 'Enter name you want to give to your vault')}
{:else if modalControl.dialogCallerType === 'edit'}
	{@render DisplayDialog('Edit Vault', 'Enter the new name for the vault')}
{:else if modalControl.dialogCallerType === 'delete'}
	{@render DisplayDialog('Delete Vault', 'Type "yes" to delete the vault', 'yes')}
{/if}

<main>
	<Toolbar>
		<button onclick={handleModalOpen('create')} aria-label="Create Vault">
			<CreateIcon />
		</button>
		<button aria-label="Profile">
			<ProfileIcon />
		</button>
		<button aria-label="Settings">
			<SettingsIcon />
		</button>
	</Toolbar>
	<section id="main-section">
		<div id="main-container">
			<div id="card-container">
				<!-- cards -->
				{#each data as { vaultName, isFavorite, vaultID }}
					<a href={`/${vaultID}`} id="vault-card">
						<div id="vault-card-buttons">
							<button
								id="star-button"
								type="button"
								onclick={(event) => handleToggleFavorite(event, vaultID, isFavorite)}
								aria-label="fav">
								{#if isFavorite}
									<StarFilled />
								{:else}
									<StarOutline />
								{/if}
							</button>
							<button
								onclick={(event) => handleMoreClick(event, vaultID)}
								id="more-button"
								type="button"
								aria-label="more">
								<ThreeDots />
							</button>
						</div>
						<div id="vault-card-content"></div>
						<p>{vaultName}</p>
					</a>
				{/each}
				<!-- cards -->
			</div>
		</div>
	</section>
</main>

{#snippet DisplayDialog(heading: string, message: string, placeholder?: string)}
	<Dialog bind:isDialogOpen {heading} {message}>
		<div class="input-container">
			<Input
				bind:thiss={inputElm}
				aria-label="Vault Name Input"
				oninput={(e) => (vaultNameValue = (e.target as HTMLInputElement).value)}
				placeholder={placeholder || 'Enter vault name'}
				value={vaultNameValue} />
		</div>
		<div class="button-container">
			<Button
				disabled={modalControl.dialogCallerType === 'delete'
					? vaultNameValue.toLowerCase() !== 'yes'
					: !vaultNameValue}
				onclick={handleDialogSubmit(modalControl.dialogCallerType)}
				type="submit">OK</Button>
			<Button
				onclick={() => {
					isDialogOpen = false;
					vaultNameValue = '';
				}}
				type="button">Cancel</Button>
		</div>
	</Dialog>
{/snippet}

<style>
	main {
		display: flex;
		/* position: relative; */
	}

	#card-container {
		display: flex;
		flex-wrap: wrap;
	}

	#main-container {
		display: flex;
		width: 65%;
		margin-left: auto;
		margin-right: 5%;
	}

	#main-section {
		width: 100%;
		padding: 4rem 0 0 0 !important;
	}

	.button-container {
		display: flex;
		width: 100%;
		justify-content: space-between;
	}

	.input-container {
		display: flex;
		width: 100%;
	}

	#vault-card {
		text-decoration: none;
		position: relative;
		margin: 15px;
	}

	#vault-card:last-child {
		margin-right: 0;
	}

	#vault-card-content {
		border-radius: 10px;
		width: 15rem;
		height: 10rem;
		background-color: var(--color-surface);
	}

	#vault-card p {
		font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
		font-size: 1.2rem;
		font-weight: 500;
		padding: 4px 0 0 0;
		color: var(--text);
		margin: 0;
	}

	#vault-card-buttons {
		position: absolute;
		width: 100%;
		display: flex;
		justify-content: space-between;
	}

	#vault-card-buttons :global(svg) {
		opacity: 0;
		transition: opacity 0.2s ease-in-out;
		fill: var(--text-secondary);
	}

	#vault-card:hover :global(svg) {
		opacity: 1;
	}

	#star-button :global(svg) {
		fill: #f0c674;
	}

	#more-button :global(svg) {
		width: 15px;
	}

	#vault-card-buttons button {
		background-color: transparent;
		width: 30px;
		display: flex;
		justify-content: center;
		padding: 5px;
		margin: 4px;
		border: none;
		cursor: pointer;
		border-radius: 50%;
		transition: background-color 0.2s ease-in-out;
	}

	#vault-card-buttons button:hover {
		background-color: var(--color-surface-hov);
	}
</style>
