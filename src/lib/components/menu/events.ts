import { menu } from '$lib/stores/menu/store';
import type { SwipeCustomEvent } from 'svelte-gestures';
import { get } from 'svelte/store';

export const onClose = async (menuOverlayModal: HTMLDivElement | null = null) => {
	const container = get(menu).container;
	if (!container) return;

	const hideAnimation = async (): Promise<void> => {
		const mobileBreakpoint = 900;
		const hideAnimationDurationInMs = 300;

		container.style.animationName =
			innerWidth < mobileBreakpoint
				? `${container.className}-hide-left-to-right-100`
				: `${container.className}-hide-left-to-right`;

		container.style.animationDuration = `${hideAnimationDurationInMs / 1000}s`;

		return new Promise((resolve) => {
			setTimeout(resolve, hideAnimationDurationInMs);
		});
	};

	if (menuOverlayModal) {
		menuOverlayModal.style.display = 'none';
	}

	await hideAnimation();
	menu.setVisibility(false);
};

export const onSwipe = ({ detail: { direction } }: SwipeCustomEvent) => {
	if (direction === 'right') {
		onClose();
		return;
	}
};
