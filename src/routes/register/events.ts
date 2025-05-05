import { goto } from '$app/navigation';
import * as toasts from '$lib/components/toasts/toasts';
import { register } from '$lib/services/users';
import { loading } from '$lib/stores/loading/store';
import { menu } from '$lib/stores/menu/store';
import { navigationHistory } from '$lib/stores/navigation/store';
import { user as userStore } from '$lib/stores/user/store';
import { getTranslation } from '$lib/translations';
import { handleApiError } from '$lib/utils/utils';
import { get } from 'svelte/store';

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
		const funcMap = new Map<number, () => void>();
		funcMap.set(400, () => {
			toasts.error(getTranslation('signInForm.errors.invalidCredentials'));
		});
		funcMap.set(409, () => {
			toasts.error(getTranslation('signUpForm.errors.usernameAlreadyExists'));
		});
		handleApiError(e, 'signInForm.errors.serverError', funcMap);
	} finally {
		loading.set(false);
	}
};
