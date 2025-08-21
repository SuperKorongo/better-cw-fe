<script lang="ts">
	import Button, { Label } from '@smui/button';

	import { cart } from '$lib/stores/cart/store';
	import { currency } from '$lib/stores/currency/store';
	import { user } from '$lib/stores/user/store';
	import { getTranslation } from '$lib/translations';
	import AuthCta from '../auth-cta/AuthCTA.svelte';
	import GlowingText from '../common/GlowingText.svelte';
	import { onClickProceedToPayment } from './events';

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
				<Button onclick={onClickProceedToPayment} variant="raised" color="secondary">
					<Label>{getTranslation('cart.proceed')}</Label>
				</Button>
			</div>
		{:else}
			<AuthCta text={getTranslation('cart.loginRequired')} />
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
</style>
