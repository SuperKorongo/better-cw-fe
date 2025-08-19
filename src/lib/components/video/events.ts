import { goto, pushState } from '$app/navigation';
import { language } from '$lib/stores/language/store';
import { navigationHistory } from '$lib/stores/navigation/store';
import type { SwipeCustomEvent } from 'svelte-gestures';
import { get } from 'svelte/store';

export const events = (container: () => HTMLElement, setModalImageUrl: (url: string) => void) => {
	const mobileBreakpoint = 1100;

	const onClose = async () => {
		const hideAnimation = async (): Promise<void> => {
			const hideAnimationDurationInMs = 300;

			container().style.animationName =
				innerWidth < mobileBreakpoint
					? `${container().className}-hide-bottom-to-top`
					: `${container().className}-hide-left-to-right`;

			container().style.animationDuration = `${hideAnimationDurationInMs / 1000}s`;

			return new Promise((resolve) => {
				setTimeout(resolve, hideAnimationDurationInMs);
			});
		};

		await hideAnimation();

		onExit();

		if (get(navigationHistory).history.length <= 1) {
			if (
				get(navigationHistory).history.length === 1 &&
				get(navigationHistory).history[0].id === '/[language]/videos/[uuid]'
			) {
				goto(`/${get(language)}`);
				return;
			}
			pushState(`/${get(language)}`, { selectedVideo: undefined });
			return;
		}

		history.back();
	};

	const onSwipe = ({ detail: { direction } }: SwipeCustomEvent) => {
		if (innerWidth < mobileBreakpoint && direction === 'bottom') {
			onClose();
			return;
		}
	};

	const onClickCarouselImage = (imageUrl: string): void => {
		setModalImageUrl(imageUrl);
		container().style.overflowY = 'hidden';
	};

	const onCloseImageModal = () => {
		setModalImageUrl('');
		container().style.overflowY = 'scroll';
	};

	const onExit = () => {
		document.body.style.overflowY = 'scroll';
	};

	return {
		onClose,
		onSwipe,
		onExit,
		onClickCarouselImage,
		onCloseImageModal
	};
};
