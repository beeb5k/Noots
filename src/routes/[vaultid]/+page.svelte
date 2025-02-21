<script lang="ts">
	import FileExplorer from '$lib/components/FileExplorer.svelte';
	import Toolbar from '$lib/components/Toolbar.svelte';
	import CreateIcon from '$lib/icons/CreateIcon.svelte';

	import ProfileIcon from '$lib/icons/ProfileIcon.svelte';
	import SettingsIcon from '$lib/icons/SettingsIcon.svelte';

	const { data } = $props();
	let isDialogOpen = $state(false);
</script>

<svelte:head>
	<title>{'Noots | ' + data.vault?.vaultName}</title>
</svelte:head>

{#if data.vault && data.vaultId}
	<FileExplorer data={{ vault: data.vault, vaultId: data.vaultId }} bind:isDialogOpen />
{/if}

<Toolbar>
	<button onclick={() => (isDialogOpen = true)} aria-label="Create Vault">
		<CreateIcon />
	</button>
	<button aria-label="Profile">
		<ProfileIcon />
	</button>
	<button aria-label="Settings">
		<SettingsIcon />
	</button>
</Toolbar>
<div>
	<main>
		<div id="text-area-container">
			<div id="Heading" contenteditable spellcheck="false"></div>
			<div id="text-area" contenteditable spellcheck="false"></div>
		</div>
	</main>
</div>

<style>
	#text-area {
		padding: 10px;
		min-height: 80vh;
		max-width: 100%;
		outline: none;
		border: none;
	}

	#Heading {
		width: 100%;
		padding: 0;
		margin: 0;
		min-height: 48px;
		text-align: center;
		font-size: 1.9rem;
		outline: none;
		border: none;
		font-weight: bold;
		border-bottom: solid 1px var(--border-color);
	}

	#text-area-container {
		padding: 1.2rem;
		min-height: 85vh;
		border-radius: 10px;
		background-color: var(--color-surface);
		width: 65%;
		margin-left: 15%;
		margin-right: auto;
		word-wrap: break-word;
	}

	main {
		display: flex;
		gap: 10px;
		width: 100%;
		padding: 4rem 0 0 0 !important;
	}
</style>
