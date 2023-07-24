import type { SpecsObject } from '$lib/types';

const atm = 14.6959; //psia

//Atmospheric pressure at any given elevation and temperature
export function atmAtElevation(altitudeMeters: number, rankineDegrees: number) {
	return roundTo(
		Math.exp((-9.81 * 0.0289644 * altitudeMeters) / (8.31432 * (rankineDegrees / 1.8))) * atm,
		4
	);
}

//Rounds a number to the decimalAmount input, eg 1.7899, decimal 2 would be 1.79
export function roundTo(input: number, decimalAmount: number) {
	const decimals = Number.parseInt(String('1').padEnd(decimalAmount + 1, '0'));
	return Math.round((input + Number.EPSILON) * decimals) / decimals;
}

export function padZeros(input: number, length = 4) {
	// adds some prettiness to the strings
	if (Number.isInteger(input)) {
		const temp = String(input) + '.';
		return temp.padEnd(length, '0');
	}
	// makes decimal number eg. 0.2 > 0.20
	return String(input).padEnd(length, '0');
}

//Just returns a ratio as a string
export function volumeToBarrelRatio(cylVol: number, barrelVol: number) {
	return roundTo(cylVol / barrelVol, 3);
}

export function calcVolume(diameter: number, length: number) {
	return Math.PI * (diameter / 2) ** 2 * length;
}

export function solveFromVolume(diameter: number, volume: number) {
	return (4 * volume) / (Math.PI * diameter ** 2);
}

function fmod(a: number, b: number) {
	return a % b;
}

//it takes a BB weight and does *math magic* to output what volume ratio you need
export function idealCylToBarrelRatio(bbWeight: number) {
	return (
		5.28813 *
			(-0.0122026 -
				(6.01464 -
					Math.tan(1.46038 / (-0.0757997 * bbWeight)) *
						Math.cos(Math.round(0.0826453 + bbWeight))) *
					fmod(bbWeight, 0.000604915) +
				bbWeight) -
		fmod(bbWeight, 0.021126) / -0.594958 -
		Math.log10(bbWeight - 0.13223)
	);
}

export function convertAltitude(altitudeUnits: string, altitudeInput: number) {
	if (altitudeUnits === 'meters') {
		return altitudeInput;
	} else {
		return altitudeInput / 3.2808;
	}
}

export function convertToRankine(tempUnit: string, degreeInput: number) {
	switch (tempUnit) {
		case 'C':
			return degreeInput * 1.8 + 491.67;
		case 'F':
			return degreeInput + 459.67;
		case 'K':
			return degreeInput * 1.8;
		case 'R':
			return degreeInput;
		default:
			console.log('Rankine conversion failure, defaulting to 75° F');
			return 534.67;
	}
}

export function convertSpeed(inputSpeed: number, convertTo: string) {
	switch (convertTo) {
		case 'FPS':
			return inputSpeed * 3.28084;
		case 'MPS':
			return inputSpeed * 0.3048;
		default:
			console.log('Unknown speed, conversion failed.');
			return inputSpeed;
	}
}

let timer: number;
export function validateNumber(event: any, currentValue: string, specsObject: SpecsObject) {
	let invalid = false;
	const validDecimalNumber = /^\.?[0-9]+(\.[0-9]*)?$/;
	const errorStyle = ['border-red-500', 'border-2', 'transition-[border-color]'];
	const selectionStartIndex = event.target.selectionStart;
	const selectionEndIndex = event.target.selectionEnd;
	const preSelectString = currentValue.substring(0, selectionStartIndex);
	const postSelectString = currentValue.substring(selectionEndIndex);
	const selectionLength = selectionEndIndex - selectionStartIndex;

	if (event.data != null) {
		const isNotDecimalNumber = !validDecimalNumber.test(0 + currentValue + event.data);
		const exceedsMaxValue =
			Number(preSelectString + event.data + postSelectString) > specsObject.maxValue;
		const insertDataTooLong =
			currentValue.length - selectionLength + event.data.length > specsObject.maxLength;

		if (isNotDecimalNumber || insertDataTooLong || exceedsMaxValue) {
			event.preventDefault();
			invalid = true;
		}
	}

	if (invalid) {
		event.target.classList.add(...errorStyle);
		clearTimeout(timer);
		timer = setTimeout(() => {
			event.target.classList.remove(...errorStyle);
		}, 200);
	}
}

export function decimalizeString(value: string) {
	if (value.charAt(0) === '.') {
		return '0' + value;
	} else {
		return value;
	}
}

export function calcSpeed(inputEnergy: number, weight: number) {
	return Math.sqrt(inputEnergy / keMath(weight));
}

export function mpsOut(inputEnergy: number, weight: number) {
	return roundTo(calcSpeed(inputEnergy, weight), 2);
}

export function fpsOut(inputEnergy: number, weight: number) {
	return roundTo(calcSpeed(inputEnergy, weight) * 3.28084, 2);
}

export function keMath(weight: number) {
	return 0.5 * ((1 / 1000) * weight);
}

export function bbEnergyNormalizedJouleOutput(
	selectedEnergy: string,
	inputEnergy: number,
	weight: number
) {
	let mps: number;
	if (selectedEnergy === 'MPS') {
		mps = inputEnergy;
	} else {
		mps = convertSpeed(inputEnergy, 'MPS');
	}
	return roundTo(keMath(weight) * mps ** 2, 2);
}
