<script>
	import { clickoutside } from '@svelte-put/clickoutside';

	export let open = false;
	export let title;
</script>

<button
	use:clickoutside
	on:clickoutside={() => (open = false)}
	on:click={() => (open = !open)}
	class="calc-top label w-full text-xl font-bold px-4 py-2 text-gray-900 z-[2] bg-base-300 drop-shadow-lg"
>
	<span>{title}</span>
	<svg
		fill="currentColor"
		viewBox="0 0 20 20"
		class:rotate-180={open}
		class:rotate-0={!open}
		class="inline w-6 h-6 transition-transform duration-150 transform"
		><path
			fill-rule="evenodd"
			d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
			clip-rule="evenodd"
		/></svg
	>
</button>

<style lang="postcss">
	.calc-top {
		border-radius: 0.5rem 0.5rem 0 0;
		height: 2.5rem;
	}
</style>
