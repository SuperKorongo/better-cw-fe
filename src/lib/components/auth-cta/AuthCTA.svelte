<script lang="ts">
	import { getTranslation } from '$lib/translations';
	import { getHrefWithLanguage, onClickInternalLink } from '$lib/utils/utils';
	import Button, { Label } from '@smui/button';

	let { text }: { text?: string } = $props();
</script>

<div class="auth-cta">
	<p>{text}</p>
	<div class="auth-buttons">
		<a
			onclick={onClickInternalLink}
			data-sveltekit-preload-data="tap"
			href={getHrefWithLanguage(`/sign-in`)}
		>
			<Button variant="raised" color="secondary">
				<Label>{getTranslation('cart.login')}</Label>
			</Button>
		</a>
		<a
			onclick={onClickInternalLink}
			data-sveltekit-preload-data="tap"
			href={getHrefWithLanguage(`/register`)}
		>
			<Button variant="raised" color="secondary">
				<Label>{getTranslation('cart.register')}</Label>
			</Button>
		</a>
	</div>
</div>

<style>
	.auth-cta {
		margin-top: 20px;
		text-align: center;
	}

	.auth-cta p {
		margin-bottom: 15px;
		font-size: 18px;
		color: #666;
	}

	.auth-buttons {
		display: flex;
		gap: 10px;
		justify-content: center;
	}
</style>
