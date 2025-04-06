import { writable } from 'svelte/store';

type Data = {
	value: boolean;
	showLoadingBar: boolean;
};
export const loading = (() => {
	const { subscribe, update } = writable<Data>({
		value: false,
		showLoadingBar: true
	});

	return {
		subscribe,

		set: (value: boolean, showLoadingBar: boolean = true) =>
			update(() => {
				return { value, showLoadingBar };
			})
	};
})();
