<script lang="ts">
	import type { Payment } from '$lib/models/Payment';
	import { getTranslation } from '$lib/translations';
	import { getFormattedDate, getFormattedPrice, getImageSrc } from '$lib/utils/utils';
	import { defaultCurrency } from '$lib/stores/currency/store';
	import DataTable, { Body, Cell, Head, Row } from '@smui/data-table';
	import Button, { Label } from '@smui/button';
	import DownloadInstructionsModal from '$lib/components/common/DownloadInstructionsModal.svelte';

	let { payment }: { payment: Payment } = $props();

	let modalOpen = $state(false);
	let selectedInstructions: string | null = $state('');
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
					<Cell style="display: flex; justify-content: center; align-items: center; padding: 8px;">
						{#if video.thumbnailFilePaths && video.thumbnailFilePaths.length > 0}
							<img
								src={getImageSrc(video.thumbnailFilePaths[0], true)}
								alt={video.title}
								class="video-thumbnail"
							/>
						{/if}
					</Cell>
					<Cell>{video.title}</Cell>
					<Cell>{video.model || '-'}</Cell>
					<Cell>
						{#if video.downloadLink}
							<a href={video.downloadLink} target="_blank" rel="noopener noreferrer">
								{getTranslation('purchases.details.downloadLink')}
							</a>
						{:else}
							-
						{/if}
					</Cell>
					<Cell>
						{#if video.downloadLinkInstructions}
							<Button
								onclick={() => {
									selectedInstructions = video.downloadLinkInstructions;
									modalOpen = true;
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
							<span class="confirmed-date">
								{getTranslation('purchases.details.confirmedAt')}: {getFormattedDate(
									video.confirmedAtTimestamp
								)}
							</span>
						{:else}
							<div class="action-buttons">
								<Button variant="raised" color="primary">
									<Label>{getTranslation('purchases.details.confirm')}</Label>
								</Button>
								<Button variant="outlined" color="secondary" class="dispute-button">
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

<DownloadInstructionsModal bind:open={modalOpen} instructions={selectedInstructions ?? ''} />

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

	.confirmed-date {
		color: #155724;
		font-weight: 500;
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
</style>
