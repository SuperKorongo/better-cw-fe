import { writable } from 'svelte/store';

type NavigationHistory = {
	previousPage: string | null;
};

const createNavigationStore = () => {
	const { subscribe, set } = writable<NavigationHistory>({
		previousPage: null
	});

	return {
		subscribe,
		updatePreviousPage: (path: string) => {
			set({ previousPage: path });
		}
	};
};

export const navigationHistory = createNavigationStore();
