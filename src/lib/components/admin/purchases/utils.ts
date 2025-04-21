import {
	AWAITING_BLOCKCHAIN_CONFIRMATION_STATUS,
	AWAITING_BLOCKCHAIN_TRANSACTION_STATUS,
	AWAITING_FULL_FUNDS_STATUS,
	BLOCKCHAIN_CONFIRMED_STATUS,
	EXPIRED_STATUS
} from '$lib/models/Payment';
import { getTranslation } from '$lib/translations';

export function getTranslatedStatus(status: string): string {
	switch (status) {
		case AWAITING_BLOCKCHAIN_TRANSACTION_STATUS:
			return getTranslation('purchases.status.awaitingBlockchain');
		case AWAITING_BLOCKCHAIN_CONFIRMATION_STATUS:
			return getTranslation('purchases.status.awaitingConfirmation');
		case AWAITING_FULL_FUNDS_STATUS:
			return getTranslation('purchases.status.awaitingFullFunds');
		case BLOCKCHAIN_CONFIRMED_STATUS:
			return getTranslation('purchases.status.confirmed');
		case EXPIRED_STATUS:
			return getTranslation('purchases.status.expired');
		default:
			return status;
	}
}
