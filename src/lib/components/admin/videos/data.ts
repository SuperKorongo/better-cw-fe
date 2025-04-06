import { getTranslation } from '../../../../translations';

export const tableHeader = [
	{
		columnId: 'title',
		label: getTranslation('admin.myVideos.title')
	},
	{
		columnId: 'price_in_cents_of_dollar',
		label: getTranslation('admin.myVideos.price')
	},
	{
		columnId: 'uploaded_at',
		label: getTranslation('admin.myVideos.uploadedAt')
	},
	{
		columnId: 'money_generated_in_btc',
		label: getTranslation('admin.myVideos.moneyGeneratedInBTC')
	},
	{
		columnId: 'active',
		label: getTranslation('admin.myVideos.active')
	}
];

export const allowedRowsPerPage: number[] = [10, 25];
