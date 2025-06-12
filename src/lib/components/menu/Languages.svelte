<script lang="ts">
	import { page } from '$app/state';
	import { language } from '$lib/stores/language/store';
	import { type Language } from '$lib/translations';
	import ItalianFlag from '../icons/flags/ItalianFlag.svelte';
	import RussianFlag from '../icons/flags/RussianFlag.svelte';
	import SpanishFlag from '../icons/flags/SpanishFlag.svelte';
	import UkFlag from '../icons/flags/UKFlag.svelte';

	const changeLanguage = (newLanguage: Language): void => {
		if (page.url.pathname === `/${$language}`) {
			document.location.href = `/${newLanguage}`;
			return;
		}

		document.location.href = page.url.pathname.replace(`/${$language}/`, `/${newLanguage}/`);
		return;
	};
</script>

<div class="languages">
	<button onclick={() => changeLanguage('en')}>
		<UkFlag />
	</button>
	<button onclick={() => changeLanguage('es')}>
		<SpanishFlag />
	</button>
	<button onclick={() => changeLanguage('it')}>
		<ItalianFlag />
	</button>
	<button onclick={() => changeLanguage('ru')}>
		<RussianFlag />
	</button>
</div>

<style>
	.languages {
		position: absolute;
		bottom: 15px;
		right: 10px;
	}
	button {
		cursor: pointer;
		margin: 0px 5px;
	}
</style>
