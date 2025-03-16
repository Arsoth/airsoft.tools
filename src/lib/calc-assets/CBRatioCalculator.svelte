<script lang="ts">
	import {
		calcVolume,
		decimalizeString,
		idealCylToBarrelRatio,
		padZeros,
		roundTo,
		solveFromVolume,
		validateNumber,
		volumeToBarrelRatio
	} from '$lib/util-lib';
	import {
		aegBarrelList,
		barrelDiameters,
		cylTypes,
		boltCyls,
		aegCyls,
		gearTeeth,
		gbbBarrelList
	} from '$lib/values';
	import { slide } from 'svelte/transition';
	import type { SpecsObject } from '$lib/types';
	import CalcHeader from '$lib/calc-assets/CalcHeader.svelte';
	import InfoHeader from '$lib/calc-assets/InfoHeader.svelte';

	let selectedCylType = 'AEG' as keyof typeof cylTypes;
	let selectedGearType: 16;

	interface cylTypeIface {
		'Select...': {};
	}

	let cylValue = {
		value: 'Select...' as keyof typeof aegCyls,
		inValid: false
	};
	let toothToCylDistance = { value: 6, inValid: false };
	let airBrake = { value: '', invalid: false };
	let barrelLength = { value: '', inValid: false };
	let bbWeight = { value: '', inValid: false };
	let shortStrokeBy = { value: '', inValid: false };
	let pistonSpacerThickness = { value: '', invalid: false };
	let cylData = { diameter: '', length: '' };
	let barrelDiameter = 6.03;
	let barrelVolume;
	let currentRatio: number;
	let aoeFixed = false;
	let currentRatioString = '';
	let bestRatioString = '';
	let recommendedBarrelString = '';
	let gunType = ['AEG', 'Bolt'];
	let advancedMode = false;
	const bbObject: SpecsObject = { maxValue: 3, maxLength: 5 };
	const barrelLengthObject: SpecsObject = { maxValue: 1000, maxLength: 5 };
	const volumeReductionObject: SpecsObject = { maxValue: 20, maxLength: 5 };
	const shortStrokeObject: SpecsObject = { maxValue: 20, maxLength: 5 };
	const cylIdObject: SpecsObject = { maxValue: 30, maxLength: 5 };
	const portLengthObject: SpecsObject = { maxValue: 100, maxLength: 5 };
	let infoOpen = false;
	let moreAdvanced = false;

	function calculateRatio(event: { preventDefault: () => void }) {
		event.preventDefault();
		currentRatioString = '';
		bestRatioString = '';
		recommendedBarrelString = '';

		if (Number(barrelLength.value) === 0 && Number(bbWeight.value) === 0) {
			barrelLength.inValid = true;
			bbWeight.inValid = true;
		}

		if (cylData.length === '') {
			cylValue.inValid = true;
		}

		if (
			(Number(barrelLength.value) > 0 || Number(bbWeight.value) > 0) &&
			Number(cylData.length) > 0
		) {
			barrelLength.inValid = false;
			cylValue.inValid = false;
			bbWeight.inValid = false;
			buildOutput();
		}
	}

	function getEffectiveStrokeLength(cylLength: number) {
		let strokeLength =
			(2 + selectedGearType - Number(shortStrokeBy.value)) * 3 +
			4.5 -
			(Number(toothToCylDistance.value) + (!airBrake.invalid ? Number(airBrake.value) - 2 : 0));

		let useableCylLength =
			cylLength - (Number(toothToCylDistance.value) + 1 - Number(pistonSpacerThickness.value));
		return strokeLength >= useableCylLength ? useableCylLength : strokeLength;
	}

	function buildOutput() {
		let cylVolume;
		let cylLength = Number(cylData.length);
		let cylDiameter = Number(cylData.diameter);
		if (selectedCylType === 'AEG') {
			cylVolume = calcVolume(cylDiameter, getEffectiveStrokeLength(cylLength));
		} else {
			cylVolume = calcVolume(cylDiameter, cylLength - Number(airBrake.value));
		}

		if (Number(barrelLength.value) > 0) {
			barrelVolume = calcVolume(barrelDiameter, Number(barrelLength.value));
			currentRatio = volumeToBarrelRatio(cylVolume, barrelVolume);
			currentRatioString = `Current: ${currentRatio}:1`;
		}

		if (Number(bbWeight.value) > 0) {
			let idealRatio = roundTo(idealCylToBarrelRatio(Number(bbWeight.value)), 3);
			if (currentRatio < idealRatio + 0.03 && currentRatio > idealRatio - 0.03) {
				currentRatioString = `Close enough!`;
				bestRatioString = ` Current: ${currentRatio}:1, Ideal: ${idealRatio}:1`;
			} else {
				let trueBarrel = roundTo(solveFromVolume(barrelDiameter, cylVolume / idealRatio), 0);
				bestRatioString = `Ideal: ${idealRatio}:1, ${trueBarrel}mm`;
				let closestBarrel;
				let closestRatio;
				if (selectedCylType === 'AEG') {
					closestBarrel = findNearest(trueBarrel, aegBarrelList);
				} else {
					closestBarrel = findNearest(trueBarrel, gbbBarrelList);
				}

				let closestBarrelVolume = calcVolume(barrelDiameter, closestBarrel);
				closestRatio = volumeToBarrelRatio(cylVolume, closestBarrelVolume);
				recommendedBarrelString = `Closest is ${closestBarrel}mm at ${closestRatio}:1`;
			}
		}
	}
	function findNearest(find: number, data: any[]) {
		var result = 0;
		for (let i = 0; i < data.length; ++i) {
			if (Math.abs(find - data[i].barrelLength) <= Math.abs(find - result)) {
				result = data[i].barrelLength;
			} else if (result === 0) {
				return data[i].barrelLength;
			} else {
				return result;
			}
		}
		return result;
	}
	// @ts-ignore
	$: cylData =
		selectedCylType === 'AEG'
			? aegCyls[cylValue.value]
			: boltCyls[cylValue.value as keyof cylTypeIface];
	$: aoeFixed === true ? (toothToCylDistance.value = 10.5) : (toothToCylDistance.value = 6);
	$: bbWeight.value = decimalizeString(bbWeight.value);
