import { goto } from '$app/navigation';
import * as toasts from '$lib/components/toasts/toasts';
import { user } from '../../stores/user/store';
import { getTranslation } from '../../translations';

export const fetchWrapper = (fetchFunc: typeof window.fetch) => {
	const handle401 = (response: Response): Response => {
		user.setData(null);
		goto('/logout');
		return response;
	};

	const handle429 = (response: Response): Response => {
		toasts.warning(getTranslation('common.errors.tooManyRequests'));
		return response;
	};

	return async (input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> => {
		const response = await fetchFunc(input, {
			credentials: 'include',
			...init
		});

		if (response.ok) {
			return response;
		}

		switch (response.status) {
			case 401:
				return handle401(response);
			case 429:
				return handle429(response);
			default:
				return response;
		}
	};
};
