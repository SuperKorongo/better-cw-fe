import { PUBLIC_STORE_API_URL } from '$env/static/public';
import type { User } from '$lib/models/User';
import { cacheInvalidation } from '$lib/stores/cache-invalidation/store';
import { user } from '$lib/stores/user/store';
import { fetchWrapper } from '$lib/utils/fetch';
import { get } from 'svelte/store';

export const login = async (email: string, password: string): Promise<User> => {
	const response = await fetchWrapper(window.fetch)(`${PUBLIC_STORE_API_URL}/api/v1/login`, {
		method: 'POST',
		body: JSON.stringify({ email, password })
	});

	const loginResponse = (await response.json()) as {
		me: User;
	};

	return loginResponse.me;
};

export const register = async (
	username: string,
	email: string,
	password: string
): Promise<User> => {
	const response = await fetchWrapper(window.fetch)(`${PUBLIC_STORE_API_URL}/api/v1/register`, {
		method: 'POST',
		body: JSON.stringify({ username, email, password })
	});

	const registerResponse = (await response.json()) as {
		me: User;
	};

	return registerResponse.me;
};

export const logout = async (): Promise<void> => {
	await fetchWrapper(window.fetch)(`${PUBLIC_STORE_API_URL}/api/v1/logout`, {
		method: 'GET'
	});
};

export const initLoggedInUser = async (): Promise<void> => {
	try {
		const cacheParam = get(cacheInvalidation).me;

		let response: Response;
		try {
			response = await fetchWrapper(window.fetch)(
				`${PUBLIC_STORE_API_URL}/api/v1/me/${cacheParam ? `?cache=${cacheParam}` : ``}`
			);
		} catch {
			user.setData(null);
			return;
		}

		try {
			user.setData(await response.json());
		} catch (e: unknown) {
			user.setData(null);
			throw e;
		}
	} catch (e: unknown) {
		user.setData(null);
		throw e;
	}
};

export const changePassword = async (
	currentPassword: string,
	newPassword: string
): Promise<void> => {
	await fetchWrapper(window.fetch)(`${PUBLIC_STORE_API_URL}/api/v1/change-password`, {
		method: 'PATCH',
		body: JSON.stringify({ currentPassword, newPassword })
	});
};
