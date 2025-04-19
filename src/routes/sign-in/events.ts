import { goto } from '$app/navigation';
import * as toasts from '$lib/components/toasts/toasts';
import { login } from '$lib/services/users';
import { loading } from '$lib/stores/loading/store';
import { navigationHistory } from '$lib/stores/navigation/store';
import { user as userStore } from '$lib/stores/user/store';
import { getTranslation } from '$lib/translations';
import { get } from 'svelte/store';
import type { ApiError } from '../../errors/apiError';

export const onClickLoginButton = async (getEmail: () => string, getPassword: () => string) => {
	if (get(loading).value) {
		return;
	}

	if (!getEmail()) {
		toasts.warning(getTranslation('signInForm.errors.emptyEmail'));
		return;
	}
	if (getPassword().length < 8) {
		toasts.warning(getTranslation('signInForm.errors.invalidPassword'));
		return;
	}

	loading.set(true);
	try {
		const user = await login(getEmail(), getPassword());
		userStore.setData(user);
		toasts.success(getTranslation('signInForm.welcome'));

		const previousPage = get(navigationHistory).previousPage;
		goto(previousPage && previousPage !== '/logout' ? previousPage : '/');
	} catch (e: unknown) {
		const apiError = e as ApiError;

		if (!e || !(e as ApiError).getCode) {
			toasts.error(getTranslation('signInForm.errors.serverError'));
			return;
		} else {
			switch (apiError.getCode()) {
				case 400:
				case 401:
					toasts.error(getTranslation('signInForm.errors.invalidCredentials'));
					break;
				default:
					toasts.error(getTranslation('signInForm.errors.serverError'));
			}
		}
	} finally {
		loading.set(false);
	}
};
