<script lang="ts">
	import { goto } from '$app/navigation';
	import { logout } from '$lib/services/users';
	import { onMount } from 'svelte';
	import { loading } from '../../stores/loading/store';
	import { user } from '../../stores/user/store';

	onMount(async () => {
		loading.set(false);
		await logout();
		user.setData(null);
		goto('/sign-in');
	});
</script>

<style>
</style>
