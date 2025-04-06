<script lang="ts">
	import { type Language } from '$lib/translations';
	import { language as languageStore } from '../../../stores/language/store';
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
</div>

<style>
	.languages {
		position: absolute;
		top: 5px;
		left: 10px;
	}
	button {
		cursor: pointer;
	}
</style>
