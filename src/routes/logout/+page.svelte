<script lang="ts">
	import { goto } from '$app/navigation';
	import { logout } from '$lib/services/users';
	import { loading } from '$lib/stores/loading/store';
	import { user } from '$lib/stores/user/store';
	import { onMount } from 'svelte';

	onMount(async () => {
		loading.set(false);
		await logout();
		user.setData(null);
		goto('/sign-in');
	});
</script>

<style>
</style>
