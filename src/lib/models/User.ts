export type User = {
	readonly uuid: string;
	readonly username: string;
	readonly role: 'USER' | 'ADMIN';
	readonly email: string;
	readonly avatarUrl: string;
	readonly rating: number;
	readonly hasOpenDisputes: boolean;
};
