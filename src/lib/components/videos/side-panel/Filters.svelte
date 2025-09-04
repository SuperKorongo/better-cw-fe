<script lang="ts">
	import Textfield from '@smui/textfield';

	let searchTerm: string = $state('');
</script>

<div class="main">
	<div class="filter">
		<Textfield
			variant="outlined"
			style="width: 100%"
			bind:value={searchTerm}
			label={'Search term'}
			input$maxlength={255}
		/>
	</div>
	Order by<br />
	Price range <br />
	Public only / private only / all (all marked by default)<br />
	Duration (short/medium/long/any) (any marked by default) (1s to 2m, 2m to 20m, 15m to infinite)
	<br />
	Apply / Reset
</div>

<style>
</style>
