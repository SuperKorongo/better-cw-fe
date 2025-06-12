import type { Video } from '$lib/models/Video';
import availableLanguages from '$lib/translations/available_languages.json' with { type: 'json' };
import { type Language } from '$lib/translations/index.js';
import { redirect } from '@sveltejs/kit';

export const prerender = false;

export type Data = { videos: Video[]; error: boolean };
export async function load(e): Promise<void> {
	const acceptLanguage = e.request.headers.get('accept-language');
	if (!acceptLanguage) {
		throw redirect(301, '/en');
	}

	const languages: string[] = acceptLanguage.split(',');
	const isoCode: Language = languages[0].split(';')[0].split('-')[0].toLowerCase() as Language;

	if (availableLanguages.includes(isoCode)) {
		throw redirect(301, `/${isoCode}`);
	}

	throw redirect(301, '/en');
}
