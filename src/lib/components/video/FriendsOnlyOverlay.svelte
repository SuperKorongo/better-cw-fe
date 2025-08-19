<script lang="ts">
</script>

<div class="main-container">
	<div class="inner">
		perfect TODO: Show also button to add friends in member page (es/users/whatever) also you may
		need another endpoint to see if the user is a friend, or if there is a pending friend request.
		if user is friend -> show you are friends with this user. if the friend request is pending ->
		show you already sent a friend request if user is not friend -> show button to send a friend
		request
	</div>
</div>

<style>
	.inner {
		padding: 30px 15px;
		text-align: center;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
	}

	.main-container {
		background-color: rgba(0, 0, 0, 0.7);
		position: relative;
		width: 100%;
		z-index: 1;
		border-radius: 20px;
	}

	@media (max-width: 600px) {
		.main-container {
			height: 250px;
			margin-bottom: -290px;
		}
	}
	@media (min-width: 600px) {
		.main-container {
			height: 500px;
			margin-bottom: -540px;
		}
	}
	@media (min-width: 1921px) {
		.main-container {
			height: 650px;
			margin-bottom: -690px;
		}
	}
	@media (min-width: 2500px) {
		.main-container {
			height: 800px;
			margin-bottom: -840px;
		}
	}
</style>
