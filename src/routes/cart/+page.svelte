<script lang="ts">
	import Cart from '$lib/components/cart/Cart.svelte';
	import { onMount } from 'svelte';
	import { loading } from '../../stores/loading/store';

	onMount(() => loading.set(false));
</script>

<main>
	<Cart />
</main>

<style>
	main {
		top: var(--navbar-height);
		position: absolute;
		height: calc(100% - var(--navbar-height));
		background-color: white;
		z-index: -1;
		box-shadow: 0px 0px 10px 5px #686800;
	}

	@media (max-width: 600px) {
		main {
			left: 2.5%;
			width: 95%;
		}
	}
	@media (min-width: 600px) {
		main {
			left: 10%;
			width: 80%;
		}
	}
	@media (min-width: 1200px) {
		main {
			left: 20%;
			width: 60%;
		}
	}
	@media (min-width: 1600px) {
		main {
			left: 25%;
			width: 50%;
		}
	}
</style>
