<script lang="ts">
	import FormField from '@smui/form-field';
	import Switch from '@smui/switch';

	let { value = $bindable(false) }: { value: boolean } = $props();
</script>

<div class="container">
	Free videos only
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
