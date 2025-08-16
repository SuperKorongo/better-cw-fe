import { writable } from 'svelte/store';

export type Thumbnail = {
	blob: Blob | null;
	src: string;
};
export type Data = {
	thumbnails: (Thumbnail | null)[];
	tags: string[];
	title: string;
	description: string;
	priceInCentsOfDollar: number;
	durationInSeconds: number;
	downloadLink: string;
	downloadLinkInstructions: string;
	model: string;
	isPrivate: boolean;
};

const emptyData = {
	thumbnails: [],
	tags: [],
	title: '',
	description: '',
	priceInCentsOfDollar: 0,
	durationInSeconds: 0,
	downloadLink: '',
	downloadLinkInstructions: '',
	model: '',
	isPrivate: false
};

export const videoForm = (() => {
	const { subscribe, update } = writable<Data>(emptyData);

	return {
		subscribe,

		init: () =>
			update(() => {
				return structuredClone(emptyData);
			}),

		setThumbnail: (index: number, thumbnail: Thumbnail | null) =>
			update((data) => {
				data.thumbnails[index] = thumbnail;
				return data;
			}),

		removeThumbnail: (index: number) =>
			update((data) => {
				data.thumbnails[index] = null;
				return data;
			}),

		setTags: (tags: string[]) =>
			update((data) => {
				data.tags = tags;
				return data;
			}),

		setTitle: (title: string) =>
			update((data) => {
				data.title = title;
				return data;
			}),

		setDescription: (description: string) =>
			update((data) => {
				data.description = description;
				return data;
			}),

		setPriceInCentsOfDollar: (priceInCentsOfDollar: number) =>
			update((data) => {
				data.priceInCentsOfDollar = priceInCentsOfDollar;
				return data;
			}),

		setDurationInSeconds: (durationInSeconds: number) =>
			update((data) => {
				data.durationInSeconds = durationInSeconds;
				return data;
			}),

		setDownloadLink: (downloadLink: string) =>
			update((data) => {
				data.downloadLink = downloadLink;
				return data;
			}),

		setDownloadLinkInstructions: (downloadLinkInstructions: string) =>
			update((data) => {
				data.downloadLinkInstructions = downloadLinkInstructions;
				return data;
			}),

		setModel: (model: string) =>
			update((data) => {
				data.model = model;
				return data;
			}),

		setIsPrivate: (value: boolean) =>
			update((data) => {
				data.isPrivate = value;
				return data;
			})
	};
})();
