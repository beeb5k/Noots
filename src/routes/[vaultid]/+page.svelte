<script lang="ts">
	import Button from '$lib/components-ui/Button.svelte';
	import Input from '$lib/components-ui/Input.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import Toolbar from '$lib/components/Toolbar.svelte';
	import CreateIcon from '$lib/icons/CreateIcon.svelte';
	import ProfileIcon from '$lib/icons/ProfileIcon.svelte';
	import SettingsIcon from '$lib/icons/SettingsIcon.svelte';

	const { data } = $props();
	let isDialogOpen = $state(false);

	interface vaultItem {
		type: 'folder' | 'file';
		name: string;
		contentID?: string;
		children?: vaultItem[];
	}

	const foo2: vaultItem[] = [
		{
			type: 'folder',
			name: 'string',
			contentID: 'string', // only if type is file
			children: [
				// only if type is folder
				{
					type: 'file',
					name: 'string',
					contentID: 'string'
				}
			]
		}
	];
</script>

<svelte:head>
	<title>{'Noots | ' + data.vault?.vaultName}</title>
</svelte:head>

<Dialog bind:isDialogOpen heading="Explorer">
	<div id="explorer">
		<div class="item-container">
			<p>Rust</p>
			<p>Go</p>
			<p>Zig</p>
			<p>Rust</p>
			<p>Go</p>
			<p>Zig</p>
			<p>Rust</p>

			<Input />
		</div>
	</div>
</Dialog>

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
	#explorer {
		max-height: 65vh;
		border: solid 1px var(--border-color);
		border-radius: 0.9rem;
		padding: 10px;
	}

	.item-container {
		min-width: fit-content;
		max-height: inherit;
		scrollbar-width: thin;
		overflow-y: scroll;
	}

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
	p {
		margin: 0;
		padding: 4px;
	}

	main {
		display: flex;
		gap: 10px;
		width: 100%;
		padding: 4rem 0 0 0 !important;
	}
</style>
