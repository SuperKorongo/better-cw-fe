<script lang="ts">
	import HamburgerIcon from '../icons/HamburgerIcon.svelte';
	import HomeIcon from '../icons/HomeIcon.svelte';
	import Search from './search/Search.svelte';

	import { language } from '$lib/stores/language/store';
	import { onClickInternalLink } from '$lib/utils/utils';
</script>

<nav>
	<div class="home-container">
		<a onclick={onClickInternalLink} data-sveltekit-preload-data="tap" href={`/${$language}`}>
			<HomeIcon />
		</a>
	</div>
	<div class="search-container">
		<Search />
	</div>
	<div class="hamburger-menu-container">
		<HamburgerIcon />
	</div>
</nav>

<style>
	nav {
		z-index: 1;
		width: 100%;
		position: fixed;
		top: 0;
		text-align: center;
		background-color: #010c2f;
		box-shadow: 0px 0px 12px 4px black;
		height: var(--navbar-height);
	}

	.home-container {
		padding-top: 15px;
		float: left;
		width: 60px;
		margin-left: 10px;
	}
	.hamburger-menu-container {
		float: right;
		padding-top: 14px;
		margin-right: 20px;
		width: 35px;
		cursor: pointer;
		overflow-y: hidden;
	}
	.search-container {
		padding-top: 4px;
		position: absolute;
		text-align: center;
		height: var(--navbar-height);
	}

	@media (max-width: 600px) {
		.search-container {
			margin-left: 20%;
			width: 60%;
		}
	}
	@media (min-width: 600px) {
		.search-container {
			margin-left: 30%;
			width: 40%;
		}
	}
	@media (min-width: 1000px) {
		.search-container {
			margin-left: 35%;
			width: 30%;
		}
	}
	@media (min-width: 1500px) {
		.search-container {
			margin-left: 35%;
			width: 30%;
		}
	}
	@media (min-width: 1920px) {
		.search-container {
			margin-left: 40%;
			width: 20%;
		}
	}
</style>
