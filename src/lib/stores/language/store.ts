import { writable } from 'svelte/store';
import { defaultLanguage, setLanguage, translations, type Language } from '../../translations';

const LOCAL_STORAGE_KEY = 'language';

export const language = (() => {
	const { subscribe, update } = writable<Language>(defaultLanguage);

	return {
		subscribe,

		set: (value: Language) =>
			update(() => {
				if (!Object.keys(translations).includes(value)) {
					value = defaultLanguage;
				}

				localStorage.setItem(LOCAL_STORAGE_KEY, value);
				setLanguage(value);
				return value;
			}),

		init: () => {
			const valueInLocalStorage = localStorage.getItem(LOCAL_STORAGE_KEY) as Language;
			if (valueInLocalStorage) {
				language.set(valueInLocalStorage);
				return;
			}

			language.set(
				navigator && navigator.language
					? (navigator.language.split('-')[0] as Language)
					: defaultLanguage
			);
		}
	};
})();
