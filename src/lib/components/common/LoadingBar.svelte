<script lang="ts">
	import { loading } from '$lib/stores/loading/store';
	import { cubicOut } from 'svelte/easing';
	import { Tween } from 'svelte/motion';

	const progress = new Tween(0, { easing: cubicOut });
	const opacity = new Tween(0, { easing: cubicOut });

	function onLoadingData() {
		opacity.set(1, { duration: 0 });
		progress.set(0.8, { duration: 5000 });
	}

	function onFinishedLoadingData() {
		const duration = 1000;

		progress.set(1, { duration });
		opacity.set(0, { duration: duration / 2, delay: duration / 2 });

		setTimeout(() => progress.set(0, { duration: 0 }), duration);
	}

	$effect(() => {
		if ($loading.value && $loading.showLoadingBar) {
			onLoadingData();
		} else {
			onFinishedLoadingData();
		}
	});
</script>

<div class="progress-container" style={`opacity: ${opacity.current}`}>
	<div class="progress" style={`--width: ${progress.current}`}></div>
</div>

<style>
	.progress-container {
		position: fixed;
		z-index: 2;
		top: 0;
		left: 0;
		width: 100%;
		pointer-events: none;
		contain: paint;
		height: 0.275em;
		z-index: 999;
		will-change: opacity;

		background-color: hsla(345deg, 10%, 18%, 0.3);
	}
	.progress {
		left: 0;
		top: 0;
		height: 100%;
		background-color: #ff0040;
		pointer-events: none;
		transform-origin: left;
		transform: scaleX(var(--width));
	}
</style>
