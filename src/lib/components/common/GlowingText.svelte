<script lang="ts">
	import type { Snippet } from 'svelte';

	let { text, component }: { text?: string; component?: () => ReturnType<Snippet> } = $props();
</script>

<span>
	{text}
	{#if component}
		{@render component()}
	{/if}
</span>

<style>
	@property --k {
		syntax: '<number>';
		initial-value: 0;
		inherits: false;
	}

	span {
		--k: 0;
		background: linear-gradient(
				90deg,
				hsl(calc(var(--k) * 1turn), 95%, 65%),
				hsl(calc(var(--k) * 1turn + 90deg), 95%, 65%)
			)
			text;
		color: transparent;
		filter: url(#f);
		animation: k 4s linear infinite;
	}

	@keyframes k {
		to {
			--k: 1;
		}
	}
</style>
