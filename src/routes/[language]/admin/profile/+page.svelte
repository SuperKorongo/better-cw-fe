<script lang="ts">
	import StarRating from '$lib/components/common/StarRating.svelte';
	import * as toasts from '$lib/components/toasts/toasts';
	import { changePassword } from '$lib/services/users';
	import { loading } from '$lib/stores/loading/store';
	import { user } from '$lib/stores/user/store';
	import { getTranslation } from '$lib/translations';
	import { getFormattedDate, handleApiError } from '$lib/utils/utils';
	import Button from '@smui/button';
	import Textfield from '@smui/textfield';
	import { onMount } from 'svelte';

	onMount(() => loading.set(false));

	let currentPassword: string = $state('');
	let newPassword: string = $state('');

	const onClickChangePassword = async () => {
		if (newPassword.length < 8) {
			toasts.warning(getTranslation('signInForm.errors.invalidPassword'));
			return;
		}
		if ($loading.value) {
			return;
		}

		try {
			loading.set(true);
			await changePassword(currentPassword, newPassword);
			toasts.success(getTranslation('admin.profile.passwordChangedSuccessfully'));
			currentPassword = '';
			newPassword = '';
		} catch (e: unknown) {
			const funcMap = new Map<number, () => void>();
			funcMap.set(409, () => {
				toasts.error(getTranslation('admin.profile.invalidPassword'));
			});
			handleApiError(e, 'signInForm.errors.serverError', funcMap);
		} finally {
			loading.set(false);
		}
	};
</script>

<section>
	<h2>{getTranslation('admin.profile.welcome')} {$user.data!.username}!</h2>
	<span class="member-since">
		{getTranslation('admin.profile.memberSince')}
		{getFormattedDate($user.data!.sinceTimestamp)}
	</span>
	<div class="your-rating">
		<h3>{getTranslation('admin.profile.yourRating')}</h3>
		<div class="stars-container">
			<StarRating totalStars={5} value={$user.data!.rating} />
		</div>
		<span class="total-ratings">
			({$user.data!.rating.toFixed(2)}
			{getTranslation('admin.profile.outOf')}
			{$user.data!.totalRatings}
			{getTranslation('admin.profile.totalRatings')})
		</span>
	</div>
	<div class="data">
		<h3>{getTranslation('admin.profile.email')}</h3>
		<span>{$user.data!.email}</span>
		<div class="change-password-form">
			<h3>{getTranslation('admin.profile.changePassword')}</h3>
			<div class="text-field-container">
				<Textfield
					type="password"
					label={getTranslation('admin.profile.currentPassword')}
					style="width: 100%"
					bind:value={currentPassword}
				/>
			</div>
			<div class="text-field-container">
				<Textfield
					type="password"
					label={getTranslation('admin.profile.newPassword')}
					style="width: 100%"
					bind:value={newPassword}
				/>
			</div>
			<Button onclick={onClickChangePassword} variant="raised">
				{getTranslation('admin.profile.change')}
			</Button>
		</div>
	</div>
</section>

<style>
	section {
		padding: 30px 50px;
		text-align: center;
	}
	.member-since {
		font-size: 14px;
		font-style: italic;
		color: #888;
		display: block;
		margin-top: -10px;
	}
	.your-rating {
		margin-top: 40px;
	}
	.your-rating > h3 {
		margin-bottom: 10px;
	}
	.stars-container {
		margin-top: -15px;
		background: linear-gradient(45deg, #40c4ff, #a23cff);
		width: 150px;
		text-align: center;
		padding: 10px 0px;
		border-radius: 15px;
		margin: 0 auto;
	}
	.total-ratings {
		color: #888;
		font-size: 13px;
		font-style: italic;
	}
	.data {
		margin-top: 50px;
	}
	.data > h3 {
		margin-bottom: 5px;
	}
	.change-password-form {
		margin: 0 auto;
		margin-top: 45px;
		max-width: 300px;
		border-radius: 15px;
		padding: 1.5rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
	.change-password-form > h3 {
		margin-top: 0px;
	}
	.text-field-container {
		margin-bottom: 20px;
	}
</style>
