import { writable } from 'svelte/store';

type Data = {
	isVisible: boolean;
	forceOpenAfterNavigate?: boolean;
	container: HTMLElement | null;
	overlay: HTMLElement | null;
};

export const menu = (() => {
	const { subscribe, update } = writable<Data>({
		isVisible: false,
		forceOpenAfterNavigate: false,
		container: null,
		overlay: null
	});

	return {
		subscribe,

		setVisibility: (isVisible: boolean) =>
			update(({ container, forceOpenAfterNavigate, overlay }) => {
				return { isVisible, container, forceOpenAfterNavigate, overlay };
			}),

		forceOpenAfterNavigate: (value: boolean) =>
			update(({ container, isVisible, overlay }) => {
				return { isVisible, overlay, container, forceOpenAfterNavigate: value };
			}),

		setContainer: (container: HTMLElement) =>
			update(({ isVisible, forceOpenAfterNavigate, overlay }) => {
				return { isVisible, overlay, container, forceOpenAfterNavigate };
			}),

		setOverlay: (overlay: HTMLElement) =>
			update(({ isVisible, forceOpenAfterNavigate, container }) => {
				return { isVisible, overlay, container, forceOpenAfterNavigate };
			})
	};
})();

export const adminMenu = (() => {
	const { subscribe, update } = writable<Data>({
		isVisible: false,
		container: null,
		overlay: null
	});

	return {
		subscribe,

		setVisibility: (isVisible: boolean) =>
			update(({ container, overlay }) => {
				return { isVisible, container, overlay };
			}),

		setContainer: (container: HTMLElement) =>
			update(({ isVisible, overlay }) => {
				return { isVisible, container, overlay };
			})
	};
})();
