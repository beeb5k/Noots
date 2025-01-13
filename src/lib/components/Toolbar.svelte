<!-- 
@component
Toolbar component is a reusable component that can be used to display a side toolbar with buttons.
@props { children: Snippet }

-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div id="toolbar-container">
	<div id="main">
		<div id="toolbar">
			{@render children()}
		</div>
	</div>
</div>

<style>
	#toolbar-container {
		position: fixed;
		height: 100%;
		align-content: center;
	}

	#main {
		display: flex;
		justify-content: center;
		border-radius: 0 30px 30px 0;
		background-color: var(--color-surface);
	}

	#toolbar {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 100%;
	}

	#toolbar :global(button) {
		background-color: transparent;
		color: var(--text);
		display: flex;
		justify-content: center;
		padding: 15px;
		margin: 4px;
		border: none;
		cursor: pointer;
		border-radius: 50%;
	}

	#toolbar :global(button):hover {
		background-color: var(--color-surface-hov);
	}

	#toolbar :global(button):active {
		background-color: #253025;
	}

	#toolbar :global(button):focus {
		outline: none;
	}

	#toolbar :global(svg) {
		width: 25px;
		height: 25px;
	}
</style>
