import { goto } from '$app/navigation';
import * as toasts from '$lib/components/toasts/toasts';
import { login } from '$lib/services/users';
import { loading } from '$lib/stores/loading/store';
import { navigationHistory } from '$lib/stores/navigation/store';
import { user as userStore } from '$lib/stores/user/store';
import { getTranslation } from '$lib/translations';
import { handleApiError } from '$lib/utils/utils';
import { get } from 'svelte/store';

export const onClickLoginButton = async (getEmail: () => string, getPassword: () => string) => {
	if (get(loading).value) {
		return;
	}

	if (!getEmail()) {
		toasts.warning(getTranslation('signInForm.errors.emptyEmail'));
		return;
	}
	if (getPassword().length < 6) {
		toasts.warning(getTranslation('signInForm.errors.invalidPassword'));
		return;
	}

	loading.set(true);
	try {
		const user = await login(getEmail(), getPassword());
		userStore.setData(user);
		toasts.success(getTranslation('signInForm.welcome'));

		goto(navigationHistory.getAppropiateRedirectAfterLogin());
	} catch (e: unknown) {
		const funcMap = new Map<number, () => void>();
		funcMap.set(400, () => {
			toasts.error(getTranslation('signInForm.errors.invalidCredentials'));
		});
		handleApiError(e, 'signInForm.errors.serverError', funcMap);
	} finally {
		loading.set(false);
	}
};
