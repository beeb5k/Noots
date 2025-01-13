<!--
@component
Dialog component is a reusable component that can be used to display a dialog box with a heading, message, and buttons. 
It can be used to display a confirmation dialog, alert dialog, or any other type of dialog box.
-->

<script lang="ts">
	import type { Snippet } from 'svelte';

	interface DialogProps {
		/**The heading of the dialog*/
		heading?: string;
		/**The message of the dialog*/
		message?: string;
		/**A boolean value that determines whether the dialog is open or closed.*/
		isDialogOpen: boolean;
		/**The content of the dialog.*/
		children?: Snippet;
	}

	let { heading, message, children, isDialogOpen = $bindable() }: DialogProps = $props();

	$effect(() => {
		if (typeof document !== 'undefined') {
			const dialog = document.querySelector('dialog');
			if (dialog) document.body.style.overflow = isDialogOpen ? 'hidden' : 'auto';
		}
	});
</script>

<div class={isDialogOpen ? 'backdrop' : 'hidden'}>
	<dialog open={isDialogOpen}>
		<div class="info">
			<h3>{heading}</h3>
			<p>{message}</p>
		</div>
		<!-- ?. syntax means call when children is passed -->
		<form method="dialog">
			{@render children?.()}
		</form>
	</dialog>
</div>

<style>
	.backdrop {
		position: fixed;
		top: 0;
		left: 0;
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
		color: var(--text);
		border: none;
		border-radius: 0.9rem;
		padding: 20px;
		/* box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); */
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
