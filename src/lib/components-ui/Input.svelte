<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface InputProps {
		children?: Snippet;
		class?: string;
		thiss?: HTMLInputElement;
	}

	let {
		children,
		thiss = $bindable(),
		class: className = '',
		...rest
	}: InputProps & HTMLInputAttributes = $props();
</script>

<div class="container">
	<input bind:this={thiss} {...rest} class={`input ${className}`} />
	{#if children}
		<button aria-label="input" type="button" class="icon">
			{@render children()}
		</button>
	{/if}
</div>

<style>
	.container {
		display: flex;
		align-items: center;
		border: 1px solid var(--accent);
		opacity: 0.8;
		border-radius: 0.9rem;
		padding: 8px 10px;
		background-color: #253025;
		width: 100%;
	}
	.container:focus-within {
		opacity: 0.9;
	}
	.input {
		flex: 1;
		background: none;
		border: none;
		outline: none;
		color: #fff;
		font-size: 16px;
	}
	.input::placeholder {
		color: #bcbcbc;
	}
	.icon {
		background: none;
		border: none;
		outline: none;
		cursor: pointer;
		padding: 0;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.icon :global(svg) {
		width: 20px;
		height: 20px;
		fill: #fff;
	}
	.icon:focus {
		outline: none;
	}
</style>
