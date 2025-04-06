<script lang="ts">
	import Button, { Label } from '@smui/button';

	import { cart } from '$lib/stores/cart/store';
	import { currency } from '$lib/stores/currency/store';
	import { getTranslation } from '$lib/translations';
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
		<div class="payment-button">
			<Button variant="raised" color="secondary">
				<Label>{getTranslation('cart.proceed')}</Label>
			</Button>
		</div>
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
