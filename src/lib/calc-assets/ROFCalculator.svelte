<script lang="ts">
	import { decimalizeString, roundTo, validateNumber } from '$lib/util-lib';
	import type { SpecsObject } from '$lib/types';
	import { gearShotsPerCycle } from '$lib/values';
	import { slide } from 'svelte/transition';
	import CalcHeader from '$lib/calc-assets/CalcHeader.svelte';

	const motorObject: SpecsObject = { maxValue: 100, maxLength: 5 };
	const ratioObject: SpecsObject = { maxValue: 50, maxLength: 5 };
	let motorSpeed = { value: '', inValid: false };
	let selectedGearType: 1;
	let ratio = { value: '', inValid: false };
	let output = '';
	let infoOpen = false;
	function calculateROF(event: { preventDefault: () => void }) {
		event.preventDefault();
		output = '';
		if (motorSpeed.value === '') {
			motorSpeed.inValid = true;
		}

		if (ratio.value === '') {
			ratio.inValid = true;
		}

		if (Number(motorSpeed.value) > 0 && Number(ratio.value) >= 0) {
			motorSpeed.inValid = false;
			ratio.inValid = false;
			buildOutput(Number(ratio.value), selectedGearType, Number(motorSpeed.value));
		}
	}
	function buildOutput(ratio: number, gearType: number, motorSpeed: number) {
		let rofLow = roundTo(((motorSpeed * 1000 * 0.8) / 60 / ratio) * gearType, 0);
		let rofHigh = roundTo(((motorSpeed * 1000 * 0.9) / 60 / ratio) * gearType, 0);
		output = `${rofLow} - ${rofHigh} RPS`;
	}

	$: motorSpeed.value = decimalizeString(motorSpeed.value);
</script>

<div class="calcCard card w-80 bg-base-200 shadow-xl m-4 h-min">
	<CalcHeader title="ROF Calculator" bind:open={infoOpen} />
	{#if infoOpen}
		<div
			class="px-4 pb-2 py-1 bg-gray-300 drop-shadow-md"
			transition:slide={{ delay: 10, duration: 150 }}
		>
			<p class="font-bold">
				Data is approximate and is based 80-90% efficience of the motor to help stay inside any ROF
				limits.
			</p>
		</div>
	{/if}
	<div class="card-body p-6 pt-3">
		<form id="ROF-calculator-input">
			<div class="join pb-1" style="display: flex;">
				<span class="grow basis-0 p-0 justify-center">
					<div class="afterContainer" style="width: 100%">
						<label for="barrelLength" class="label pt-2 font-bold pb-1">
							<span class="label-text" style="width: 100%; text-align:center">Ratio</span>
						</label>
						{#if ratio.value}<span
								class="floatsAfter input text-slate-400 toOneAfter"
								style="top: 55%">{ratio.value}</span
							>
						{/if}
						<input
							class="input input-bordered w-full focus:ring-2 focus:ring-inset ring-slate-300 !outline-none transition-colors placeholder:text-slate-400"
							style="border-radius: 0.5rem 0rem 0rem 0.5rem;"
							class:bg-red-100={ratio.inValid && ratio.value === ''}
							id="barrelLength"
							bind:value={ratio.value}
							placeholder={'18:1'}
							on:beforeinput={(event) => validateNumber(event, ratio.value, ratioObject)}
							on:input={() => (ratio.inValid = false)}
							inputmode="decimal"
							autocomplete="off"
						/>
					</div>
				</span>
				<span class="grow basis-0 p-0 justify-center">
					<label for="gearType" class="label pt-2 font-bold pb-1">
						<span class="label-text" style="width: 100%; text-align:center">Gear Type</span>
					</label>
					<select
						bind:value={selectedGearType}
						id="gearType"
						style="width: 100%;"
						class="select select-primary join-item focus:outline-none focus:outline-[3px] focus:outline-primary focus:outline-offset-[-3px] pl-3 pr-3 join-item"
					>
						{#each Object.entries(gearShotsPerCycle) as [title, data]}
							<option value={data}>{title}</option>
						{/each}
					</select>
				</span>
				<span class="grow basis-0 p-0 justify-center">
					<div class="afterContainer" style="width: 100%">
						<label for="barrelLength" class="label pt-2 font-bold pb-1">
							<span class="label-text" style="width: 100%; text-align:center">Motor RPM</span>
						</label>
						{#if motorSpeed.value}<span
								class="floatsAfter input text-slate-400 kAfter"
								style="top: 55%">{motorSpeed.value}</span
							>
						{/if}
						<input
							class="input input-bordered w-full focus:ring-2 focus:ring-inset ring-slate-300 !outline-none transition-colors placeholder:text-slate-400"
							style="border-radius: 0rem 0.5rem 0.5rem 0rem;"
							class:bg-red-100={motorSpeed.inValid && motorSpeed.value === ''}
							id="barrelLength"
							bind:value={motorSpeed.value}
							placeholder={'36k'}
							on:beforeinput={(event) => validateNumber(event, motorSpeed.value, motorObject)}
							on:input={() => (motorSpeed.inValid = false)}
							inputmode="decimal"
							autocomplete="off"
						/>
					</div>
				</span>
			</div>
			<button
				class="btn btn-warning w-full mt-4 text-lg font-bold"
				on:click={calculateROF}
				class:!btn-secondary={Number(motorSpeed.value) > 0}
				>Rate of Fire
			</button>
		</form>
		<div class="label min-h-[1.75rem] items-start p-0 justify-center text-lg font-bold select-text">
			{output}
		</div>
	</div>
</div>

<style lang="postcss">
	@import './calc.css';
	.floatsAfter {
		visibility: hidden;
		position: absolute;
		z-index: 2;
	}
	.kAfter::after {
		content: 'k';
		visibility: visible;
	}
	.toOneAfter::after {
		content: ':1';
		visibility: visible;
	}
	.afterContainer {
		display: inline-block;
		position: relative;
		width: 100%;
	}
</style>
