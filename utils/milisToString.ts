export function millisToString(time: number) {
	if(Math.abs(time) < 60000) {
		const seconds = Math.floor((time % 60000) / 1000).toString(10).padStart(2, '0');
		const millis = Math.floor(Math.abs(time % 1000) / 100).toString(10);
		return `${seconds}.${millis}`;
	} else {
		const minutes = Math.floor(time / 60000).toString(10).padStart(2, '0');
		const seconds = Math.floor(Math.abs(time % 60000) / 1000).toString(10).padStart(2, '0');
		const millis = Math.floor(Math.abs(time % 1000) / 100).toString(10);
		return `${minutes}:${seconds}.${millis}`;
	}
}