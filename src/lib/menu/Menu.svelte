<script>
	export let menuOpen;
	let transition;

	const EASING = `cubic-bezier(0.4, 0, 0.2, 1)`;
	$: transition = menuOpen
		? `top 200ms 50ms ${EASING}, transform 200ms 250ms ${EASING}`
		: `top 200ms 250ms ${EASING}, transform 200ms 50ms ${EASING}`;
</script>

<div class="p-2 cursor-pointer" on:click on:keydown on:keypress role="button" tabindex="0">
	<div class="burger-menu {$$props.class || ''}" class:menuOpen>
		<span
			class="line top"
			style="transition: {transition}; {menuOpen ? 'transform: rotate(45deg)' : ''}"
		></span>
		<span
			class="line mid"
			style="transition: {transition}; {menuOpen ? 'transform: rotate(45deg)' : ''}"
		></span>
		<span
			class="line bottom"
			style="transition: {transition}; {menuOpen ? 'transform: rotate(-45deg)' : ''}"
		></span>
	</div>
</div>

<style>
	.burger-menu {
		position: relative;
		cursor: pointer;
		height: 1.25rem;
		width: 2rem;
		outline: none !important;
	}

	.line {
		position: absolute;
		background: currentColor;
		width: 100%;
		height: 2px;
		border-radius: 2px;
	}

	.top {
		top: 0;
	}
	.mid {
		top: calc(50% - 1px);
	}
	.bottom {
		top: calc(100% - 2px);
	}

	.menuOpen .line {
		top: calc(50% - 1px) !important;
	}
</style>
