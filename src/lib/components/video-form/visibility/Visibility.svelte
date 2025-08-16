<script lang="ts">
	import { getTranslation } from '$lib/translations';
	import Switch from '@smui/switch';

	let { visibility, price }: { visibility: 'private' | 'public', price: number } = $props();

	let publicState: boolean = $state(true);
	let privateState: boolean = $state(false);


</script>

<div class="main-container">
	<span class="explanation">{getTranslation('upload.visibilityExplanation1')}</span>
	<span class="explanation">{getTranslation('upload.visibilityExplanation2')}</span>
	<Switch
		onclick={async (e: Event) => {
		}}
		checked={publicState}
	/>
</div>

<style>
	.explanation {
		color: #888;
		font-size: 13px;
		display: block;
	}
</style>
