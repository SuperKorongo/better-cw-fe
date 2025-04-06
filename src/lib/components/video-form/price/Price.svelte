<script lang="ts">
	import { videoForm } from '$lib/stores/video-form/store';
	import Textfield from '@smui/textfield';

	let { price }: { price: string } = $props();
	let isValid: boolean = $state(true);

	const onChange = () => {
		const priceAsFloat = parseFloat(price.replace(',', '.').replace(/[^.0-9]/g, ''));
		if (isNaN(priceAsFloat)) {
			price = '';
			return;
		}

		price = priceAsFloat.toFixed(2).toLocaleString();
		videoForm.setPriceInCentsOfDollar(Math.round(parseFloat((priceAsFloat * 100).toFixed(2))));
	};

	$effect.pre(onChange);
</script>

<div class="main-container">
	<Textfield
		invalid={!isValid}
		onchange={onChange}
		prefix="$"
		suffix="USD"
		variant="outlined"
		bind:value={price}
	/>
</div>

<style>
</style>
