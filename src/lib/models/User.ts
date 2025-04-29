export type User = {
	readonly uuid: string;
	readonly username: string;
	readonly email: string;
	readonly avatarUrl: string;
	readonly rating: number;
	readonly hasOpenDisputes: boolean;
};
