import { goto } from '$app/navigation';
import * as toasts from '$lib/components/toasts/toasts';
import { register } from '$lib/services/users';
import { get } from 'svelte/store';
import type { ApiError } from '../../errors/apiError';
import { getTranslation } from '../../lib/translations';
import { loading } from '../../stores/loading/store';
import { menu } from '../../stores/menu/store';
import { user as userStore } from '../../stores/user/store';

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
		goto('/');
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
