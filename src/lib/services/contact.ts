import { PUBLIC_STORE_API_URL } from '$env/static/public';
import { fetchWrapper } from '$lib/utils/fetch';

export const sendContactMessage = async (
	email: string,
	subject: string,
	message: string
): Promise<void> => {
	await fetchWrapper(window.fetch)(`${PUBLIC_STORE_API_URL}/api/v1/contact`, {
		method: 'POST',
		body: JSON.stringify({ email, subject, message })
	});
};
