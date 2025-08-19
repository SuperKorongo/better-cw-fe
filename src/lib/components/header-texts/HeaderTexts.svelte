<script lang="ts">
	import GlowingText from '$lib/components/common/GlowingText.svelte';

	import { getTranslation } from '$lib/translations';
	import { getBrandName } from '$lib/utils/utils';
</script>

<header>
	<h1>
		<GlowingText text={getBrandName('extended')} />
	</h1>
	<h2>{getTranslation('homepage.title')}</h2>
	<h3>{getTranslation('homepage.subTitle').replace('{BRAND}', getBrandName('short'))}</h3>
	<section class="description">
		{getTranslation('homepage.desc1')}<br />
		{getTranslation('homepage.desc2')}<br />
		{getTranslation('homepage.desc3')}<br />
		{getTranslation('homepage.desc4')}<br />
	</section>
</header>

<style>
	header {
		margin-top: calc(var(--navbar-height) + 40px);
		padding: 0% 3rem;
		margin-bottom: 30px;
	}
	h1,
	h2,
	h3 {
		text-align: center;
	}
	h1 {
		font: 900 clamp(0.875em, 7.25vw, 2.5em) sans-serif;
		font-size: 60px;
		text-align: center;
		text-shadow: 0px 0px 5px rgba(255, 255, 255, 0.24);
		text-transform: uppercase;
	}
	h2 {
		font-size: 40px;
	}
	h3 {
		font-size: 25px;
		text-shadow: 0px 0px 5px rgb(0, 0, 0);
	}
	.description {
		font-size: 18px;
		text-align: center;
		font-weight: bold;
		line-height: 36px;
	}
</style>
