<script>
	import { clickoutside } from '@svelte-put/clickoutside';
	import { slide } from 'svelte/transition';
	import { page } from '$app/stores';
	import '../app.css';
	import Menu from '$lib/menu/Menu.svelte';
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	import { base } from '$app/paths';

	const breakpoints = { xs: 320, sm: 576, md: 768, lg: 1024, xl: 1280, '2xl': 1536 };
	const mainPages = {
		// '/database': 'Database',
		// '/spring-form': 'Spring Data Collection',
		// '/tof-form': 'Time of Flight Data Collection'
	};
	const calculatorPages = {
		'/': 'All',
		'/calculators/energy': 'Energy Converter',
		'/calculators/ratio': 'Cylinder Ratio',
		'/calculators/spring': 'Spring to Energy',
		'/calculators/rof': 'Rate of Fire'
	};
	$: currentPath = $page.url.pathname;
	$: isCalcPage = currentPath.split('/')[1] === 'calculators';
	let sidebarOpen = false;
	let dropdownOpen = true;
	/**
	 * @type {number}
	 */
	let innerWidth;

	// $: dropdownOpen = isCalcPage;
	onMount(() => {
		themeChange(false);
	});
</script>

<svelte:window bind:innerWidth />
<div class="flex">
	<div
		use:clickoutside
		on:clickoutside={() => (sidebarOpen = false)}
		class="flex-shrink-0 w-screen px-8 py-0 z-10 bg-white h-14 flex fixed items-center justify-between shadow-lg"
	>
		<img
			src="{base}/logo.svg"
			alt="Logo containing drafting Compass and Hammer as A and T"
			width="50rem"
		/>
		<a
			on:click={() => (sidebarOpen = false)}
			href="/"
			class="text-lg font-semibold tracking-widest py-2 pr-2 text-gray-900 uppercase focus:outline-none"
			>Airsoft Tools</a
		>
		<Menu class="md:hidden" menuOpen={sidebarOpen} on:click={() => (sidebarOpen = !sidebarOpen)} />
	</div>
	<div class="text-gray-700 z-[9] bg-white flex-shrink-0 fixed shadow-xl">
		{#if sidebarOpen || innerWidth >= breakpoints.md}
			<nav
				transition:slide={{ delay: 10, duration: 150 }}
				class:shadow-lg={!sidebarOpen}
				class="flex-grow px-4 pb-4 w-screen md:w-64 pt-14 md:min-h-screen md:pb-0 md:overflow-y-auto bg-gray-100"
				style="display:flex; flex-direction:column; flex:1;"
			>
				<button
					on:click|stopPropagation={() => (dropdownOpen = !dropdownOpen)}
					class="py-0.5 mt-4 parent w-full"
				>
					<span
						class:!bg-gray-200={isCalcPage || '/' === currentPath}
						class="menuItem child transition-all"
					>
						<span>Calculators</span>
						<svg
							fill="currentColor"
							viewBox="0 0 20 20"
							class:rotate-180={dropdownOpen}
							class:rotate-0={!dropdownOpen}
							class="inline w-4 h-4 mt-1 ml-1 transition-transform duration-150 transform md:-mt-1"
							><path
								fill-rule="evenodd"
								d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
								clip-rule="evenodd"
							/></svg
						>
					</span>
				</button>
				{#if dropdownOpen}
					<div
						transition:slide={{ delay: 50, duration: 150 }}
						class="right-0 my-1 origin-top-right rounded-md shadow-lg"
					>
						<div class="px-2 py-2 bg-white rounded-md shadow">
							{#each Object.entries(calculatorPages) as [path, title]}
								<a class="py-0.5 block parent" on:click={() => (sidebarOpen = false)} href={path}
									><div class="menuItem" class:!bg-gray-200={path === currentPath}>
										{title}
									</div>
								</a>
							{/each}
						</div>
					</div>
				{/if}
				{#each Object.entries(mainPages) as [path, title]}
					<a class="py-0.5 block parent" on:click={() => (sidebarOpen = false)} href={path}>
						<div class:!bg-gray-200={path === currentPath} class="menuItem text-gray-900">
							{title}
						</div>
					</a>
				{/each}
				<div class="px-2 py-2 bg-white rounded-md shadow md:mb-4" style="margin-top: auto;">
					<a class="py-0.5 block parent" on:click={() => (sidebarOpen = false)} href="/changelog">
						<div class:!bg-gray-200={'/changelog' === currentPath} class="menuItem text-gray-900">
							Changelog
						</div>
					</a>
					<a
						class="py-0.5 block parent"
						href="https://github.com/Arsoth/airsoft.tools/issues"
						target="_blank"
						rel="noopener noreferrer"
					>
						<div class="menuItem text-gray-900">Submit a bug or request</div>
					</a>
				</div>
			</nav>
		{/if}
	</div>
	<div class="w-0 md:w-64 h-screen overflow-hidden flex-shrink-0"></div>
	<div class="px-4 relative container mt-16 mx-auto flex justify-center flex-wrap h-min">
		<slot />
	</div>
</div>

<style>
	.menuItem {
		@apply px-4 py-2 label text-sm font-semibold rounded-lg transition-all;
	}

	.menuItem:focus {
		@apply text-gray-900 bg-gray-200;
	}

	.parent:hover .menuItem {
		@apply text-gray-900 bg-gray-200;
	}
</style>
