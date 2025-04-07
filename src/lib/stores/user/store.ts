import type { User } from '$lib/models/User';
import type { Balance } from '$lib/services/admin/balance';
import { writable } from 'svelte/store';

type Data = {
	data: User | null;
	balance: Balance | null;
	ready: boolean;
};

export const user = (() => {
	const { subscribe, update } = writable<Data>({
		data: null,
		balance: null,
		ready: false
	});

	return {
		subscribe,

		setData: (user: Data['data']) =>
			update((d: Data) => {
				return { ...d, data: user, ready: true };
			}),

		setBalance: (balance: Data['balance']) =>
			update((d: Data) => {
				return { ...d, balance };
			})
	};
})();
