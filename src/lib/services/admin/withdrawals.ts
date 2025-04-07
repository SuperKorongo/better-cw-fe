import { PUBLIC_STORE_API_URL } from '$env/static/public';
import type { Pagination } from '$lib/models/Pagination';
import { fetchWrapper } from '$lib/utils/fetch';
import { apiError } from '../../../errors/apiError';
import { getQueryParams } from '../common';

export type Withdrawal = {
	id: number;
	uuid: string;
	coin: string;
	amount: number;
	blockchainTransaction: string;
	blockchainFee: number;
	createdAtTimestamp: number;
	processedAtTimestamp: number;
	failureReason: string;
};

export type WithdrawalsResponse = {
	data: Withdrawal[];
	meta: {
		page: number;
		totalPages: number;
		totalItems: number;
	};
};

export const getWithdrawals = async (pagination: Pagination): Promise<WithdrawalsResponse> => {
	const response = await fetchWrapper(window.fetch)(
		`${PUBLIC_STORE_API_URL}/api/v1/withdrawals/?${getQueryParams(pagination)}`
	);

	if (!response.ok) {
		throw apiError(response);
	}

	return response.json();
};

export const createWithdrawal = async (address: string, netAmount: number): Promise<void> => {
	const response = await fetchWrapper(window.fetch)(`${PUBLIC_STORE_API_URL}/api/v1/withdrawals`, {
		method: 'PUT',
		body: JSON.stringify({
			estimatedArrivalInBlocks: 10,
			coin: 'BTC',
			address,
			netAmount
		})
	});

	if (!response.ok) {
		throw apiError(response);
	}
};
