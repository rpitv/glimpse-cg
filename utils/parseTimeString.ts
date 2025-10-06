export function parseTimeString(time: string): number {
	let minutesStr = '0';
	let secondsAndMillisStr = '0.0';
	if(time.includes(':')) {
		[minutesStr, secondsAndMillisStr = '0.0'] = time.split(':', 2);
	} else {
		secondsAndMillisStr = time;
	}

	let secondsStr = '0';
	let millisStr = '0';
	if(secondsAndMillisStr.includes('.')) {
		[secondsStr, millisStr = '0'] = secondsAndMillisStr.split('.', 2);
	} else {
		secondsStr = secondsAndMillisStr;
	}

	const minutes = parseInt(minutesStr);
	const seconds = parseInt(secondsStr);
	const millis = parseInt(millisStr);

	if(isNaN(minutes) || isNaN(seconds) || isNaN(millis)) {
		throw new Error(`Input ${time} is not a valid clock input. Input should be in the form "mm:ss.S".`);
	}

	if(minutes < 0 || seconds < 0 || millis < 0) {
		throw new Error(`Input time cannot be negative or contain negative numbers.`);
	}

	return minutes * 60000 + seconds * 1000 + millis * (1000 / (10 ** (millisStr.length)))
}