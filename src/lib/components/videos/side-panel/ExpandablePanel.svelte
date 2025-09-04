<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		isVisible,
		component
	}: { title: string; isVisible: boolean; component: () => ReturnType<Snippet> } = $props();

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
		background: linear-gradient(45deg, #fbfbfb, #fff);
		padding: 20px;
		border-radius: 20px;
		margin-bottom: 35px;
		box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.5);
		color: black;
	}

	.toggle-panel {
		cursor: pointer;
		position: absolute;
		right: 30px;
		margin-top: -5px;
		color: black;
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
