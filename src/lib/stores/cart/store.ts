import type { Video } from '$lib/models/Video';
import { writable } from 'svelte/store';

type Cart = Video[];

const LOCAL_STORAGE_KEY = 'cart';

export const cart = (() => {
	const { subscribe, update } = writable<Cart>([]);

	return {
		subscribe,

		add: (video: Video) =>
			update((cart) => {
				if (cart.find((v) => v.uuid === video.uuid)) {
					return cart;
				}

				cart.push(video);
				updateLocalStorage(cart);
				return cart;
			}),

		remove: ({ uuid }: Video) =>
			update((cart) => {
				const index: number = cart.findIndex((v) => v.uuid === uuid);

				if (index >= 0) {
					cart.splice(index, 1);
				}

				updateLocalStorage(cart);
				return cart;
			}),

		clean: () =>
			update(() => {
				updateLocalStorage([]);
				return [];
			}),

		init: () =>
			update((cart) => {
				const cartInLocalStorage = localStorage.getItem(LOCAL_STORAGE_KEY);
				if (cartInLocalStorage) {
					return JSON.parse(cartInLocalStorage);
				}
				return cart;
			})
	};
})();

function updateLocalStorage(cart: Cart) {
	localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
}
