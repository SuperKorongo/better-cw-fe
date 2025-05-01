<script lang="ts">
	import { type Dispute } from '$lib/models/Dispute';
	import { getTranslation } from '$lib/translations';
	import { getFormattedDateWithTime, onClickInternalLink } from '$lib/utils/utils';
	import { onClickVideo } from './events';

	let { dispute }: { dispute: Dispute } = $props();
</script>

<div class="shadow-box">
	<div class="info-grid">
		<div class="info-item">
			<span class="label">{getTranslation('disputes.details.date')}</span>
			<span class="value">{getFormattedDateWithTime(dispute.createdAtTimestamp)}</span>
		</div>
		<div class="info-item">
			<span class="label">UUID:</span>
			<span class="value uuid">{dispute.uuid}</span>
		</div>
		<div class="info-item">
			<span class="label">{getTranslation(`disputes.details.status`)}</span>
			<span class="value">{getTranslation(`disputes.details.status${dispute.status}`)}</span>
		</div>
		<div class="info-item">
			<span class="label">{getTranslation(`disputes.details.video`)}</span>
			<span title={dispute.video.title} class="value video-title">
				<a
					data-sveltekit-preload-data="false"
					href={`/videos/${dispute.video.uuid}`}
					onclick={(e) => {
						onClickVideo(e, dispute.video);
					}}
					onauxclick={(e) => {
						onClickVideo(e, dispute.video);
					}}
				>
					{dispute.video.title}
				</a>
			</span>
		</div>
		<div class="info-item">
			<span class="label">{getTranslation(`disputes.details.invoice`)}</span>
			<span title={dispute.invoice.uuid} class="value uuid">
				<a onclick={onClickInternalLink} href={`/admin/purchases/${dispute.invoice.uuid}`}>
					{dispute.invoice.uuid}
				</a>
			</span>
		</div>
	</div>
</div>

<style>
	.shadow-box {
		background: #fff;
		border-radius: 8px;
		padding: 1.5rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		margin-bottom: 40px;
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.info-item {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.label {
		font-size: 0.9rem;
		color: #666;
	}

	.value {
		font-size: 1.1rem;
		color: #333;
		font-weight: 500;
	}

	.video-title {
		display: inline-block;
		max-width: 25ch;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.uuid {
		font-family: monospace;
		font-size: 1rem;
	}

	a:hover {
		text-decoration: underline;
		color: blue;
	}
</style>
