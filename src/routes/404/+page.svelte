<script lang="ts">
	type Choices = 'Rock' | 'Papers' | 'Scissors';
	const choice: { compChoice: Choices | null; userChoice: Choices | null } = $state({
		compChoice: null,
		userChoice: null
	});

	function play(uChoice: Choices) {
		return () => {
			const getCompChoice = Math.floor(Math.random() * 2);
			console.log(getCompChoice);
		};
	}
</script>

<section id="error">
	<h1>404</h1>
	<p>Page you are looking for is not found.</p>
</section>

<section id="game">
	<div>
		<button onclick={play('Rock')}>R</button>
		<button onclick={play('Papers')}>P</button>
		<button onclick={play('Scissors')}>S</button>
	</div>
</section>

<style>
	#error {
		display: flex;
		justify-content: center;
		flex-direction: column;
		text-align: center;
	}

	h1 {
		font-size: 4rem;
		padding: 0;
		margin: 0;
	}

	p {
		padding: 0;
		margin: 0;
	}

	#game {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 50vh;
	}

	button {
		background-color: transparent;
		font-size: 25px;
		padding: 20px;
		width: 80px;
		border: none;
		outline: none;
		border-radius: 50%;
	}
	button:hover {
		background-color: var(--color-neutral);
	}
</style>
