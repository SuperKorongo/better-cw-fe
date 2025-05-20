<script lang="ts">
	import { videoForm } from '$lib/stores/video-form/store';
	import Textfield from '@smui/textfield';

	let { price }: { price: string } = $props();
	let isValid: boolean = $state(true);

	const onChange = () => {
		videoForm.setPriceInCentsOfDollar(Math.round(parseFloat((getPriceAsFloat() * 100).toFixed(2))));
	};

	const onblur = () => {
		price = getPriceAsFloat().toFixed(2).toLocaleString();
	};

	function getPriceAsFloat(): number {
		const priceAsFloat = parseFloat(price.replace(',', '.').replace(/[^.0-9]/g, ''));
		if (isNaN(priceAsFloat)) {
			price = '';
			return 0;
		}
		return priceAsFloat;
	}

	$effect.pre(onChange);
</script>

<div class="main-container">
	<Textfield
		invalid={!isValid}
		onchange={onChange}
		{onblur}
		prefix="$"
		suffix="USD"
		variant="outlined"
		bind:value={price}
	/>
</div>

<style>
</style>
