export type PaymentStatus =
	| 'AWAITING_BLOCKCHAIN_TRANSACTION'
	| 'AWAITING_BLOCKCHAIN_CONFIRMATION'
	| 'AWAITING_FULL_FUNDS'
	| 'BLOCKCHAIN_CONFIRMED'
	| 'EXPIRED';

export const AWAITING_BLOCKCHAIN_TRANSACTION_STATUS: PaymentStatus =
	'AWAITING_BLOCKCHAIN_TRANSACTION';
export const AWAITING_BLOCKCHAIN_CONFIRMATION_STATUS: PaymentStatus =
	'AWAITING_BLOCKCHAIN_CONFIRMATION';
export const AWAITING_FULL_FUNDS_STATUS: PaymentStatus = 'AWAITING_FULL_FUNDS';
export const BLOCKCHAIN_CONFIRMED_STATUS: PaymentStatus = 'BLOCKCHAIN_CONFIRMED';
export const EXPIRED_STATUS: PaymentStatus = 'EXPIRED';

export const PAYMENT_STATUS_MAP: Record<PaymentStatus, number> = {
	AWAITING_BLOCKCHAIN_TRANSACTION: 0,
	AWAITING_BLOCKCHAIN_CONFIRMATION: 1,
	AWAITING_FULL_FUNDS: 2,
	BLOCKCHAIN_CONFIRMED: 3,
	EXPIRED: 4
};

export type PurchasedVideo = {
	uuid: string;
	title: string;
	priceInCentsOfDollar: number;
	model: string | null;
	downloadLink: string | null;
	downloadLinkInstructions: string | null;
	thumbnailFilePaths: string[];
	confirmedAtTimestamp: number | null;
	userRating: number | null;
};

export type Payment = {
	uuid: string;
	externalUuid: string;
	status: PaymentStatus;
	priceInCentsOfDollar: number;
	priceInBTC: number;
	createdAtTimestamp: number;
	updatedAtTimestamp: number;
	videos: PurchasedVideo[];
};
