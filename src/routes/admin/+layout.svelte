<script lang="ts">
	import Balance from '$lib/components/admin/balance/Balance.svelte';
	import AdminMenu from '$lib/components/admin/menu/AdminMenu.svelte';
	import GlowingText from '$lib/components/common/GlowingText.svelte';
	import RightArrows from '$lib/components/icons/RightArrows.svelte';
	import { getTranslation } from '$lib/translations';
	import { isMobileScreen, onClickInternalLink } from '$lib/utils/utils';
	import Button from '@smui/button';
	import { loading } from '../../stores/loading/store';
	import { adminMenu } from '../../stores/menu/store';
	import { user } from '../../stores/user/store';

	$effect.pre(() => {
		if (!$user.ready) return;
		loading.set(false);

		if ($user.data && !isMobileScreen()) {
			adminMenu.setVisibility(true);
		}
	});

	let { children } = $props();
</script>

{#if $user.ready && $user.data !== null}
	{#key $adminMenu.isVisible}
		{#if $adminMenu.isVisible}
			<AdminMenu />
		{:else if isMobileScreen()}
			<button class="menu-button" onclick={() => adminMenu.setVisibility(true)}>
				<RightArrows width="20px" />
			</button>
		{/if}
	{/key}
	<main class="main-container">
		<Balance />
		{@render children()}
	</main>
{/if}

{#if $user.ready && $user.data === null}
	<main class="main-no-user">
		<div class="no-user">
			<h1 class="title">
				<GlowingText text={getTranslation('upload.title')} />
			</h1>
			<span class="sign-in-first">
				{getTranslation('admin.onlyRegistered')}
			</span>
			<a onclick={onClickInternalLink} data-sveltekit-preload-data="tap" href="/sign-in">
				<Button color="secondary">{getTranslation('upload.signIn')}</Button>
			</a>
			<a onclick={onClickInternalLink} data-sveltekit-preload-data="tap" href="/register">
				<Button variant="raised">{getTranslation('upload.register')}</Button>
			</a>
		</div>
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
	.no-user {
		margin-top: 50px;
		text-align: center;
	}

	.menu-button {
		background-color: #010c2f;
		position: fixed;
		top: calc(var(--navbar-height) + 10px);
		left: 10px;
		box-shadow: 0px 0px 10px 0px white;
		z-index: 2;
		width: 50px;
		height: 50px;
		color: white;
	}

	@media (max-width: 900px) {
		.main-container,
		.main-no-user {
			left: 2.5%;
			width: 95%;
		}
	}
	@media (min-width: 900px) {
		.main-container {
			left: 400px;
			width: calc(100% - 400px);
		}
	}
	@media (min-width: 1200px) {
		.main-container {
			left: 400px;
			width: calc(100% - 400px);
		}
		.main-no-user {
			left: 20%;
			width: 60%;
		}
	}
	@media (min-width: 1600px) {
		.main-container {
			left: 400px;
			width: calc(100% - 400px);
		}
		.main-no-user {
			left: 25%;
			width: 50%;
		}
	}
</style>
