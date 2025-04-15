import { writable } from 'svelte/store';

type Data = {
	myVideos: number | null;
};

export const cache = (() => {
	const { subscribe, update } = writable<Data>({
		myVideos: null
	});

	return {
		subscribe,

		refreshMyVideos: () =>
			update((data: Data) => {
				data.myVideos = new Date().getTime();
				return data;
			})
	};
})();
