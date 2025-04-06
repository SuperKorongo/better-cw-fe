<script lang="ts">
	import GlowingText from '$lib/components/common/GlowingText.svelte';
	import Upload from '$lib/components/video-form/VideoForm.svelte';
	import { getEmpty } from '$lib/models/Video';
	import { onClickInternalLink } from '$lib/utils/utils';
	import Button from '@smui/button';
	import { loading } from '../../stores/loading/store';
	import { user } from '../../stores/user/store';
	import { getTranslation } from '../../translations';

	$effect(() => {
		if ($user.ready) {
			loading.set(false);
		}
	});
</script>

{#if $user.ready}
	<main>
		{#if $user.data === null}
			<div class="no-user">
				<h1 class="title">
					<GlowingText text={getTranslation('upload.title')} />
				</h1>
				<span class="sign-in-first">
					{getTranslation('upload.signInFirst')}
				</span>
				<a onclick={onClickInternalLink} data-sveltekit-preload-data="tap" href="/sign-in">
					<Button color="secondary">{getTranslation('upload.signIn')}</Button>
				</a>
				<a onclick={onClickInternalLink} data-sveltekit-preload-data="tap" href="/register">
					<Button variant="raised">{getTranslation('upload.register')}</Button>
				</a>
			</div>
		{:else}
			<Upload
				type="upload"
				video={{ ...getEmpty(), downloadLink: '', downloadLinkInstructions: '' }}
			/>
		{/if}
	</main>
{/if}

<style>
	main {
		color: black;
		top: var(--navbar-height);
		position: absolute;
		background: rgb(255, 255, 255);
		padding-bottom: 50px;
		z-index: -1;
		box-shadow: 0px 0px 10px 5px #686800;
	}
	.sign-in-first {
		display: block;
		margin-bottom: 20px;
	}

	.title {
		width: 100%;
		text-align: center;
		font-size: 30px;
	}
	.no-user {
		margin-top: 50px;
		text-align: center;
	}

	@media (max-width: 600px) {
		main {
			left: 2.5%;
			width: 95%;
		}
	}
	@media (min-width: 600px) {
		main {
			left: 10%;
			width: 80%;
		}
	}
	@media (min-width: 1200px) {
		main {
			left: 20%;
			width: 60%;
		}
	}
	@media (min-width: 1600px) {
		main {
			left: 25%;
			width: 50%;
		}
	}
</style>
