export type PaymentStatus = 
    | 'AWAITING_BLOCKCHAIN_TRANSACTION'
    | 'AWAITING_BLOCKCHAIN_CONFIRMATION'
    | 'AWAITING_FULL_FUNDS'
    | 'BLOCKCHAIN_CONFIRMED'
    | 'EXPIRED';

export type PurchasedVideo = {
    uuid: string;
    title: string;
    priceInCentsOfDollar: number;
    model: string | null;
    downloadLink: string | null;
    downloadLinkInstructions: string | null;
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