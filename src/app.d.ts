// See https://kit.svelte.dev/docs/types#app

import type { Video } from '$lib/models/Video';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		interface PageState {
			selectedVideo?: Video | undefined;
		}
		// interface Platform {}
	}
}

export {};
