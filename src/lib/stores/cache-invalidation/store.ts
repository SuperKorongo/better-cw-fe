import { writable } from 'svelte/store';

type Data = {
	myVideos: number | null;
	myFriends: number | null;
	myPurchases: number | null;
	myDisputes: number | null;
	me: number | null;
};

export const LOCAL_STORAGE_KEY = 'cache-invalidation';

export const cacheInvalidation = (() => {
	const { subscribe, update } = writable<Data>({
		myVideos: null,
		myFriends: null,
		myPurchases: null,
		myDisputes: null,
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

		refreshMyFriends: () =>
			update((data: Data) => {
				data.myFriends = new Date().getTime();
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

		refreshMyDisputes: () =>
			update((data: Data) => {
				data.myDisputes = new Date().getTime();
				updateLocalStorage(data);
				return data;
			}),

		refreshAll: () => {
			cacheInvalidation.refreshMyVideos();
			cacheInvalidation.refreshMyPurchases();
			cacheInvalidation.refreshMyDisputes();
			cacheInvalidation.refreshMe();
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
