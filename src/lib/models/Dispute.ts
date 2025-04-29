export type Claim = {
	author: 'admin' | 'buyer' | 'seller';
	addedAtTimestamp: number;
	contents: string;
};

export type DisputeVideo = {
	uuid: string;
	title: string;
	priceInCentsOfDollar: number;
	model: string;
};

export type DisputeInvoice = {
	uuid: string;
	buyerUuid: string;
	priceInCentsOfDollar: number;
	priceInBTC: number;
	paidAtTimestamp: number;
};

export type DisputeStatus = 'open' | 'closed';

export const OPEN_DISPUTE_STATUS: DisputeStatus = 'open';
export const CLOSED_DISPUTE_STATUS: DisputeStatus = 'closed';

export const DISPUTE_STATUS_MAP: Record<DisputeStatus, number> = {
	open: 0,
	closed: 1
};

export type Dispute = {
	uuid: string;
	status: DisputeStatus;
	createdAtTimestamp: number;
	updatedAtTimestamp: number;
	claims: Claim[];
	video: DisputeVideo;
	invoice: DisputeInvoice;
};
