import { goto } from '$app/navigation';
import { PUBLIC_DOMAIN } from '$env/static/public';
import { newPayment } from '$lib/services/payments';
import { cacheInvalidation } from '$lib/stores/cache-invalidation/store';
import { cart } from '$lib/stores/cart/store';
import { loading } from '$lib/stores/loading/store';
import { getTranslation } from '$lib/translations';
import { get } from 'svelte/store';
import * as toasts from '../toasts/toasts';

const MIN_CART_PRICE_IN_USD = 5;

export const onClickProceedToPayment = async (): Promise<void> => {
	let totalPriceInUSD = 0;
	let videoUUIDs = [];

	for (const video of get(cart)) {
		videoUUIDs.push(video.uuid);
		totalPriceInUSD += video.price.value;
	}

	if (totalPriceInUSD < MIN_CART_PRICE_IN_USD) {
		toasts.warning(getTranslation('cart.minPrice'));
		return;
	}

	try {
		loading.set(true);
		const response = await newPayment(window.fetch, videoUUIDs);
		cacheInvalidation.refreshMyPurchases();
		cart.clean();
		goto(`/admin/purchases/${response.uuid}`);

		const widgetWindow = window.open(
			`${PUBLIC_DOMAIN}/crypto-widget?uuid=${response.cryptoGatewayInvoiceUUID}`,
			'popupWindow',
			'width=750,height=800,scrollbars=no'
		);

		// todo: add message event listener to widgetWindow and listen for status update changes.
	} catch {
		toasts.error(getTranslation('common.errors.generic'));
	} finally {
		loading.set(false);
	}
};
