import { adminMenu } from '$lib/stores/menu/store';
import type { SwipeCustomEvent } from 'svelte-gestures';
import { get } from 'svelte/store';

export const onClose = async () => {
	const container = get(adminMenu).container;
	if (!container) return;

	const hideAnimation = async (): Promise<void> => {
		const mobileBreakpoint = 900;
		const hideAnimationDurationInMs = 300;

		container.style.animationName =
			innerWidth < mobileBreakpoint
				? `${container.className}-hide-right-to-left-100`
				: `${container.className}-hide-right-to-left`;

		container.style.animationDuration = `${hideAnimationDurationInMs / 1000}s`;

		return new Promise((resolve) => {
			setTimeout(resolve, hideAnimationDurationInMs);
		});
	};

	await hideAnimation();
	adminMenu.setVisibility(false);
};

export const onSwipe = ({ detail: { direction } }: SwipeCustomEvent) => {
	if (direction === 'left') {
		onClose();
		return;
	}
};
