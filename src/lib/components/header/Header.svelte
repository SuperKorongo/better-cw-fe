<script lang="ts">
	import { getTranslation } from '$lib/translations';
	import GlowingText from '../common/GlowingText.svelte';

	let {
		mainText = getTranslation('headers.browsing'),
		subject = '',
		value = ''
	}: {
		mainText?: string;
		subject?: string;
		value?: string;
	} = $props();
</script>

<header>
	<h1>
		{mainText}{subject}
		<GlowingText text={value} />
	</h1>
</header>

<style>
	header {
		margin-top: -35px;
		padding: 0% 3rem;
		margin-bottom: 30px;
	}
	h1 {
		padding-top: calc(var(--navbar-height) + 40px);
		font: 900 clamp(0.875em, 7.25vw, 2.5em) sans-serif;
		text-align: center;
		text-transform: uppercase;
	}
</style>
