<script lang="ts">
	import { getEmpty as getEmptyVideo, type Video } from '$lib/models/Video';
	import { getTranslation } from '$lib/translations';
	import {
		getDurationString,
		getFormattedPrice,
		getHrefWithLanguage,
		getImageSrc,
		getPlaceholderImageSrc
	} from '$lib/utils/utils';
	import { onMount } from 'svelte';
	import GlowingText from '../common/GlowingText.svelte';
	import StarRating from '../common/StarRating.svelte';
	import UploaderLink from '../common/UploaderLink.svelte';
	import { eventFunctions } from './thumbnail';

	let {
		video
	}: {
		video: Video;
	} = $props();

	video = video ?? getEmptyVideo();

	let imgElement: HTMLImageElement;

	const { onMouseOver, onMouseOut, preload, onClick } = eventFunctions(
		video.thumbnailFilePaths,
		() => imgElement
	);

	const _onClick = async (e: MouseEvent): Promise<void> => onClick(e, video);

	onMount(preload);
</script>

<figure>
	<a
		data-sveltekit-preload-data="false"
		href={getHrefWithLanguage(`/videos/${video.uuid}`)}
		onclick={_onClick}
		onauxclick={_onClick}
	>
		<img
			onfocus={onMouseOver}
			onblur={onMouseOut}
			onmouseover={onMouseOver}
			onmouseout={onMouseOut}
			bind:this={imgElement}
			alt={video.title}
			src={video.thumbnailFilePaths.length > 0
				? getImageSrc(video.thumbnailFilePaths[0], true)
				: getPlaceholderImageSrc()}
		/>
		<div class="rating-and-duration-container">
			<div class="rating-container">
				<StarRating value={video.rating} />
			</div>
			<div class="duration-container">
				<span class="duration">{getDurationString(video.durationInSeconds)}</span>
			</div>
		</div>
	</a>

	<figcaption>
		<div>
			<a
				data-sveltekit-preload-data="tap"
				href={getHrefWithLanguage(`/videos/${video.uuid}`)}
				onclick={_onClick}
				onauxclick={_onClick}
				class="title"
				title={video.title}>{video.title}</a
			>
			<span class="uploaded-by">
				{getTranslation('homepage.videoBy')}
				<UploaderLink uploader={video.uploader} />
			</span>
			<span class="price">
				{#if video.price.value}
					{getFormattedPrice(video.price)}
				{:else}
					<GlowingText text={getTranslation('video.free')} />
				{/if}
			</span>
		</div>
	</figcaption>
</figure>

<style>
	figure {
		height: var(--thumbnail-height);
		max-width: calc(100px + var(--thumbnail-width));
		margin: 0;
	}

	img {
		border-radius: var(--thumbnail-border-radius);
		cursor: pointer;
		width: 100%;
		height: 80%;
		margin-bottom: -30px;
	}

	.rating-and-duration-container {
		margin-bottom: 15px;
		margin-top: -3px;
	}
	.rating-container {
		display: inline-block;
		width: 80%;
		height: 25px;
		padding-left: 10px;
	}
	.duration-container {
		position: absolute;
		display: inline-block;
		text-align: right;
		margin-right: 10px;
	}
	.duration {
		background: rgba(0, 0, 0, 0.5);
		padding: 3px 7px;
		font-size: 13px;
		font-weight: bold;
		border-radius: 5px;
	}

	.title {
		margin-top: 5px;
		font-weight: bold;
		font-size: 18px;
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		margin-bottom: 5px;
		line-height: 28px;
		letter-spacing: 0.2px;
	}

	.uploaded-by {
		color: #aaa;
		font-size: 13px;
	}

	.price {
		float: right;
		padding-right: 10px;
		font-size: 16px;
		color: #dddddd;
		font-weight: bold;
	}
</style>
