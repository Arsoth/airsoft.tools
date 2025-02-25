<script lang="ts">
	import { ChangeLog } from '$lib/changelog';
</script>

<svelte:head>
	<title>Changelog</title>
</svelte:head>

<main>
	{#each Object.entries(ChangeLog) as [date, content]}
		<div class="cardWrapper">
			<span class="cardTop">{date} - {content.title}</span>
			<div class="cardBody">
				{#each content.body as paragraph}<p>{paragraph}</p>{/each}
			</div>
		</div>
	{/each}
</main>

<style lang="postcss">
	.cardTop {
		border-radius: 0.5rem 0.5rem 0 0;
		min-height: 2.5rem;
		@apply label w-full text-lg font-bold px-4 py-2 text-gray-900 z-[2] bg-base-200 drop-shadow-lg;
	}
	.cardWrapper {
		min-width: 20rem;
		@apply card bg-base-100 shadow-xl m-4 h-min;
	}

	.cardBody {
		@apply card-body p-6 pt-3;
	}
</style>
