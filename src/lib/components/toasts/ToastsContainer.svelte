<script lang="ts">
	import { SvelteToast } from '@zerodevx/svelte-toast';
</script>

<SvelteToast />

<style>
	:global(._toastItem) {
		text-shadow: black 1px 1px 2px !important;
		width: auto !important;
		font-size: 0.8em !important;
		font-weight: bold !important;
		height: auto !important;
		min-height: 0 !important;
	}
</style>
