import type { Currency } from '$lib/models/Currency';
import { writable } from 'svelte/store';

const LOCAL_STORAGE_KEY = 'currency';

export const defaultCurrency: Currency = {
	name: 'United States Dollars',
	isoCode: 'USD',
	symbol: '$'
};

export const currency = (() => {
	const { subscribe, update } = writable<Currency>(defaultCurrency);

	return {
		subscribe,

		set: (currency: Currency) =>
			update(() => {
				updateLocalStorage(currency);
				return currency;
			}),

		initFromLocalStorage: () =>
			update((currency) => {
				const currencyInLocalStorage = localStorage.getItem(LOCAL_STORAGE_KEY);
				if (currencyInLocalStorage) {
					return JSON.parse(currencyInLocalStorage);
				}
				return currency;
			})
	};
})();

function updateLocalStorage(currency: Currency) {
	localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currency));
}
