<script lang="ts">
	import {
		bbEnergyNormalizedJouleOutput,
		decimalizeString,
		fpsOut,
		mpsOut,
		padZeros,
		validateNumber
	} from '$lib/util-lib';
	import type { SpecsObject } from '$lib/types';
	import { springList } from '$lib/values';
	import { slide } from 'svelte/transition';
	import CalcHeader from '$lib/calc-assets/CalcHeader.svelte';

	const springTypes = {
		M: { bbWeight: '0.20' },
		SP: { bbWeight: '0.25' },
		'%': { bbWeight: '0.20' }
	};

	const bbObject: SpecsObject = { maxValue: 3, maxLength: 5 };
	let springStrength = 120;
	let selectedSpringType = 'M';
	let bbWeight = { value: '', inValid: false };
	let conversion = '';
	let infoOpen = false;

	function calculateEnergy(event: { preventDefault: () => void }) {
		event.preventDefault();
		conversion = '';
		let tempSpring: number;
		if (selectedSpringType === '%') {
			tempSpring = mpsOut((springStrength / 100) * 0.81, 0.2);
		} else {
			tempSpring = springStrength;
		}

		if (Number(bbWeight.value) === 0) {
			bbWeight.inValid = true;
		}
		if (Number(bbWeight.value) > 0) {
			bbWeight.inValid = false;
			buildOutput(tempSpring, Number(bbWeight.value));
		}
	}
	function buildOutput(springRating: number, weight: number) {
		let jouleOutput = bbEnergyNormalizedJouleOutput(
			'MPS',
			springRating,
			Number(springTypes[selectedSpringType].bbWeight)
		);
		conversion = `${fpsOut(jouleOutput, weight)} FPS, ${mpsOut(
			jouleOutput,
			weight
		)} MPS, ${padZeros(jouleOutput)}j`;
	}

	$: bbWeight.value = decimalizeString(bbWeight.value);
</script>

<div class="calcCard">
	<CalcHeader title="Spring to Energy" bind:open={infoOpen} />
	{#if infoOpen}
		<div class="calcInfoBox" transition:slide={{ delay: 10, duration: 150 }}>
			<p class="font-bold">Data is approximate and is based on manufacturer reported values.</p>
			<p>BB weight max value: 3 (grams)</p>
		</div>
	{/if}
	<div class="calcBody">
		<form id="energy-calculator-input">
			<div class="join pb-1" style="display: flex;">
				{#each Object.entries(springTypes) as [springType]}
					<input
						class="calcJoinButton btn btn-outline btn-primary"
						type="radio"
						name="energyType"
						id={springType}
						aria-label={springType}
						value={springType}
						bind:group={selectedSpringType}
					/>
				{/each}
				<select bind:value={springStrength} class="calcBaseDropdownSelector w-32">
					{#each springList as spring}
						<option value={spring}>{spring}</option>
					{/each}
				</select>
			</div>
			<label class="label pt-2 pb-1 font-bold" for="energy-bbWeight">
				<span class="label-text">BB Weight</span>
			</label>
			<input
				class="calcBaseInputTextBox"
				class:emptyInput={bbWeight.inValid && bbWeight.value === ''}
				id="energy-bbWeight"
				bind:value={bbWeight.value}
				placeholder={`${springTypes[selectedSpringType].bbWeight}`}
				on:beforeinput={(event) => validateNumber(event, bbWeight.value, bbObject)}
				inputmode="decimal"
				autocomplete="off"
			/>
			<!--			<span class="input" />-->
			<button
				class="calcButton"
				on:click={calculateEnergy}
				class:validButton={Number(bbWeight.value) > 0}
				>Velocity
			</button>
		</form>
		<div class="calcOutput">
			{conversion}
		</div>
	</div>
</div>

<style lang="postcss">
	@import './calc.mcss';
</style>
