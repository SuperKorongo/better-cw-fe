<script lang="ts">
	let {
		onClick
	}: {
		onClick: () => void;
	} = $props();

	let clicked: boolean = false;
</script>

<div
	class="overlay"
	onclick={() => {
		if (clicked) return;

		onClick();
		clicked = true;
	}}
	role="none"
></div>

<style>
	.overlay {
		background: rgba(0, 0, 0, 0.5);
		position: fixed;
		top: 0%;
		left: 0%;
		width: 100%;
		height: 100%;
	}
</style>
