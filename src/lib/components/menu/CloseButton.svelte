<script lang="ts">
	let {
		onClick
	}: {
		onClick: () => void;
	} = $props();
</script>

<button aria-label="close" type="button" onclick={onClick}>
	<svg width="40" height="40">
		<path d="M 10,10 L 30,30 M 30,10 L 10,30" />
	</svg>
</button>

<style>
	button {
		position: absolute;
		right: 0%;
		top: 0%;
		cursor: pointer;
		margin: 6px;
		padding: 6px;
	}
	svg {
		stroke: white;
		stroke-width: 2;
	}
</style>
