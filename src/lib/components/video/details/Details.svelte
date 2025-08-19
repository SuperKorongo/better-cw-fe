<script lang="ts">
	import type { Video } from '$lib/models/Video';
	import AddToCart from './AddToCart.svelte';
	import Meta from './Meta.svelte';
	import Tags from './Tags.svelte';

	let {
		video,
		showRatingComponent
	}: {
		video: Video;
		showRatingComponent: boolean;
	} = $props();
</script>

<section class="price-and-meta">
	<div class="price-container">
		<AddToCart {video} {showRatingComponent} />
	</div>
	<div class="meta">
		<Meta {video} />
	</div>
</section>

<section class="tags-and-description">
	<Tags tags={video.tags} />
	<div class="description">{video.description}</div>
</section>

<style>
	.price-and-meta {
		margin-top: 20px;
		margin-bottom: 30px;
		display: grid;
		padding: 0 50px;
	}

	.meta {
		display: grid;
		text-wrap: nowrap;
		row-gap: 5px;
	}

	.tags-and-description {
		margin-top: 25px;
	}

	.description {
		margin-top: 20px;
		padding: 20px 0px;
		border-top: 1px solid black;
	}
	@media (max-width: 600px) {
		.price-container {
			text-align: center;
			margin-bottom: 25px;
		}
		.meta {
			text-align: center;
			grid-template-columns: 50% 50%;
		}
	}
	@media (min-width: 600px) {
		.price-and-meta {
			grid-template-rows: 100%;
			grid-template-columns: 35% 65%;
		}
		.meta {
			margin-left: 50px;
			padding-left: 50px;
			grid-template-columns: 50% 50%;
		}
		.price-container {
			padding-left: 50px;
		}
	}
	@media (min-width: 1500px) {
		.meta {
			grid-template-columns: 30% 70%;
		}
	}
</style>
