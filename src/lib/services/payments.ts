import { PUBLIC_CRYPTO_GATEWAY_URL, PUBLIC_STORE_API_URL } from '$env/static/public';
import type { PaginatedResponse, Pagination } from '$lib/models/Pagination';
import { BLOCKCHAIN_CONFIRMED_STATUS, type Payment, type PaymentStatus } from '$lib/models/Payment';
import { cacheInvalidation } from '$lib/stores/cache-invalidation/store';
import { language } from '$lib/stores/language/store';
import { fetchWrapper } from '$lib/utils/fetch';
import { get } from 'svelte/store';
import type { PageLoadEvent } from '../../routes/[language]/$types';
import { getQueryParams } from './common';

export const getMyPayments = async (
	fetch: PageLoadEvent['fetch'],
	pagination: Pagination,
	status: number[] = []
): Promise<PaginatedResponse<Payment>> => {
	const statusQueryParam = status.reduce((acc, curr): string => {
		return acc + `&status[]=${curr}`;
	}, '');

	const response = await fetchWrapper(fetch)(
		`${PUBLIC_STORE_API_URL}/api/v1/payments/mine/?${getQueryParams(pagination, '', null, get(cacheInvalidation).myPurchases)}${statusQueryParam ? `${statusQueryParam}` : ``}`
	);

	return await response.json();
};

export const getPaymentByUUID = async (
	fetch: PageLoadEvent['fetch'],
	uuid: string
): Promise<Payment> => {
	const cacheParam = get(cacheInvalidation).myPurchases;
	const response = await fetchWrapper(fetch)(
		`${PUBLIC_STORE_API_URL}/api/v1/payments/mine/${uuid}${cacheParam ? `?cache=${cacheParam}` : ``}`
	);

	return await response.json();
};

export const confirmVideo = async (
	fetch: PageLoadEvent['fetch'],
	paymentUUID: string,
	videoUUID: string
): Promise<void> => {
	await fetchWrapper(fetch)(
		`${PUBLIC_STORE_API_URL}/api/v1/payments/buyer-confirmation/${paymentUUID}/${videoUUID}`,
		{
			method: 'PATCH'
		}
	);
};

type NewPaymentResponse = {
	uuid: string;
	cryptoGatewayInvoiceUUID: string;
};
export const newPayment = async (
	fetch: PageLoadEvent['fetch'],
	videoUUIDs: string[]
): Promise<NewPaymentResponse> => {
	const response = await fetchWrapper(fetch)(`${PUBLIC_STORE_API_URL}/api/v1/payments`, {
		method: 'POST',
		body: JSON.stringify({
			videos: videoUUIDs
		})
	});

	return (await response.json()) as NewPaymentResponse;
};

type CryptoWidgetPopupIncomingMessage = {
	invoice: {
		status: PaymentStatus;
	};
	type: 'status-update';
};
export const openCryptoWidgetPopup = (paymentUUID: string, cryptoGatewayUUID: string): void => {
	const widgetWindow = window.open(
		'',
		'popupWindow',
		'width=750,height=800,scrollbars=no'
	) as WindowProxy;

	widgetWindow.document.writeln(`
		<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width" />
            <script src="/widget.js"></script>
            <style>
				* {
					margin: 0;
					padding: 0;
				}
				body {
					overflow-x: hidden;
				}
				#crypto-widget-container-container {
					padding: 10px 16px;
					max-width: 750px;
					margin: 0 auto;
				}
            </style>
        </head>
        <body>
            <div id="crypto-widget-container-container">
            	<div id="crypto-widget-container"></div>
            </div>
            <script>
                CRYPTO_GATEWAY.init("${PUBLIC_CRYPTO_GATEWAY_URL}", "crypto-widget-container", "${cryptoGatewayUUID}");
            </script>
        </body>
        </html>
	`);

	window.addEventListener('message', ({ data }: MessageEvent<CryptoWidgetPopupIncomingMessage>) => {
		if (data.type !== 'status-update') {
			return;
		}

		if (data.invoice.status === BLOCKCHAIN_CONFIRMED_STATUS) {
			cacheInvalidation.refreshMyPurchases();
			widgetWindow.close();
			document.location.href = `/${get(language)}/admin/purchases/${paymentUUID}`;
			return;
		}

		cacheInvalidation.refreshMyPurchases();
	});
};
