import { writable } from 'svelte/store';

type Data = {
	myVideos: number | null;
	myPurchases: number | null;
	me: number | null;
};

export const cache = (() => {
	const { subscribe, update } = writable<Data>({
		myVideos: null,
		myPurchases: null,
		me: null
	});

	return {
		subscribe,

		refreshMyVideos: () =>
			update((data: Data) => {
				data.myVideos = new Date().getTime();
				return data;
			}),

		refreshMyPurchases: () =>
			update((data: Data) => {
				data.myPurchases = new Date().getTime();
				return data;
			}),

		refreshMe: () =>
			update((data: Data) => {
				data.me = new Date().getTime();
				return data;
			}),

		refreshAll: () => {
			cache.refreshMyVideos();
			cache.refreshMyPurchases();
			cache.refreshMe();
		}
	};
})();
