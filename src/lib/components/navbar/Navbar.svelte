<script lang="ts">
	import HamburgerIcon from '../icons/HamburgerIcon.svelte';
	import Search from './search/Search.svelte';

	import { getHrefWithLanguage, onClickInternalLink } from '$lib/utils/utils';
</script>

<nav>
	<div class="home-container">
		<a
			onclick={onClickInternalLink}
			data-sveltekit-preload-data="tap"
			href={getHrefWithLanguage(`/`)}
		>
			<img alt="Better CamWhores logo" class="logo" src="/android-chrome-192x192.png" />
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
	.logo {
		max-width: 45px;
		border-bottom-left-radius: 9px;
		border-top-right-radius: 9px;
		border-bottom-right-radius: 9px;
	}
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
		padding-top: 10px;
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
