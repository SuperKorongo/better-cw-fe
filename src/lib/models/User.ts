export type Role = 'USER' | 'ADMIN';

export const ADMIN_ROLE: Role = 'ADMIN';
export const USER_ROLE: Role = 'USER';

export type User = {
	readonly uuid: string;
	readonly username: string;
	readonly slug: string;
	readonly role: Role;
	readonly email: string;
	readonly rating: number;
	readonly totalRatings: number;
	readonly hasOpenDisputes: boolean;
	readonly hasPendingFriendRequests: boolean;
	readonly sinceTimestamp: number;
};
