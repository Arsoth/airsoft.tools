<script lang="ts">
	import {
		bbEnergyNormalizedJouleOutput,
		convertSpeed,
		decimalizeString,
		fpsOut,
		mpsOut,
		padZeros,
		validateNumber
	} from '$lib/util-lib';
	import { slide } from 'svelte/transition';
	import type { FullSpecsObject } from '$lib/types';
	import { roundTo } from '$lib/util-lib.js';
	import CalcHeader from '$lib/calc-assets/CalcHeader.svelte';

	const energyTypes: FullSpecsObject = {
		Joules: { maxValue: 6, maxLength: 4 },
		FPS: { maxValue: 750, maxLength: 6 },
		MPS: { maxValue: 230, maxLength: 6 }
	};

	const bbObject: FullSpecsObject = { bb: { maxValue: 3, maxLength: 5 } };

	let tempObject = {
		inputEnergy: { value: '', inValid: false },
		bbWeight: { value: '', inValid: false },
		compareWeight: { value: '', inValid: false }
	};

	let selectedEnergy = 'Joules';
	let inputEnergy: number;
	let bbWeight: number;
	let comparisonBbWeight: number;
	let speedConversion = '';
	let primaryOutput = '';
	let comparisonOutput = '';
	let infoOpen = false;
	function calculateEnergy(event: { preventDefault: () => void }) {
		event.preventDefault();
		primaryOutput = '';
		comparisonOutput = '';
		inputEnergy = Number(tempObject.inputEnergy.value);
		bbWeight = Number(tempObject.bbWeight.value);
		comparisonBbWeight = Number(tempObject.compareWeight.value);
		if (inputEnergy === 0) {
			tempObject.inputEnergy.inValid = true;
		}

		if (bbWeight === 0) {
			tempObject.bbWeight.inValid = true;
		}

		if (Number(tempObject.inputEnergy.value) > 0 && Number(tempObject.bbWeight.value) > 0) {
			tempObject.inputEnergy.inValid = false;
			tempObject.bbWeight.inValid = false;

			if (selectedEnergy === 'FPS') {
				speedConversion = roundTo(convertSpeed(inputEnergy, 'MPS'), 2) + ' MPS';
			}
			if (selectedEnergy === 'MPS') {
				speedConversion = roundTo(convertSpeed(inputEnergy, 'FPS'), 2) + ' FPS';
			}

			primaryOutput = buildOutput(inputEnergy, bbWeight);

			if (comparisonBbWeight) {
				comparisonOutput = buildOutput(inputEnergy, comparisonBbWeight);
			}
		}
	}
	function buildOutput(inputEnergy: number, weight: number) {
		const danger = `Danger, exceeds 6J.`;
		if (selectedEnergy === 'Joules') {
			return `${padZeros(weight, 3)}g: ${fpsOut(inputEnergy, weight)} FPS, ${mpsOut(
				inputEnergy,
				weight
			)} MPS`;
		} else {
			let jouleOutput = bbEnergyNormalizedJouleOutput(selectedEnergy, inputEnergy, weight);
			if (jouleOutput <= 6) {
				return `${padZeros(weight, 3)}g: ${padZeros(jouleOutput)} joules`;
			} else return `${padZeros(weight, 3)}g: ${danger}`;
		}
	}

	$: tempObject.inputEnergy.value = decimalizeString(tempObject.inputEnergy.value);
	$: tempObject.bbWeight.value = decimalizeString(tempObject.bbWeight.value);
	$: tempObject.compareWeight.value = decimalizeString(tempObject.compareWeight.value);
</script>

<div class="calcCard card w-80 bg-base-200 shadow-xl m-4 h-min">
	<CalcHeader title="Energy Converter" bind:open={infoOpen} />
	{#if infoOpen}
		<div
			class="px-4 pb-2 py-1 bg-gray-300 drop-shadow-md"
			transition:slide={{ delay: 10, duration: 150 }}
		>
			<p class="font-bold">Max values are:</p>
			<ul class="list-disc pl-6">
				<li>Joules: 6</li>
				<li>FPS: 750</li>
				<li>MPS: 320</li>
				<li>BB weight: 3 (grams)</li>
			</ul>
		</div>
	{/if}
	<div class="card-body p-6 pt-3">
		<form id="energy-calculator-input">
			<div class="join pb-1" style="display: flex;">
				{#each Object.entries(energyTypes) as [energyType]}
					<input
						class="join-item no-animation grow basis-0 p-0 justify-center text-lg font-bold !outline-none focus:btn-active btn btn-outline btn-primary"
						type="radio"
						name="energyType"
						id={energyType}
						aria-label={energyType}
						value={energyType}
						bind:group={selectedEnergy}
						on:change={() => {
							tempObject.inputEnergy.value = '';
							tempObject.inputEnergy.inValid = false;
						}}
					/>
				{/each}
			</div>
			<input
				class="input input-bordered w-full focus:ring-2 focus:ring-inset ring-slate-300 !outline-none transition-colors"
				class:bg-red-100={tempObject.inputEnergy.inValid &&
					Number(tempObject.inputEnergy.value) === 0}
				id="energy-inputEnergy"
				bind:value={tempObject.inputEnergy.value}
				placeholder={selectedEnergy}
				on:beforeinput={(event) =>
					validateNumber(event, tempObject.inputEnergy.value, energyTypes[selectedEnergy])}
				inputmode="decimal"
				autocomplete="off"
			/>
			<label class="label pt-2 pb-1 font-bold" for="energy-bbWeight">
				<span class="label-text">BB Weight</span>
			</label>
			<input
				class="input input-bordered w-full focus:ring-2 focus:ring-inset ring-slate-300 !outline-none transition-colors"
				class:bg-red-100={tempObject.bbWeight.inValid && Number(tempObject.bbWeight.value) === 0}
				id="energy-bbWeight"
				bind:value={tempObject.bbWeight.value}
				placeholder={`0.25`}
				on:beforeinput={(event) => validateNumber(event, tempObject.bbWeight.value, bbObject.bb)}
				inputmode="decimal"
				autocomplete="off"
			/>
			<label class="label pt-2 pb-1 font-bold" for="energy-bbWeightCompare">
				<span class="label-text">Comparison BB Weight</span>
			</label>
			<input
				class="input input-bordered w-full focus:ring-2 focus:ring-inset ring-slate-300 !outline-none transition-colors"
				id="energy-bbWeightCompare"
				bind:value={tempObject.compareWeight.value}
				placeholder={`0.25`}
				on:beforeinput={(event) =>
					validateNumber(event, tempObject.compareWeight.value, bbObject.bb)}
				inputmode="decimal"
				autocomplete="off"
			/>
			<button
				class="btn btn-warning w-full mt-4 text-lg font-bold"
				on:click={calculateEnergy}
				class:!btn-secondary={Number(tempObject.inputEnergy.value) > 0 &&
					Number(tempObject.bbWeight.value) > 0}
				>Energy
			</button>
		</form>
		<div class="label min-h-[1.75rem] items-start p-0 justify-center text-lg font-bold select-text">
			{speedConversion}
			<br />
			{primaryOutput}
			<br />
			{comparisonOutput}
		</div>
	</div>
</div>

<style lang="postcss">
	@import './calc.css';
</style>
