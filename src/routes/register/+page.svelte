<script lang="ts">
	import { goto } from '$app/navigation';
	import { loading } from '$lib/stores/loading/store';
	import { user as userStore } from '$lib/stores/user/store';
	import { getTranslation } from '$lib/translations';
	import { enterKeyCheck } from '$lib/utils/utils';
	import { onClickRegisterButton } from './events';

	let username: string = $state('');
	let email: string = $state('');
	let password: string = $state('');
	let repeatPassword: string = $state('');
	let button: HTMLElement;

	$effect(() => {
		if ($userStore.ready) {
			loading.set(false);
		}
		if ($userStore.data !== null) {
			goto('/');
		}
	});

	const onKeyPress = ({ key }: KeyboardEvent) => {
		enterKeyCheck(key, () => button.click());
	};
</script>

<main>
	<div class="register-container">
		<h2 class="register-title">{getTranslation('signUpForm.title')}</h2>

		<div class="form-group">
			<input
				onkeypress={onKeyPress}
				bind:value={username}
				type="text"
				placeholder={getTranslation('signUpForm.username')}
			/>
			<span class="input-icon">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="gray"
					width="16"
					height="16"
				>
					<path
						d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
					/>
				</svg>
			</span>
		</div>

		<div class="form-group">
			<input
				onkeypress={onKeyPress}
				bind:value={email}
				type="email"
				placeholder={getTranslation('signUpForm.email')}
			/>
			<span class="input-icon">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="gray"
					width="16"
					height="16"
				>
					<path
						d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
					/>
				</svg>
			</span>
		</div>

		<div class="form-group">
			<input
				onkeypress={onKeyPress}
				bind:value={password}
				type="password"
				placeholder={getTranslation('signUpForm.password')}
			/>
			<span class="input-icon">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="gray"
					width="16"
					height="16"
				>
					<path
						d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6-3c1.66 0 3 1.34 3 3v2H9V8c0-1.66 1.34-3 3-3z"
					/>
				</svg>
			</span>
		</div>

		<div class="form-group">
			<input
				onkeypress={onKeyPress}
				bind:value={repeatPassword}
				type="password"
				placeholder={getTranslation('signUpForm.repeatPassword')}
			/>
			<span class="input-icon">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="gray"
					width="16"
					height="16"
				>
					<path
						d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6-3c1.66 0 3 1.34 3 3v2H9V8c0-1.66 1.34-3 3-3z"
					/>
				</svg>
			</span>
		</div>

		<button
			bind:this={button}
			onclick={() =>
				onClickRegisterButton(
					() => username,
					() => email,
					() => password,
					() => repeatPassword
				)}
			class="register-button"
		>
			{getTranslation('signUpForm.registerButtonLabel')}
		</button>
	</div>
</main>

<style>
	main {
		top: var(--navbar-height);
		position: absolute;
		background-color: white;
		z-index: -1;
		box-shadow: 0px 0px 10px 5px #686800;
	}

	@media (max-width: 900px) {
		main {
			left: 2.5%;
			width: 95%;
		}
	}
	@media (min-width: 900px) {
		main {
			width: 40%;
			left: 30%;
		}
	}
	.register-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20px;
		font-family: Arial, sans-serif;
	}

	.register-title {
		font-size: 24px;
		font-weight: bold;
		margin-bottom: 20px;
		color: #333;
	}

	.form-group {
		width: 100%;
		max-width: 300px;
		margin-bottom: 15px;
		position: relative;
	}

	input {
		width: 100%;
		padding: 10px 10px 10px 30px; /* Increased left padding to accommodate the icon */
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 14px;
		box-sizing: border-box;
	}

	.input-icon {
		position: absolute;
		left: 10px;
		top: 50%;
		transform: translateY(-50%);
		width: 16px;
		height: 16px;
		fill: gray; /* Ensures the SVG fill is gray */
	}

	.register-button {
		width: 100%;
		padding: 12px;
		background: linear-gradient(45deg, #40c4ff, #a23cff);
		border: none;
		border-radius: 25px;
		color: white;
		font-size: 16px;
		font-weight: bold;
		cursor: pointer;
		margin-top: 20px;
		transition: opacity 0.3s;
	}

	.register-button:hover {
		opacity: 0.9;
	}
</style>
