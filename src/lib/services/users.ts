import { PUBLIC_STORE_API_URL } from '$env/static/public';
import type { User } from '$lib/models/User';
import { fetchWrapper } from '$lib/utils/fetch';
import { apiError } from '../../errors/apiError';
import { user } from '../../stores/user/store';

export const login = async (email: string, password: string): Promise<User> => {
	const response = await fetchWrapper(window.fetch)(`${PUBLIC_STORE_API_URL}/api/v1/login`, {
		method: 'POST',
		body: JSON.stringify({ email, password })
	});

	if (!response.ok) {
		throw apiError(response);
	}

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

	if (!response.ok) {
		throw apiError(response);
	}

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
		const response = await fetchWrapper(window.fetch)(`${PUBLIC_STORE_API_URL}/api/v1/me`);

		if (!response.ok) {
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
