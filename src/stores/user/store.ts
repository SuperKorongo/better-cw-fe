import type { User } from '$lib/models/User';
import { writable } from 'svelte/store';

type Data = {
	data: User | null;
	ready: boolean;
};

export const user = (() => {
	const { subscribe, update } = writable<Data>({
		data: null,
		ready: false
	});

	return {
		subscribe,

		setData: (data: Data['data']) =>
			update(() => {
				return { data, ready: true };
			})
	};
})();
