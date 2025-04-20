import { getTranslation } from '$lib/translations';

export function getTranslatedStatus(status: string): string {
	switch (status) {
		case 'AWAITING_BLOCKCHAIN_TRANSACTION':
			return getTranslation('purchases.status.awaitingBlockchain');
		case 'AWAITING_BLOCKCHAIN_CONFIRMATION':
			return getTranslation('purchases.status.awaitingConfirmation');
		case 'AWAITING_FULL_FUNDS':
			return getTranslation('purchases.status.awaitingFullFunds');
		case 'BLOCKCHAIN_CONFIRMED':
			return getTranslation('purchases.status.confirmed');
		case 'EXPIRED':
			return getTranslation('purchases.status.expired');
		default:
			return status;
	}
}
