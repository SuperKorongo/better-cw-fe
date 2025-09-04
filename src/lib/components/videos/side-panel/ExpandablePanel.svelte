<script lang="ts">
	import type { Snippet } from 'svelte';

	let { title, component }: { title: string; component: () => ReturnType<Snippet> } = $props();
	let isVisible: boolean = $state<boolean>(false);

	const togglePanel = () => (isVisible = !isVisible);
</script>

<div class="main">
	<button class="toggle-panel" onclick={togglePanel}>
		{#if isVisible}
			-
		{:else}
			+
		{/if}
	</button>
	<span class="title">{title}</span>
	{#if isVisible}
		<div class="content">
			{@render component()}
		</div>
	{/if}
</div>

<style>
	.main {
		background: linear-gradient(45deg, #40c4ff, #a23cff);
		padding: 20px;
		border-radius: 20px;
		margin-bottom: 35px;
		box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.5);
	}

	.toggle-panel {
		cursor: pointer;
		position: absolute;
		right: 30px;
		margin-top: -5px;
		color: white;
		font-weight: bold;
		font-size: 20px;
		text-shadow: 1px 1px 1px black;
	}

	.title {
		text-align: center;
		display: inline-block;
		width: 100%;
		font-weight: bold;
	}

	.content {
		margin-top: 20px;
	}
</style>
