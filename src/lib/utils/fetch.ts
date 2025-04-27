import { goto } from '$app/navigation';
import * as toasts from '$lib/components/toasts/toasts';
import { user } from '$lib/stores/user/store';
import { getTranslation } from '$lib/translations';
import { apiError } from '../../errors/apiError';

export const fetchWrapper = (fetchFunc: typeof window.fetch) => {
	const handle401 = (response: Response): Response => {
		toasts.warning(getTranslation('common.errors.sessionExpired'));
		user.setData(null);
		goto('/logout');
		return response;
	};

	const handle429 = (response: Response): Response => {
		// todo
		/**
		 * For 429 nginx returns an html
		 * Then whe caller of this function always does response.json in a try catch,
		 * triggering the error toast with generic error message.
		 * To avoid that we should return empty JSON from nginx on errors.
		 */
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
				throw apiError(response);
		}
	};
};
