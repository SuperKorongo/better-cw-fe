<script lang="ts">
	import type { Video } from '$lib/models/Video';
	import { getDownloadLink } from '$lib/services/videos';
	import { loading } from '$lib/stores/loading/store';
	import { user } from '$lib/stores/user/store';
	import { getTranslation } from '$lib/translations';
	import Button from '@smui/button';
	import { onMount } from 'svelte';
	import AuthCTA from '../auth-cta/AuthCTA.svelte';
	import GlowingText from '../common/GlowingText.svelte';
	import UploaderLink from '../common/UploaderLink.svelte';

	let {
		video,
		onClickWatchVideo
	}: {
		video: Video;
		onClickWatchVideo: (link: string) => void;
	} = $props();

	let downloadLink = $state('');

	onMount(async () => {
		if (!$user.data) return;

		loading.set(true);
		try {
			const { link } = await getDownloadLink(video.uuid);
			downloadLink = link;
		} catch (error) {
			loading.set(false);
			loading.set(true);
		} finally {
			loading.set(false);
		}
	});
</script>

<div class="main-container">
	<div class="inner">
		<div class="inner-section">
			{getTranslation('video.friendsOnly1')}
			<span class="uploader-link">
				<GlowingText>
					{#snippet component()}
						<UploaderLink uploader={video.uploader} />
					{/snippet}
				</GlowingText>
			</span>
		</div>
		<div class="inner-section">
			{getTranslation('video.friendsOnly2')}
			<span class="uploader-link">
				<GlowingText>
					{#snippet component()}
						<UploaderLink uploader={video.uploader} />
					{/snippet}
				</GlowingText>
			</span>
			{getTranslation('video.friendsOnly3')}
		</div>
		{#if $user.data === null}
			<div class="inner-section">
				<AuthCTA />
			</div>
		{:else if !$loading.value && !downloadLink}
			<div class="inner-section">
				TODO - either show button to add friend or show "you already sent a friend request"
			</div>
		{/if}
		{#if downloadLink}
			<div class="inner-section">
				<Button onclick={() => onClickWatchVideo(downloadLink)} variant="raised" color="primary">
					{getTranslation('video.friendsWatch')}
				</Button>
			</div>
		{/if}
	</div>
</div>

<style>
	.inner {
		padding: 30px 15px;
		text-align: center;
		position: absolute;
		top: 50%;
		left: 50%;
		width: 100%;
		text-shadow: 1px 1px 1px rgb(54, 0, 116);
	}

	.inner-section {
		padding-top: 30px;
		padding-left: 20px;
		padding-right: 20px;
	}

	.main-container {
		background-color: rgba(0, 0, 0, 0.7);
		position: relative;
		width: 100%;
		z-index: 1;
		border-radius: 20px;
	}

	.uploader-link {
		font-weight: bold;
		text-shadow: none;
	}

	@media (max-width: 600px) {
		.inner {
			font-size: 17px;
			transform: translate(-50%, -60%);
		}
		.main-container {
			height: 250px;
			margin-bottom: -290px;
		}
	}
	@media (min-width: 600px) {
		.inner {
			font-size: 25px;
			transform: translate(-50%, -85%);
		}
		.main-container {
			height: 500px;
			margin-bottom: -540px;
		}
	}
	@media (min-width: 1921px) {
		.inner {
			font-size: 30px;
			transform: translate(-50%, -85%);
		}
		.main-container {
			height: 650px;
			margin-bottom: -690px;
		}
	}
	@media (min-width: 2500px) {
		.inner {
			font-size: 30px;
			transform: translate(-50%, -85%);
		}
		.main-container {
			height: 800px;
			margin-bottom: -840px;
		}
	}
</style>
