<script lang="ts">
	import { goto } from '$app/navigation';
	import { logout } from '$lib/services/users';
	import { cacheInvalidation } from '$lib/stores/cache-invalidation/store';
	import { language } from '$lib/stores/language/store';
	import { loading } from '$lib/stores/loading/store';
	import { user } from '$lib/stores/user/store';
	import { onMount } from 'svelte';

	onMount(async () => {
		loading.set(false);
		await logout();
		user.setData(null);
		cacheInvalidation.refreshAll();
		console.log(`${$language}/sign-in`);
		goto(`${$language}/sign-in`);
	});
</script>

<style>
</style>
