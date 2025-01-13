<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	interface DropdownProps {
		position: string;
		dropdownItems: { text: string; onClick: () => void }[];
		isDropdownOpen: boolean;
	}
	let {
		position = $bindable(),
		isDropdownOpen = $bindable(),
		dropdownItems
	}: DropdownProps = $props();

	// svelte-ignore non_reactive_update
	let dropdownRef: HTMLDivElement;

	/**
	 * handles the click outside event to close the dropdown.
	 * @param event
	 */
	function onClickOutside(event: MouseEvent) {
		if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
			isDropdownOpen = false;
		}
	}

	/* 
		adding event listener to body (document) to close the dropdown
		(i think so im not sure if document represents body)  
	*/
	if (typeof document !== 'undefined') {
		onMount(() => {
			document.addEventListener('click', onClickOutside);
		});
		onDestroy(() => {
			document.removeEventListener('click', onClickOutside);
		});
	}

	/**
	 * Wrapper function to close the dropdown and call the click event.
	 * @param click the click event.
	 */
	function triggerDropdownAction(click: () => void) {
		return () => {
			isDropdownOpen = false;
			click();
		};
	}
</script>

<div bind:this={dropdownRef} class="dropdown-menu" style={position}>
	<div class="dropdown-cont">
		{#each dropdownItems as item}
			<div>
				<button onclick={triggerDropdownAction(item.onClick)}>
					{item.text}
				</button>
			</div>
		{/each}
	</div>
</div>

<style>
	.dropdown-menu {
		position: absolute;
		background-color: var(--color-neutral);
		min-width: 200px;
		border-radius: 8px;
		z-index: 1000;
		padding: 0;
	}

	.dropdown-cont {
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
	}

	.dropdown-cont div {
		border-bottom: 1px solid var(--border-color);
	}

	.dropdown-cont button {
		width: 100%;
		padding: 10px 20px;
		border-radius: 8px;
		background-color: transparent;
		outline: none;
		border: none;
		color: var(--text);
		cursor: pointer;
	}

	.dropdown-cont div:last-child {
		border-bottom: none;
	}

	.dropdown-menu button:hover {
		background-color: var(--color-neutral-hov);
	}

	.dropdown-menu button:active {
		background-color: #253025;
	}
</style>
