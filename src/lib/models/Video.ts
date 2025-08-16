import type { Currency } from './Currency';

export type Tag = {
	name: string;
	slug: string;
};

export type Video = {
	title: string;
	description: string | null;
	uuid: string;
	thumbnailFilePaths: string[];
	downloadLink: string;
	price: {
		currency: Currency;
		value: number;
	};
	uploader: {
		uuid: string;
		name: string;
		slug: string;
		rating: number;
	};
	durationInSeconds: number;
	model: {
		uuid: string;
		name: string;
		slug: string;
	} | null;
	tags: Tag[];
	rating: number;
	views: number;
	isPrivate: boolean;
};

export const getEmpty = (): Video => {
	return {
		title: '',
		description: '',
		downloadLink: '',
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
			slug: ''
		},
		durationInSeconds: 0,
		model: {
			uuid: '',
			name: '',
			slug: ''
		},
		tags: [],
		rating: 0,
		views: 0,
		isPrivate: false
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
