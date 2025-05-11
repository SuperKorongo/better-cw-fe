import { get, writable } from 'svelte/store';
import { language } from '../language/store';

type NavigationHistory = {
	history: string[];
};

export const navigationHistory = (() => {
	const { subscribe, update } = writable<NavigationHistory>({
		history: []
	});

	return {
		subscribe,

		push: (path: string) =>
			update((data: NavigationHistory) => {
				data.history.push(path);
				return data;
			}),

		getAppropiateRedirectAfterLogin: (): string => {
			const history = get(navigationHistory).history;
			console.log(history);

			for (let i = history.length - 1; i >= 0; i--) {
				if (
					[`/${get(language)}/sign-in`, `/${get(language)}/register`, '/logout'].includes(
						history[i]
					)
				) {
					continue;
				}
				return history[i];
			}

			return '/' + get(language);
		}
	};
})();
