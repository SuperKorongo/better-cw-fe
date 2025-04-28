<script lang="ts">
	import type { Dispute } from '$lib/models/Dispute';

	let { dispute }: { dispute: Dispute } = $props();
</script>

<section>
	{dispute.claims[0].contents}
</section>

<style>
	section {
		padding: 30px 50px;
	}
</style>
