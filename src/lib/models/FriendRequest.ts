export type FriendRequest = {
	readonly uuid: string;
	readonly sentAt: string;
	readonly acceptedAt: string | null;
};

export type Friend = {
	readonly friendRequestUUID: string;
	readonly userUUID: string;
	readonly username: string;
	readonly slug: string;
	readonly acceptedAt: string | null;
	readonly sentAt: string;
};
