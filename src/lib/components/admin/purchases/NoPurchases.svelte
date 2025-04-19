<script lang="ts">
	import Button, { Label } from '@smui/button';
	import { goto } from '$app/navigation';
	import { getTranslation } from '$lib/translations';
</script>

<div class="empty-state">
	<div class="empty-message-container">
		<h2>{getTranslation('purchases.empty')}</h2>
		<p class="subtitle">{getTranslation('purchases.emptyDescription')}</p>

		<div class="features">
			<div class="feature">
				<span class="feature-icon">🔒</span>
				<span class="feature-text">{getTranslation('purchases.securePayment')}</span>
			</div>
			<div class="feature">
				<span class="feature-icon">⚡️</span>
				<span class="feature-text">{getTranslation('purchases.instantAccess')}</span>
			</div>
			<div class="feature">
				<span class="feature-icon">🎥</span>
				<span class="feature-text">{getTranslation('purchases.hdQuality')}</span>
			</div>
		</div>

		<Button variant="raised" class="browse-button" onclick={() => goto('/')}>
			{getTranslation('purchases.browseCTA')}
		</Button>
	</div>
</div>

<style>
	.empty-state {
		text-align: center;
		padding: 60px 20px;
		margin: 0 auto;
	}

	@media (min-width: 600px) {
		.empty-state {
			max-width: 600px;
		}
	}

	@media (max-width: 599px) {
		.empty-state {
			width: 100%;
			padding: 20px 10px;
		}

		.empty-message-container {
			border-radius: 0;
		}
	}

	.empty-message-container {
		background: linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%);
		padding: 40px;
		border-radius: 20px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
	}

	h2 {
		font-size: 1.8rem;
		color: #333;
		margin-bottom: 1rem;
	}

	.subtitle {
		color: #666;
		font-size: 1.1rem;
		line-height: 1.5;
		margin-bottom: 2rem;
	}

	.features {
		display: flex;
		justify-content: center;
		gap: 2rem;
		margin-bottom: 2.5rem;
		flex-wrap: wrap;
	}

	.feature {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.feature-icon {
		font-size: 2rem;
	}

	.feature-text {
		color: #444;
		font-size: 1rem;
	}

	:global(.browse-button) {
		background: linear-gradient(45deg, #40c4ff, #a23cff);
		color: white;
		padding: 12px 32px;
		font-size: 1.1rem;
		border-radius: 25px;
		transition: transform 0.2s ease;
	}

	:global(.browse-button:hover) {
		transform: translateY(-2px);
	}
</style>
