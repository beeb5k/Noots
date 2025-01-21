<script lang="ts">
	import { scale } from 'svelte/transition';
	import type { Snippet } from 'svelte';

	interface DialogProps {
		/**The heading of the dialog*/
		heading?: string;
		/**The message of the dialog*/
		message?: string;
		/**A boolean value that determines whether the dialog is open or closed.*/
		isDialogOpen: boolean;
		/**The content of the dialog.*/
		children: Snippet;
	}

	let { heading, message, children, isDialogOpen = $bindable() }: DialogProps = $props();

	$effect(() => {
		if (typeof document !== 'undefined') {
			const dialog = document.querySelector('dialog');
			if (dialog) document.body.style.overflow = isDialogOpen ? 'hidden' : 'auto';

			// close dialog on Escape key press
			const closeDialog = (e: KeyboardEvent) => {
				if (e.key === 'Escape') isDialogOpen = false;
			};
			window.addEventListener('keydown', closeDialog);
			return () => window.removeEventListener('keydown', closeDialog);
		}
	});
</script>

{#if isDialogOpen}
	<div class="backdrop">
		<dialog open={isDialogOpen} transition:scale={{ duration: 200 }}>
			<div class="info">
				<h3>{heading}</h3>
				<p>{message}</p>
			</div>
			<form method="dialog">
				{@render children()}
			</form>
		</dialog>
	</div>
{/if}

<style>
	.backdrop {
		position: fixed;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(5px);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 10;
	}

	dialog {
		background: var(--color-surface);
		border: none;
		overflow-y: scroll;
		scrollbar-width: none;
		border-radius: 0.9rem;
		max-height: 75vh;
		min-width: 300px;
		max-width: 75%;
		padding: 20px;
	}

	dialog p {
		color: var(--text-secondary);
	}

	form {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	form :global(button) {
		margin-top: 1.5rem;
	}

	.info {
		margin-bottom: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.info h3,
	.info p {
		padding: 0;
		margin: 0.5rem 0 0 0;
	}
</style>
