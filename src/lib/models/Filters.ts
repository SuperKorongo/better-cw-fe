export type Visibility = 'any' | 'public' | 'private';
export const Visibilities: Visibility[] = ['any', 'public', 'private'];

export type Duration = 'any' | 'short' | 'medium' | 'long';
export const Durations: Duration[] = ['any', 'short', 'medium', 'long'];

export type Filters = {
	text?: string;
	minPrice?: number;
	maxPrice?: number;
	visibility?: Visibility;
	duration?: Duration;
};
