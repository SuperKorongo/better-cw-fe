import { toast, type SvelteToastOptions } from '@zerodevx/svelte-toast';

const commonOptions: SvelteToastOptions = {
	dismissable: true,
	pausable: true,
	duration: 10000
};

const commonTheme = {
	'--toastColor': 'white',
	'--toastBarBackground': 'gold',
	'--toastBarHeight': '3px'
};

export const success = (text: string, options: SvelteToastOptions = {}) => {
	toast.push(text, getOptions('#00FF00', options));
};

export const warning = (text: string, options: SvelteToastOptions = {}) => {
	toast.push(text, getOptions('orange', options));
};

export const error = (text: string, options: SvelteToastOptions = {}) => {
	toast.push(text, getOptions('red', options));
};

function getOptions(bgColor: string, options: SvelteToastOptions = {}) {
	return {
		theme: {
			'--toastBackground': bgColor,
			...commonTheme
		},
		...commonOptions,
		...options
	};
}
