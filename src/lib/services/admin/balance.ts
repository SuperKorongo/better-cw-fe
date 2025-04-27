import { PUBLIC_STORE_API_URL } from '$env/static/public';
import { fetchWrapper } from '$lib/utils/fetch';

export type Balance = {
	netBalanceInBTC: number;
	grossBalanceInBTC: number;
};

export const getBalance = async (): Promise<Balance> => {
	const response = await fetchWrapper(window.fetch)(`${PUBLIC_STORE_API_URL}/api/v1/me/balance`);
	return await response.json();
};
