<script lang="ts">
	import FormField from '@smui/form-field';
	import Switch from '@smui/switch';

	let { value = $bindable(false) }: { value: boolean } = $props();
</script>

<div class="container">
	<FormField align="end">
		<Switch
			onclick={() => {
				value = !value;
			}}
			bind:checked={value}
		/>
		{#snippet label()}
			<!-- TODO: TRANSLATION - TODO: ADJUST VIDEO FORM: BY DEFAULT PRICE OF 1.00, THEN ADD TOGGLE TO MAKE THE VIDEO FREE -->
			Free videos only
		{/snippet}
	</FormField>
</div>

<style>
	.container {
		display: none; /* TODO: Better label */
	}
</style>
