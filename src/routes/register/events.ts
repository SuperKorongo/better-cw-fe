import { goto } from '$app/navigation';
import * as toasts from '$lib/components/toasts/toasts';
import { register } from '$lib/services/users';
import { loading } from '$lib/stores/loading/store';
import { menu } from '$lib/stores/menu/store';
import { user as userStore } from '$lib/stores/user/store';
import { getTranslation } from '$lib/translations';
import { get } from 'svelte/store';
import type { ApiError } from '../../errors/apiError';
import { navigationHistory } from '$lib/stores/navigation/store';

export const onClickRegisterButton = async (
	getUsername: () => string,
	getEmail: () => string,
	getPassword: () => string,
	getRepeatPassword: () => string
) => {
	if (get(loading).value) {
		return;
	}

	if (getPassword() !== getRepeatPassword()) {
		toasts.warning(getTranslation('signUpForm.errors.passwordsDontMatch'));
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

	if (getUsername().length < 3) {
		toasts.warning(getTranslation('signUpForm.errors.invalidUsername'));
		return;
	}

	if (!new RegExp('^[a-zA-Z0-9]*$').test(getUsername())) {
		toasts.warning(getTranslation('signUpForm.errors.usernameOnlyAlphanumeric'));
		return;
	}

	loading.set(true);
	try {
		const user = await register(getUsername(), getEmail(), getPassword());
		userStore.setData(user);
		toasts.success(getTranslation('signInForm.welcome'));
		menu.forceOpenAfterNavigate(true);

		goto(navigationHistory.getAppropiateRedirectAfterLogin());
	} catch (e: unknown) {
		const apiError = e as ApiError;

		switch (apiError.getCode()) {
			case 400:
			case 401:
				toasts.error(getTranslation('signInForm.errors.invalidCredentials'));
				break;
			case 409:
				toasts.error(getTranslation('signUpForm.errors.usernameAlreadyExists'));
				break;
			default:
				toasts.error(getTranslation('signInForm.errors.serverError'));
		}
	} finally {
		loading.set(false);
	}
};
