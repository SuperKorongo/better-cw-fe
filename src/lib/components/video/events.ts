import { goto } from '$app/navigation';
import { loading } from '$lib/stores/loading/store';
import type { SwipeCustomEvent } from 'svelte-gestures';

export const events = (container: () => HTMLElement, setModalImageUrl: (url: string) => void) => {
	const mobileBreakpoint = 1100;

	const onLoad = () => {
		document.body.style.overflowY = 'hidden';
		window.addEventListener('popstate', onExit);
	};

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

		if (history.length <= 2) {
			loading.set(true);
			goto('/');
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
		onLoad,
		onClose,
		onSwipe,
		onExit,
		onClickCarouselImage,
		onCloseImageModal
	};
};
