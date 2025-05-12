<script lang="ts">
	import { language } from '$lib/stores/language/store';
	import { user } from '$lib/stores/user/store';
	import { getTranslation } from '$lib/translations';
	import { onClickInternalLink } from '$lib/utils/utils';
</script>

<section>
	{#if $user.data !== null}
		<button class="logout-button">
			<a data-sveltekit-preload-data="tap" href="/logout">
				{getTranslation('menu.logout')}
			</a>
		</button>
	{:else}
		<button class="sign-in-button">
			<a
				onclick={onClickInternalLink}
				data-sveltekit-preload-data="tap"
				href={`/${$language}/sign-in`}
			>
				{getTranslation('menu.signIn')}
			</a>
		</button>
		<button class="register-button">
			<a
				onclick={onClickInternalLink}
				data-sveltekit-preload-data="tap"
				href={`/${$language}/register`}
			>
				{getTranslation('menu.register')}
			</a>
		</button>
	{/if}
</section>

<style>
	section {
		border-top: 2px solid rgb(61, 0, 182);
		padding-top: 20px;
	}
	button {
		border-radius: 10px;
		padding: 12px 20px;
		font-size: 15px;
		cursor: pointer;
		font-weight: bold;
	}
	.sign-in-button {
		background: rgb(0, 58, 204);
		color: #eee;
		margin-right: 10px;
		margin-bottom: 10px;
	}
	.register-button {
		background: white;
	}
	.logout-button {
		background-color: rgb(0, 0, 0);
		color: white;
		font-size: 12px;
		font-weight: bold;
	}
</style>
