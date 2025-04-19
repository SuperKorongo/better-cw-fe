import { getTranslation } from '$lib/translations';

export const tableHeader = [
	{
		columnId: 'title',
		label: getTranslation('admin.myVideos.title'),
		sortable: true
	},
	{
		columnId: 'price_in_cents_of_dollar',
		label: getTranslation('admin.myVideos.price'),
		sortable: true
	},
	{
		columnId: 'uploaded_at',
		label: getTranslation('admin.myVideos.uploadedAt'),
		sortable: true
	},
	{
		columnId: 'money_generated_in_btc',
		label: getTranslation('admin.myVideos.moneyGeneratedInBTC'),
		sortable: true
	},
	{
		columnId: 'active',
		label: getTranslation('admin.myVideos.active'),
		sortable: true
	}
];

export const allowedRowsPerPage: number[] = [10, 25];
