import { get, writable } from 'svelte/store';
import { language } from '../language/store';

type NavigationHistory = {
	history: {
		path: string;
		id: string;
	}[];
};

export const navigationHistory = (() => {
	const { subscribe, update } = writable<NavigationHistory>({
		history: []
	});

	return {
		subscribe,

		push: (path: string, routeId: string) =>
			update((data: NavigationHistory) => {
				data.history.push({
					path,
					id: routeId
				});
				return data;
			}),

		getAppropiateRedirectAfterLogin: (): string => {
			const history = get(navigationHistory).history;

			for (let i = history.length - 1; i >= 0; i--) {
				if (
					[`/${get(language)}/sign-in`, `/${get(language)}/register`, '/logout'].includes(
						history[i].path
					)
				) {
					continue;
				}
				return history[i].path;
			}

			return '/' + get(language);
		}
	};
})();
