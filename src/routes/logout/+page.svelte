<script lang="ts">
	import { goto } from '$app/navigation';
	import { logout } from '$lib/services/users';
	import { cache } from '$lib/stores/cache/store';
	import { loading } from '$lib/stores/loading/store';
	import { user } from '$lib/stores/user/store';
	import { onMount } from 'svelte';

	onMount(async () => {
		loading.set(false);
		await logout();
		user.setData(null);
		cache.refreshAll();
		goto('/sign-in');
	});
</script>

<style>
</style>
