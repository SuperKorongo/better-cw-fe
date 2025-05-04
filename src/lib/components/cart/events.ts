import { goto } from '$app/navigation';
import { newPayment } from '$lib/services/payments';
import { cacheInvalidation } from '$lib/stores/cache-invalidation/store';
import { cart } from '$lib/stores/cart/store';
import { loading } from '$lib/stores/loading/store';
import { getTranslation } from '$lib/translations';
import { openCryptoWidgetPopup } from '$lib/utils/utils';
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
		openCryptoWidgetPopup(response.cryptoGatewayInvoiceUUID);
	} catch {
		toasts.error(getTranslation('common.errors.generic'));
	} finally {
		loading.set(false);
	}
};
