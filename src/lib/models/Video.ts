import type { Currency } from './Currency';

export type Video = {
	title: string;
	description: string | null;
	uuid: string;
	thumbnailFilePaths: string[];
	price: {
		currency: Currency;
		value: number;
	};
	uploader: {
		uuid: string;
		name: string;
		avatarUrl: string;
		rating: number;
	};
	uploadedAtTimestamp: number;
	durationInSeconds: number;
	model: {
		uuid: string;
		name: string;
	} | null;
	tags: string[];
	rating: number;
	totalRatings: number;
};

export const getEmpty = (): Video => {
	return {
		title: '',
		description: '',
		uuid: '',
		thumbnailFilePaths: [],
		price: {
			currency: {
				name: '',
				isoCode: '',
				symbol: ''
			},
			value: 0
		},
		uploader: {
			rating: 0,
			uuid: '',
			name: '',
			avatarUrl: ''
		},
		uploadedAtTimestamp: 0,
		durationInSeconds: 0,
		model: {
			uuid: '',
			name: ''
		},
		tags: [],
		rating: 0,
		totalRatings: 0
	};
};

export type AdminListVideo = {
	uuid: string;
	title: string;
	price: {
		currency: Currency;
		value: number;
	};
	uploadedAtTimestamp: number;
	moneyGeneratedInBTC: number;
	active: boolean;
};
