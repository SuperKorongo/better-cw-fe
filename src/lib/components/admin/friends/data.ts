import { getTranslation } from '$lib/translations';

export const getTableHeader = () => [
	{
		columnId: 'title',
		label: getTranslation('admin.myFriends.username'),
		sortable: false
	},
	{
		columnId: 'accepted_at',
		label: getTranslation('admin.myFriends.friendsSince'),
		sortable: false
	}
];

export const allowedRowsPerPage: number[] = [10, 25];
