<script lang="ts">
	import { getTranslation } from '$lib/translations';
</script>

<div class="main-container">
	<span class="explanation">{getTranslation('upload.visibilityExplanation1')}</span>
	<span class="explanation">{getTranslation('upload.visibilityExplanation2')}</span>
</div>

<style>
	.explanation {
		color: #888;
		font-size: 13px;
		display: block;
	}
</style>
