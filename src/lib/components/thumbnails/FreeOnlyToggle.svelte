<script lang="ts">
	import { getTranslation } from '$lib/translations';
	import FormField from '@smui/form-field';
	import Switch from '@smui/switch';

	let { value = $bindable(false) }: { value: boolean } = $props();
</script>

<div class="container">
	{getTranslation('homepage.freeVideosOnly')}
	<FormField align="end">
		<Switch
			onclick={() => {
				value = !value;
			}}
			bind:checked={value}
		/>
	</FormField>
</div>

<style>
	.container {
		color: #eee;
		font-size: 13px;
	}
</style>
