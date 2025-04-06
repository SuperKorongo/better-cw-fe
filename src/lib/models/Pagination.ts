export type PaginatedResponse<T> = {
	data: T[];
	meta: {
		page: number;
		totalPages: number;
		totalItems: number;
	};
};

export type OrderBy = {
	column:
		| 'uploaded_at'
		| 'price_in_cents_of_dollar'
		| 'rating'
		| 'total_ratings'
		| 'title'
		| 'money_generated_in_btc';
	direction: 'asc' | 'desc';
};
export type Pagination = {
	limit: number;
	offset: number;
	orderBy: OrderBy | null;
};

export const DEFAULT_PAGINATION: Pagination = {
	limit: 25,
	offset: 0,
	orderBy: {
		column: 'uploaded_at',
		direction: 'desc'
	}
};
