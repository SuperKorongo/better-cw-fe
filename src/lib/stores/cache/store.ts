import { writable } from 'svelte/store';

type Data = {
	myVideos: number | null;
	myPurchases: number | null;
	me: number | null;
};

export const LOCAL_STORAGE_KEY = 'cache';

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
				updateLocalStorage(data);
				return data;
			}),

		refreshMyPurchases: () =>
			update((data: Data) => {
				data.myPurchases = new Date().getTime();
				updateLocalStorage(data);
				return data;
			}),

		refreshMe: () =>
			update((data: Data) => {
				data.me = new Date().getTime();
				updateLocalStorage(data);
				return data;
			}),

		refreshAll: () => {
			cache.refreshMyVideos();
			cache.refreshMyPurchases();
			cache.refreshMe();
		},


		init: () =>
			update((cache) => {
				const cacheInLocalStorage = localStorage.getItem(LOCAL_STORAGE_KEY);
				if (cacheInLocalStorage) {
					return JSON.parse(cacheInLocalStorage);
				}
				return cache;
			})
	};
})();


function updateLocalStorage(data: Data): void {
	localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
}