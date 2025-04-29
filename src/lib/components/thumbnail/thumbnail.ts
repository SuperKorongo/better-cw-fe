import type { Video } from '$lib/models/Video';
import { getImageSrc, showVideoSidePanel } from '$lib/utils/utils';

const THUMBNAILS_TRANSITION_TIME_IN_MILLISECONDS = 1000;

export const eventFunctions = (filePaths: string[], imgElement: () => HTMLImageElement) => {
	if (filePaths.length === 0) {
		filePaths.push('placeholder');
	}

	let thumbnailsTransitionInterval: ReturnType<typeof setInterval>;
	let currentThumbnailUrlIndex: number = 0;

	const onMouseOver = () => {
		const thumbnailsTransition = () => {
			currentThumbnailUrlIndex++;
			if (currentThumbnailUrlIndex === filePaths.length) {
				currentThumbnailUrlIndex = 0;
			}

			const img = imgElement();
			if (!img) {
				clearInterval(thumbnailsTransitionInterval);
				return;
			}

			setSrc(img, filePaths[currentThumbnailUrlIndex]);
		};

		thumbnailsTransition();
		thumbnailsTransitionInterval = setInterval(
			thumbnailsTransition,
			THUMBNAILS_TRANSITION_TIME_IN_MILLISECONDS
		);
	};

	const onMouseOut = () => {
		clearInterval(thumbnailsTransitionInterval);
		currentThumbnailUrlIndex = 0;
		setSrc(imgElement(), filePaths[0]);
	};

	const preload = () => {
		if (filePaths.length <= 1) {
			return;
		}

		const img = document.createElement('img');
		img.style.display = 'none';
		setSrc(img, filePaths[1]);

		document.body.append(img);
	};

	const onClick = async (e: MouseEvent, video: Video): Promise<void> => {
		onMouseOut();
		showVideoSidePanel(e, e.currentTarget as HTMLAnchorElement, video);
	};

	const setSrc = (img: HTMLImageElement, filePath: string): void => {
		img.setAttribute('src', getImageSrc(filePath, true));
	};

	return {
		onMouseOver,
		onMouseOut,
		preload,
		onClick
	};
};
