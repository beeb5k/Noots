<!-- 
@component
Custom button component for consistent styling across the application.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface ButtonProps extends HTMLButtonAttributes {
		children: Snippet;
	}

	const { children, ...rest }: ButtonProps = $props();
</script>

<button {...rest}>
	{@render children()}
</button>

<style>
	button {
		flex: 1;
		background-color: var(--color-neutral);
		border: none;
		color: var(--text);
		padding: 15px 30px;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 16px;
		margin: 15px 2px;
		cursor: pointer;
		border-radius: 1.1rem;
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	button:hover {
		background-color: var(--color-neutral-hov);
	}
	button:active {
		background-color: #253025;
	}

	button:focus {
		outline: none;
	}
</style>
