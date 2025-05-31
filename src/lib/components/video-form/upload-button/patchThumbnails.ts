import type { Video } from '$lib/models/Video';
import { deleteThumbnail, replaceThumbnail } from '$lib/services/admin/videos';
import { uploadThumbnail } from '$lib/services/videos';
import { videoForm } from '$lib/stores/video-form/store';
import { get } from 'svelte/store';

const replacedIndexes: number[] = [];

export const patchThumbnails = async (video: Video): Promise<void> => {
	try {
		await replaceThumbnails(video);
	} catch {
		// todo
	}

	try {
		await deleteThumbnails(video);
	} catch {
		// todo
	}

	try {
		await addThumbnails(video);
	} catch {
		// todo
	}
};

async function replaceThumbnails(video: Video): Promise<void> {
	for (const [index, thumbnail] of get(videoForm).thumbnails.entries()) {
		if (thumbnail === null || thumbnail.blob === null) {
			continue;
		}
		if (
			video.thumbnailFilePaths[index] !== undefined &&
			!isSameImage(video.thumbnailFilePaths[index] ?? '', thumbnail.src)
		) {
			replacedIndexes.push(index);
			try {
				await replaceThumbnail(video.uuid, index + 1, thumbnail.blob);
			} catch {
				// TODO
			}
		}
	}
}

async function deleteThumbnails(video: Video): Promise<void> {
	const toDelete: number[] = [];
	for (const [index, thumbnail] of get(videoForm).thumbnails.entries()) {
		if (thumbnail !== null && thumbnail.blob !== null) {
			continue;
		}

		toDelete.push(index + 1);
	}

	for (let i = toDelete.length - 1; i >= 0; i--) {
		try {
			await deleteThumbnail(video.uuid, toDelete[i]);
		} catch {
			// TODO
		}
	}
}

async function addThumbnails(video: Video): Promise<void> {
	for (const [index, thumbnail] of get(videoForm).thumbnails.entries()) {
		if (thumbnail === null) {
			continue;
		}

		if (
			!replacedIndexes.includes(index) &&
			video.thumbnailFilePaths.filter((p) => isSameImage(p, thumbnail.src)).length === 0
		) {
			try {
				await uploadThumbnail(video.uuid, thumbnail.blob);
			} catch {
				// TODO
			}
		}
	}
}

function isSameImage(videoPath: string, videoFormSrc: string): boolean {
	return videoPath + '.png' === new URL(videoFormSrc).pathname.replace(/^.*[\\/]/, '');
}
