<script lang="ts">
	import Button, { Label } from '@smui/button';

	import { cart } from '$lib/stores/cart/store';
	import { currency } from '$lib/stores/currency/store';
	import { user } from '$lib/stores/user/store';
	import { getTranslation } from '$lib/translations';
	import { onClickInternalLink } from '$lib/utils/utils';
	import GlowingText from '../common/GlowingText.svelte';

	const getTotalFormatted = (): string => {
		return `${$currency.symbol}${$cart
			.map((v) => v.price.value)
			.reduce((previous, current) => previous + current)
			.toFixed(2)}`;
	};
</script>

{#key $cart}
	<footer>
		<div class="total-container">
			<span class="total-label">{getTranslation('cart.total')}: </span>
			<span class="total-price">
				<GlowingText text={getTotalFormatted()} />
			</span>
		</div>
		{#if $user.data !== null}
			<div class="payment-button">
				<Button variant="raised" color="secondary">
					<Label>{getTranslation('cart.proceed')}</Label>
				</Button>
			</div>
		{:else}
			<div class="auth-cta">
				<p>{getTranslation('cart.loginRequired')}</p>
				<div class="auth-buttons">
					<a onclick={onClickInternalLink} data-sveltekit-preload-data="tap" href="/sign-in">
						<Button variant="outlined" color="secondary">
							<Label>{getTranslation('cart.login')}</Label>
						</Button>
					</a>
					<a onclick={onClickInternalLink} data-sveltekit-preload-data="tap" href="/register">
						<Button variant="outlined" color="secondary">
							<Label>{getTranslation('cart.register')}</Label>
						</Button>
					</a>
				</div>
			</div>
		{/if}
	</footer>
{/key}

<style>
	footer {
		margin-top: 35px;
		border-top: 1px solid #333;
		padding-top: 15px;
	}

	.total-container {
		font-size: 40px;
		font-weight: bold;
	}

	.payment-button {
		margin-top: 10px;
	}

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
