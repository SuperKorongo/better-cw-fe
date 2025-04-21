import { getTranslation } from '$lib/translations';

export const tableHeader = [
	{ columnId: 'updated_at', label: getTranslation('purchases.table.createdAt') },
	{ columnId: 'uuid', label: getTranslation('purchases.table.uuid') },
	{ columnId: 'price_in_cents_of_dollar', label: getTranslation('purchases.table.priceUSD') },
	{ columnId: 'price_in_btc', label: getTranslation('purchases.table.priceBTC') },
	{ columnId: 'status', label: getTranslation('purchases.table.status') },
	{ columnId: 'videos', label: getTranslation('purchases.table.videos') }
];

export const allowedRowsPerPage: number[] = [10, 25];
