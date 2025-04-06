<script lang="ts">
	import { menu } from '../../../stores/menu/store';

	const onClick = () => {
		menu.setVisibility(!$menu.isVisible);
	};
</script>

<button aria-label="cart" onclick={onClick}>
	<svg xmlns="http://www.w3.org/2000/svg">
		<rect x="1" y="8" width="35px" height="1" rx="2" />
		<rect x="1" y="18" width="35px" height="1" rx="2" />
		<rect x="1" y="28" width="35px" height="1" rx="2" />
	</svg>
</button>

<style>
	button {
		cursor: pointer;
		height: 10px;
	}
	svg {
		width: 100%;
		height: 35px;
		fill: #eee;
		stroke: #eee;
	}
</style>
