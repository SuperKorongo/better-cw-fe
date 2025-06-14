<script lang="ts">
	import { PUBLIC_AD_BANNER_KEY } from '$env/static/public';
</script>

<div id={`container-${PUBLIC_AD_BANNER_KEY}`}></div>

<style>
	div {
		max-width: var(--thumbnail-width);
		max-height: var(--thumbnail-height);
		overflow: hidden;
		background-color: rgb(0, 0, 0);
		border-radius: var(--thumbnail-border-radius);
	}
</style>