</script>

<div class="calcCard card w-80 bg-base-200 shadow-xl m-4 h-min">
	<CalcHeader title="Cylinder Ratio" bind:open={infoOpen} />
	{#if infoOpen}
		<div
			class="px-4 pb-2 py-1 bg-gray-300 drop-shadow-md"
			transition:slide={{ delay: 10, duration: 150 }}
		>
			<p class="mb-2">
				<b>Advanced</b> allows for shortstroking and Airbreaks as well as custom AOE, cylinder sizes,
				and porting.
			</p>
			<p>
				<b>Pickup to Cyl</b> is the distance between the furthest back point of the pickup tooth on the
				piston and the rear edge of the cylinder, which is the most consistent way to measure AOE.
			</p>
		</div>
	{/if}
	<div class="card-body p-6 pt-3">
		<form id="energy-calculator-input">
			<div class="join pb-1" style="display: flex;">
				{#each gunType as type}
					<input
						class="join-item no-animation grow basis-0 p-0 justify-center text-lg font-bold !outline-none focus:btn-active btn btn-outline btn-primary"
						type="radio"
						name="gunType"
						id={type}
						aria-label={type}
						value={type}
						bind:group={selectedCylType}
						on:click={() => {
							cylValue.value = 'Select...';
							cylValue.inValid = false;
						}}
					/>
				{/each}
				<select
					bind:value={cylValue.value}
					class="select select-primary join-item focus:outline-none focus:outline-[3px] focus:outline-primary focus:outline-offset-[-3px] pl-3 pr-3 w-[8.5rem]"
					class:bg-red-100={cylValue.inValid && cylValue.value === 'Select...'}
				>
					{#each Object.entries(cylTypes[selectedCylType]) as [name, data]}
						<option disabled={data.length === 0} value={name}>{`${name}`}</option>
					{/each}
				</select>
			</div>
			{#if selectedCylType === 'AEG'}
				<div class="join pb-1" style="display: flex;">
					<div>
						<label for="gearType" class="label pt-2 font-bold pb-1">
							<span class="label-text" style="width: 100%; text-align:center">Gear Type</span>
						</label>
						<select
							bind:value={selectedGearType}
							id="gearType"
							class="select select-primary join-item focus:outline-none focus:outline-[3px] focus:outline-primary focus:outline-offset-[-3px] pl-3 pr-3 w-[7rem] join-item"
							style="border-radius: 0.5rem 0rem 0rem 0.5rem;"
						>
							{#each Object.entries(gearTeeth) as [title, data]}
								<option value={data}>{title}</option>
							{/each}
						</select>
					</div>
					<span class="grow basis-0 p-0 justify-center">
						<label for="aoeFixed" class="label pt-2 font-bold pb-1">
							<span class="label-text" style="width: 100%; text-align:center">AOE Fixed</span>
						</label>
						<input
							class="hidden peer"
							type="checkbox"
							name="aoeFixed"
							id="aoeFixed"
							aria-label="on"
							bind:checked={aoeFixed}
						/>
						<label
							for="aoeFixed"
							class="btn btn-outline btn-primary join-item no-animation grow basis-0 p-0 justify-center text-lg font-bold peer-checked:btn-primary hover:btn-primary !outline-none peer"
							style="width: 100%"
						>
							<div>
								<svg
									class="justify-center"
									aria-hidden="true"
									height="40px"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 80 80"
									><defs
										><style>
											.cls-1 {
												fill: #000;
												stroke: #000;
												stroke-miterlimit: 10;
												stroke-width: 2px;
											}
										</style></defs
									><polygon
										class="cls-1"
										points="82.23 -2.75 8.98 -2.75 8.98 39.81 10.09 50.77 16.83 50.77 21.42 39.81 34.47 39.81 36.17 44.5 41.67 44.5 43.53 39.81 50.45 39.81 52.16 49.11 57.66 49.11 59.53 39.81 66.47 39.81 68.17 49.11 73.66 49.11 75.52 39.81 82.23 39.81 82.23 -2.75"
									/><path
										class="cls-1"
										d="M69.31,79.27h0l4.46-7.46-2-2.58L63.58,71.3h0a50.63,50.63,0,0,0-3.7-3.77h0L62.2,59l-2.64-1.91-7.62,4.56h0A48.53,48.53,0,0,0,46.87,59h0l-.55-8.6-3.08-1.07-5.9,6.53h0A48.66,48.66,0,0,0,32.18,55h0l-3.35-8.12H25.58L22.14,55h0A48.91,48.91,0,1,0,69.31,79.27Z"
									/></svg
								>
							</div>
						</label>
					</span>
					<span class="grow basis-0 p-0 justify-center">
						<label for="advanced" class="label pt-2 font-bold pb-1">
							<span class="label-text" style="width: 100%; text-align:center">Advanced</span>
						</label>
						<input
							class="hidden peer"
							type="checkbox"
							name="advanced"
							id="advanced"
							aria-label="on"
							bind:checked={advancedMode}
						/>
						<label
							for="advanced"
							class="btn btn-outline btn-primary join-item no-animation grow basis-0 p-0 justify-center text-lg font-bold peer-checked:btn-primary hover:btn-primary !outline-none peer"
							style="width: 100%"
						>
							<div class="block">
								<svg
									class="justify-center"
									fill="black"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 512 512"
									height="40px"
									><path
										d="M65.317,188.515l-29.328,44.379l19.202,19.145l43.375-28.765c7.306,4.562,15.271,8.549,23.734,10.997l10.566,52.604
							h27.072l10.308-51.331c8.616-1.989,16.792-5.279,24.337-9.438l44.379,29.356l19.145-19.191l-28.765-43.366
							c4.562-7.306,7.718-15.271,10.165-23.734l51.771-10.567v-27.071l-50.5-10.309c-1.988-8.616-4.867-16.792-9.017-24.327
							l29.568-44.38l-19.088-19.144l-43.317,28.764c-7.306-4.562-15.243-7.812-23.706-10.27L164.671,0H137.6l-10.309,50.595
							c-8.616,1.989-16.792,4.915-24.336,9.075l-44.38-29.539L39.431,49.228l28.764,43.318c-4.562,7.315-8.645,15.243-11.093,23.706
							L4.404,126.799v27.071l51.427,10.309C57.82,172.794,61.157,180.97,65.317,188.515z M148.769,101.889
							c22.539,0,40.812,18.273,40.812,40.812s-18.274,40.813-40.812,40.813c-22.539,0-40.813-18.274-40.813-40.813
							S126.23,101.889,148.769,101.889z"
									/>
									<path
										d="M263.834,202.361l9.228,51.188c-7.268,5.029-13.722,10.939-19.201,17.585l-52.106-10.996l-10.729,24.853l42.726,29.682
							c-1.549,8.482-1.979,17.203-1.128,25.972l-44.667,29.09l9.983,25.158l51.169-9.218c5.029,7.268,10.93,13.731,17.575,19.201
							l-11.007,52.106l24.854,10.729l29.682-42.725c8.482,1.549,17.184,1.95,25.962,1.109l29.08,44.647l25.159-9.983l-9.209-51.15
							c7.268-5.029,13.731-10.92,19.211-17.566l52.116,11.007l10.729-24.853l-42.725-29.673c1.549-8.481,1.979-17.193,1.138-25.972
							l44.666-29.089l-9.983-25.159l-51.169,9.218c-5.029-7.267-10.93-13.731-17.575-19.201l11.006-52.106l-24.853-10.729
							l-29.682,42.726c-8.482-1.55-17.203-1.999-25.981-1.157l-29.099-44.686L263.834,202.361z M312.086,293.674
							c20.952-8.319,44.677,1.932,52.996,22.883c8.319,20.952-1.932,44.677-22.884,52.996c-20.951,8.319-44.676-1.932-52.995-22.884
							C280.894,325.708,291.135,301.983,312.086,293.674z"
									/></svg
								>
							</div>
						</label>
					</span>
				</div>
				{#if advancedMode}
					<div class="afterContainer" style="width: 49%; float:left">
						<label for="shortStrokeBy" class="label pt-2 font-bold pb-1">
							<span class="label-text" style="width: 100%; text-align:center">Shortstroke by</span>
						</label>
						{#if shortStrokeBy.value}<span
								class="floatsAfter input text-slate-400 teethAfter"
								style="top: 55%">{shortStrokeBy.value}</span
							>
						{/if}
						<input
							class="input input-bordered w-full focus:ring-2 focus:ring-inset ring-slate-300 !outline-none transition-colors placeholder:text-slate-400 join-item"
							id="shortStrokeBy"
							placeholder={`0 Teeth`}
							bind:value={shortStrokeBy.value}
							on:beforeinput={(event) =>
								validateNumber(event, shortStrokeBy.value.toString(), shortStrokeObject)}
							inputmode="decimal"
							autocomplete="off"
						/>
					</div>

					<div class="afterContainer mb-2" style="width: 49%; float:right">
						<label class="label pt-2 font-bold pb-1" for="airbrake">
							<span class="label-text" style="width: 100%; text-align:center">Airbreak Length</span>
						</label>
						{#if airBrake.value}<span
								class="floatsAfter input text-slate-400 mmAfter"
								style="top: 55%">{airBrake.value}</span
							>
						{/if}
						<input
							class="input input-bordered w-full focus:ring-2 focus:ring-inset ring-slate-300 !outline-none transition-colors placeholder:text-slate-400"
							id="airBrake"
							placeholder={`0mm`}
							bind:value={airBrake.value}
							on:beforeinput={(event) =>
								validateNumber(event, airBrake.value.toString(), volumeReductionObject)}
							inputmode="decimal"
							autocomplete="off"
						/>
					</div>
					<InfoHeader title="Configure All Fields" bind:open={moreAdvanced} />
					{#if moreAdvanced}
						<div
							class="calcMoreOptionsBox px-4 pb-2 py-1 bg-gray-300 drop-shadow-md"
							transition:slide={{ delay: 10, duration: 150 }}
						>
							<div style="display:inline-block">
								<div class="afterContainer" style="width: 49%; float:left">
									<label for="toothToCylDistance" class="label pt-2 font-bold pb-1">
										<span class="label-text text-xs" style="width: 100%; text-align:center"
											>Pickup to Cyl</span
										>
									</label>
									{#if toothToCylDistance.value}<span
											class="floatsAfter input text-slate-400 mmAfter"
											style="top: 52%">{toothToCylDistance.value}</span
										>
									{/if}
									<input
										class="input input-bordered w-full focus:ring-2 focus:ring-inset ring-slate-300 !outline-none transition-colors placeholder:text-slate-400 join-item"
										id="toothToCylDistance"
										placeholder={`0mm`}
										bind:value={toothToCylDistance.value}
										on:beforeinput={(event) =>
											validateNumber(
												event,
												toothToCylDistance.value.toString(),
												volumeReductionObject
											)}
										inputmode="decimal"
										autocomplete="off"
									/>
								</div>
								<div class="afterContainer" style="width: 49%; float:right">
									<label for="pistonHeadSpacer" class="label pt-2 font-bold pb-1">
										<span class="label-text text-xs" style="width: 100%; text-align:center"
											>Piston Spacers</span
										>
									</label>
									{#if pistonSpacerThickness.value}<span
											class="floatsAfter input text-slate-400 mmAfter"
											style="top: 52%">{pistonSpacerThickness.value}</span
										>
									{/if}
									<input
										class="input input-bordered w-full focus:ring-2 focus:ring-inset ring-slate-300 !outline-none transition-colors placeholder:text-slate-400 join-item"
										id="pistonHeadSpacer"
										placeholder={`0mm`}
										bind:value={pistonSpacerThickness.value}
										on:beforeinput={(event) =>
											validateNumber(
												event,
												pistonSpacerThickness.value.toString(),
												volumeReductionObject
											)}
										inputmode="decimal"
										autocomplete="off"
									/>
								</div>
								<div class="afterContainer" style="width: 49%; float:right">
									<label for="shortStrokeBy" class="label pt-2 font-bold pb-1">
										<span class="label-text text-xs" style="width: 100%; text-align:center"
											>Cyl front to Ports</span
										>
									</label>
									{#if cylData.length}<span
											class="floatsAfter input text-slate-400 mmAfter"
											style="top: 52%">{cylData.length}</span
										>
									{/if}
									<input
										class="input input-bordered w-full focus:ring-2 focus:ring-inset ring-slate-300 !outline-none transition-colors placeholder:text-slate-400 join-item"
										id="shortStrokeBy"
										placeholder={`0mm`}
										bind:value={cylData.length}
										on:beforeinput={(event) =>
											validateNumber(event, cylData.length, portLengthObject)}
										inputmode="decimal"
										autocomplete="off"
									/>
								</div>

								<div class="afterContainer" style="width: 49%; float:left">
									<label class="label pt-2 font-bold pb-1" for="airbrake">
										<span class="label-text text-xs" style="width: 100%; text-align:center"
											>Cyl ID</span
										>
									</label>
									{#if cylData.diameter}<span
											class="floatsAfter input text-slate-400 mmAfter"
											style="top: 52%">{cylData.diameter}</span
										>
									{/if}
									<input
										class="input input-bordered w-full focus:ring-2 focus:ring-inset ring-slate-300 !outline-none transition-colors placeholder:text-slate-400"
										id="airBrake"
										placeholder={`0mm`}
										bind:value={cylData.diameter}
										on:beforeinput={(event) => validateNumber(event, cylData.diameter, cylIdObject)}
										inputmode="decimal"
										autocomplete="off"
									/>
								</div>
							</div>
						</div>
					{/if}
				{/if}
			{:else}
				<div class="afterContainer">
					<label class="label pt-2 font-bold pb-1" for="airbrake">
						<span class="label-text">Airbreak Length</span>
					</label>
					{#if airBrake.value}<span
							class="floatsAfter input text-slate-400 mmAfter"
							style="top: 55%">{airBrake.value}</span
						>
					{/if}
					<input
						class="input input-bordered w-full focus:ring-2 focus:ring-inset ring-slate-300 !outline-none transition-colors placeholder:text-slate-400"
						id="airBrake"
						placeholder={`0mm`}
						bind:value={airBrake.value}
						on:beforeinput={(event) => validateNumber(event, airBrake.value, volumeReductionObject)}
						inputmode="decimal"
						autocomplete="off"
					/>
				</div>
			{/if}
			<div class="join pb-1" style="display: flex;">
				<span style="width: 100%;">
					<div class="afterContainer" style="width: 100%">
						<label for="barrelLength" class="label pt-2 font-bold pb-1">
							<span class="label-text" style="width: 100%; text-align:center">Barrel length</span>
						</label>
						{#if barrelLength.value}<span
								class="floatsAfter input text-slate-400 mmAfter"
								style="top: 55%">{barrelLength.value}</span
							>
						{/if}
						<input
							class="input input-bordered w-full focus:ring-2 focus:ring-inset ring-slate-300 !outline-none transition-colors placeholder:text-slate-400"
							style="border-radius: 0.5rem 0rem 0rem 0.5rem;"
							class:bg-red-100={barrelLength.inValid && barrelLength.value === ''}
							id="barrelLength"
							bind:value={barrelLength.value}
							placeholder={'363mm'}
							on:beforeinput={(event) =>
								validateNumber(event, barrelLength.value, barrelLengthObject)}
							on:input={() => (bbWeight.inValid = false)}
							inputmode="decimal"
							autocomplete="off"
						/>
					</div>
				</span>
				<span>
					<div
						class="join-item input shrink-0 input-bordered text-lg mt-8 font-bold pl-1 pr-1 pt-2"
					>
						X
					</div>
				</span>
				<span>
					<label for="barrelDiameter" class="label pt-2 font-bold pb-1">
						<span class="label-text" style="width: 100%; text-align:center">Barrel Diameter</span>
					</label>
					<select
						bind:value={barrelDiameter}
						id="barrelDiameter"
						class="select select-primary join-item focus:outline-none focus:outline-[3px] focus:outline-primary focus:outline-offset-[-3px] pl-3 pr-3 w-[8rem]"
					>
						{#each barrelDiameters as diameter}
							<option value={diameter}>{`${padZeros(diameter)}mm`}</option>
						{/each}
					</select>
				</span>
			</div>
			<label class="label pt-2 font-bold pb-1" for="energy-bbWeight">
				<span class="label-text">BB Weight</span>
			</label>
			<input
				class="input input-bordered w-full focus:ring-2 focus:ring-inset ring-slate-300 !outline-none transition-colors"
				class:bg-red-100={bbWeight.inValid && bbWeight.value === ''}
				id="energy-bbWeight"
				bind:value={bbWeight.value}
				placeholder={`0.25`}
				on:beforeinput={(event) => validateNumber(event, bbWeight.value, bbObject)}
				on:input={() => (barrelLength.inValid = false)}
				inputmode="decimal"
				autocomplete="off"
			/>
			<button
				class="btn !btn-warning w-full mt-4 text-lg font-bold"
				on:click={calculateRatio}
				class:btn-secondary={(Number(barrelLength.value) > 0 || Number(bbWeight.value) > 0) &&
					Number(cylData.length) > 0}
				>Ratio
			</button>
		</form>
		<div class="label min-h-[1.75rem] items-start p-0 justify-center text-lg font-bold select-text">
			{currentRatioString}
			{#if currentRatioString}<br />{/if}
			{bestRatioString}
			<br />
			{recommendedBarrelString}
		</div>
	</div>
</div>

<style lang="postcss">
	@reference './calc.css';
	.calcMoreOptionsBox {
		border-radius: 0rem 0rem 0.5rem 0.5rem;
	}
	.floatsAfter {
		visibility: hidden;
		position: absolute;
		z-index: 2;
	}
	.mmAfter::after {
		content: 'mm';
		visibility: visible;
	}
	.teethAfter::after {
		content: ' Teeth';
		visibility: visible;
	}
	.afterContainer {
		display: inline-block;
		position: relative;
		width: 100%;
	}
</style>
