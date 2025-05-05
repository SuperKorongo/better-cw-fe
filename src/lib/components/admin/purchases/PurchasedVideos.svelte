<script lang="ts">
	import DownloadInstructionsModal from '$lib/components/common/DownloadInstructionsModal.svelte';
	import type { Payment, PurchasedVideo } from '$lib/models/Payment';
	import { BLOCKCHAIN_CONFIRMED_STATUS, EXPIRED_STATUS } from '$lib/models/Payment';
	import { getVideoByUUID } from '$lib/services/videos';
	import { loading } from '$lib/stores/loading/store';
	import { getTranslation } from '$lib/translations';
	import { getImageSrc, handleApiError, showVideoSidePanel } from '$lib/utils/utils';
	import Button, { Label } from '@smui/button';
	import DataTable, { Body, Cell, Head, Row } from '@smui/data-table';
	import DisputeModal from './DisputeModal.svelte';
	import Rating from './Rating.svelte';
	import VideoConfirmationModal from './VideoConfirmationModal.svelte';

	let {
		payment,
		onConfirmVideoCallback,
		onDisputeOpenCallback
	}: {
		payment: Payment;
		onConfirmVideoCallback: (videoUUID: string) => void;
		onDisputeOpenCallback: (videoUUID: string, disputeUUID: string) => void;
	} = $props();

	let instructionsModalOpen = $state(false);
	let selectedInstructions: string | null = $state('');
	let selectedVideoUUID: string | null = $state(null);
	let confirmationModalOpen = $state(false);
	let disputeModalOpen = $state(false);

	const isPaid = payment.status === BLOCKCHAIN_CONFIRMED_STATUS;
	const isExpired = payment.status === EXPIRED_STATUS;

	const onClickVideo = async (e: MouseEvent, video: PurchasedVideo): Promise<void> => {
		e.preventDefault();
		try {
			loading.set(true);
			const target = e.currentTarget as HTMLAnchorElement;
			showVideoSidePanel(e, target, await getVideoByUUID(window.fetch, video.uuid));
		} catch (e: unknown) {
			handleApiError(e);
		} finally {
			loading.set(false);
		}
	};
</script>

<div class="videos-section">
	<h2>{getTranslation('purchases.details.videos')}</h2>
	<DataTable style="width: 100%;">
		<Head>
			<Row>
				<Cell></Cell>
				<Cell>{getTranslation('purchases.details.videoTitle')}</Cell>
				<Cell>{getTranslation('purchases.details.modelName')}</Cell>
				<Cell>{getTranslation('purchases.details.downloadLink')}</Cell>
				<Cell>{getTranslation('purchases.details.downloadInstructions')}</Cell>
				<Cell></Cell>
			</Row>
		</Head>
		<Body>
			{#each payment.videos as video (video.uuid)}
				<Row>
					<Cell style="text-align: center">
						{#if video.thumbnailFilePaths && video.thumbnailFilePaths.length > 0}
							<a
								data-sveltekit-preload-data="false"
								href={`/videos/${video.uuid}`}
								onclick={(e) => {
									onClickVideo(e, video);
								}}
								onauxclick={(e) => {
									onClickVideo(e, video);
								}}
							>
								<img
									src={getImageSrc(video.thumbnailFilePaths[0], true)}
									alt={video.title}
									class="video-thumbnail"
								/>
							</a>
						{/if}
					</Cell>
					<Cell>{video.title}</Cell>
					<Cell>{video.model || '-'}</Cell>
					<Cell>
						{#if isPaid}
							{#if video.downloadLink}
								<a href={video.downloadLink} target="_blank" rel="noopener noreferrer">
									{getTranslation('purchases.details.downloadLink')}
								</a>
							{:else}
								-
							{/if}
						{:else}
							<span class="payment-required"
								>{getTranslation('purchases.details.paymentRequired')}</span
							>
						{/if}
					</Cell>
					<Cell>
						{#if isPaid && video.downloadLinkInstructions}
							<Button
								onclick={() => {
									selectedInstructions = video.downloadLinkInstructions;
									instructionsModalOpen = true;
								}}
								variant="outlined"
							>
								<Label>{getTranslation('common.downloadInstructions.viewInstructions')}</Label>
							</Button>
						{:else}
							-
						{/if}
					</Cell>
					<Cell>
						{#if video.confirmedAtTimestamp !== null}
							<Rating rating={video.userRating} videoUUID={video.uuid} invoiceUUID={payment.uuid} />
						{:else if isPaid && !isExpired}
							<div class="action-buttons">
								<Button
									variant="raised"
									color="primary"
									onclick={() => {
										confirmationModalOpen = true;
										selectedVideoUUID = video.uuid;
									}}
								>
									<Label>{getTranslation('purchases.details.confirm')}</Label>
								</Button>
								<Button
									onclick={() => {
										disputeModalOpen = true;
										selectedVideoUUID = video.uuid;
									}}
									variant="outlined"
									color="secondary"
									class="dispute-button"
								>
									<Label>{getTranslation('purchases.details.dispute')}</Label>
								</Button>
							</div>
						{/if}
					</Cell>
				</Row>
			{/each}
		</Body>
	</DataTable>
</div>

<DownloadInstructionsModal
	bind:open={instructionsModalOpen}
	instructions={selectedInstructions ?? ''}
/>
<VideoConfirmationModal
	bind:open={confirmationModalOpen}
	paymentUUID={payment.uuid}
	videoUUID={selectedVideoUUID!}
	onConfirmCallback={onConfirmVideoCallback}
/>
<DisputeModal
	bind:open={disputeModalOpen}
	paymentUUID={payment.uuid}
	videoUUID={selectedVideoUUID!}
	{onDisputeOpenCallback}
/>

<style>
	.videos-section {
		background: #fff;
		border-radius: 8px;
		padding: 1.5rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	h2 {
		font-size: 1.2rem;
		color: #555;
		margin-bottom: 1rem;
	}

	a {
		color: #1976d2;
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}

	.video-thumbnail {
		width: 100px;
		height: 56.25px; /* 16:9 aspect ratio */
		object-fit: cover;
		border-radius: 4px;
	}

	.action-buttons {
		display: flex;
		gap: 8px;
	}

	@media (max-width: 599px) {
		:global(.mdc-data-table) {
			margin: 0 -1rem;
			width: calc(100% + 2rem) !important;
		}

		.video-thumbnail {
			width: 80px;
			height: 45px;
		}

		.action-buttons {
			flex-direction: column;
		}
	}

	.payment-required {
		color: #856404;
		background-color: #fff3cd;
		padding: 0.5rem;
		border-radius: 4px;
		font-size: 0.9rem;
		display: inline-block;
	}
</style>
