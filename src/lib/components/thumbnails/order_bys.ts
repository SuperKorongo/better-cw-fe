import { getTranslation } from '../../../translations';

export const ORDER_BYS = [
	{
		label: getTranslation('common.orderBy.uploadedAtAsc'),
		value: 'uploaded_at|asc'
	},
	{
		label: getTranslation('common.orderBy.uploadedAtDesc'),
		value: 'uploaded_at|desc'
	},
	{
		label: getTranslation('common.orderBy.priceAsc'),
		value: 'price_in_cents_of_dollar|asc'
	},
	{
		label: getTranslation('common.orderBy.priceDesc'),
		value: 'price_in_cents_of_dollar|desc'
	},
	{
		label: getTranslation('common.orderBy.ratingAsc'),
		value: 'rating|asc'
	},
	{
		label: getTranslation('common.orderBy.ratingDesc'),
		value: 'rating|desc'
	},
	{
		label: getTranslation('common.orderBy.totalRatingsAsc'),
		value: 'total_ratings|asc'
	},
	{
		label: getTranslation('common.orderBy.totalRatingsDesc'),
		value: 'total_ratings|desc'
	}
];
