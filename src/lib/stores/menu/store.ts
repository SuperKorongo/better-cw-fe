import { writable } from 'svelte/store';

type Data = {
	isVisible: boolean;
	forceOpenAfterNavigate?: boolean;
	container: HTMLElement | null;
};

export const menu = (() => {
	const { subscribe, update } = writable<Data>({
		isVisible: false,
		forceOpenAfterNavigate: false,
		container: null
	});

	return {
		subscribe,

		setVisibility: (isVisible: boolean) =>
			update(({ container, forceOpenAfterNavigate }) => {
				return { isVisible, container, forceOpenAfterNavigate };
			}),

		forceOpenAfterNavigate: (value: boolean) =>
			update(({ container, isVisible }) => {
				return { isVisible, container, forceOpenAfterNavigate: value };
			}),

		setContainer: (container: HTMLElement) =>
			update(({ isVisible, forceOpenAfterNavigate }) => {
				return { isVisible, container, forceOpenAfterNavigate };
			})
	};
})();

export const adminMenu = (() => {
	const { subscribe, update } = writable<Data>({
		isVisible: false,
		container: null
	});

	return {
		subscribe,

		setVisibility: (isVisible: boolean) =>
			update(({ container }) => {
				return { isVisible, container };
			}),

		setContainer: (container: HTMLElement) =>
			update(({ isVisible }) => {
				return { isVisible, container };
			})
	};
})();
