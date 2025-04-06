import { PUBLIC_STORE_API_URL } from '$env/static/public';
import { fetchWrapper } from '$lib/utils/fetch';
import { apiError } from '../../../errors/apiError';

export type Balance = {
	balanceInBTC: number;
};

export const getBalance = async (): Promise<Balance> => {
	const response = await fetchWrapper(window.fetch)(`${PUBLIC_STORE_API_URL}/api/v1/me/balance`);

	if (!response.ok) {
		throw apiError(response);
	}

	return await response.json();
};
