<script lang="ts">
	import { language as languageStore } from '$lib/stores/language/store';
	import { type Language } from '$lib/translations';
	import ItalianFlag from '../icons/flags/ItalianFlag.svelte';
	import SpanishFlag from '../icons/flags/SpanishFlag.svelte';
	import UkFlag from '../icons/flags/UKFlag.svelte';

	const changeLanguage = (language: Language) => {
		languageStore.set(language);
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
