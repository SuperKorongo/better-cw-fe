<script lang="ts">
	import { goto } from '$app/navigation';
	import { language } from '$lib/stores/language/store';
	import { loading } from '$lib/stores/loading/store';
	import { search } from '$lib/stores/search/store';
	import { getTranslation } from '$lib/translations';
	import {
		enterKeyCheck,
		getSearchAndOrderQueryParams,
		isVideoDisplayRoute
	} from '$lib/utils/utils';
	import SearchIcon from './SearchIcon.svelte';

	let searchInput: HTMLInputElement;

	function onClick() {
		search.set({ value: searchInput.value, forceLoad: true });

		if (isVideoDisplayRoute()) {
			goto(getSearchAndOrderQueryParams());
		} else {
			loading.set(true);
			goto(`/${$language}` + getSearchAndOrderQueryParams());
		}
	}

	function onKeyPress({ key }: KeyboardEvent) {
		enterKeyCheck(key, onClick);
	}
</script>

<div class="container">
	<input
		onkeypress={onKeyPress}
		bind:this={searchInput}
		type="text"
		value={$search.value}
		placeholder={getTranslation('search.placeholder')}
	/>
	<div class="icon-container">
		<button onclick={onClick}>
			<SearchIcon />
		</button>
	</div>
</div>

<style>
	.container {
		position: absolute;
		display: grid;
		grid-template-columns: 90% 10%;
		align-items: center;
		width: 100%;
		margin: 0;
		top: 50%;
		transform: translateY(-50%);
	}
	input {
		border: 0.5px solid #002eb7;
		border-right: none;
		border-top-left-radius: 20px;
		border-bottom-left-radius: 20px;
		padding: 0px 20px;
		background-color: #000925;
		color: #eee;
		outline: none;
		height: calc(var(--navbar-height) - 20px);
	}
	input:focus {
		border: 0.8px solid #003ae8;
		border-right: none;
	}
	input:focus + .icon-container {
		border: 0.8px solid #003ae8;
		border-left: none;
	}

	.icon-container {
		border: 0.5px solid #002eb7;
		border-left: none;
		height: calc(var(--navbar-height) - 20px);
		border-top-right-radius: 20px;
		border-bottom-right-radius: 20px;
		background-color: #000925;
		cursor: pointer;
	}
	.icon-container:hover,
	.icon-container:focus,
	.icon-container:active {
		background-color: #002eb7;
	}

	button {
		height: 100%;
		cursor: pointer;
	}
</style>
