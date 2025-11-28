export const espnStyles = ['espn'];
export const rpiTVStyles = ['rpitv', 'football'];

/**
 * Convert millisecond-based time to a game clock string, i.e. the format mm:ss.S.
 * @param time Time in milliseconds to convert.
 */
export function millisToString(time: number) {
  if (Math.abs(time) < 60000) {
    const seconds = Math.floor((time % 60000) / 1000).toString(10).padStart(2, '0');
    const millis = Math.floor(Math.abs(time % 1000) / 100).toString(10);
    return `${seconds}.${millis}`;
  }
  else {
    const minutes = Math.floor(time / 60000).toString(10).padStart(2, '0');
    const seconds = Math.floor(Math.abs(time % 60000) / 1000).toString(10).padStart(2, '0');
    const millis = Math.floor(Math.abs(time % 1000) / 100).toString(10);
    return `${minutes}:${seconds}.${millis}`;
  }
}

export function formatNumber(num: number) {
  // Teens for some reason all end in "th" in English.
  if (num > 10 && num < 20) {
    return `${num}th`;
  }
  else {
    // For all other numbers, we need to figure out the suffix.
    const lastDigit = num % 10;
    switch (lastDigit) {
      case 1:
        return `${num}st`;
      case 2:
        return `${num}nd`;
      case 3:
        return `${num}rd`;
      default:
        return `${num}th`;
    }
  }
}

export function formatPeriod(period: number, periodCount: number, overtimeCount: number, shootoutsEnabled: boolean) {
  const isOvertime = period > periodCount;
  const isShootout = shootoutsEnabled && period > periodCount + overtimeCount;

  if (isShootout) {
    return 'Shootout';
  }

  if (isOvertime) {
    period = period - periodCount;
  }

  if (isOvertime) {
    return formatNumber(period) + ' Overtime';
  }
  else {
    return formatNumber(period) + ' Period';
  }
}

export function formatPeriodShorthand(period: number, periodCount: number, overtimeCount: number, shootoutsEnabled: boolean) {
  const isOvertime = period > periodCount;
  const isShootout = shootoutsEnabled && period > periodCount + overtimeCount;

  if (isShootout) {
    return 'S/O';
  }

  if (isOvertime) {
    period = period - periodCount;
  }

  if (isOvertime) {
    return period + 'OT';
  }
  else {
    return formatNumber(period);
  }
}

/**
 * Takes the color given and returns an accompanying color that will look pleasing
 * @param hex String to parse. Expected to be in the form #000000
 */
export function calcLinearGrad(hex: string): string {
  const hexNoPound = hex.replace('#', '');
  const colors = hexNoPound.match(/.{1,2}/g) as string[];
  if (!colors) return '';
  let r = parseInt(colors[0]!, 16);
  let g = parseInt(colors[1]!, 16);
  let b = parseInt(colors[2]!, 16);

  if (r >= 100 || g >= 100 || b >= 100) {
    r = Math.floor(r / 2);
    g = Math.floor(g / 2);
    b = Math.floor(b / 2);
  }
  else if (r <= 63 && g <= 63 && b <= 63) {
    r = Math.floor(2 * r / 3 + 84);
    g = Math.floor(2 * g / 3 + 84);
    b = Math.floor(2 * b / 3 + 84);
  }
  else {
    r = Math.ceil(r / 5);
    g = Math.ceil(g / 5);
    b = Math.ceil(b / 5);
  }

  return '#' + (r.toString(16).length == 1 ? ('0' + r.toString(16)) : r.toString(16)) + (g.toString(16).length == 1 ? ('0' + g.toString(16)) : g.toString(16))
    + (b.toString(16).length == 1 ? ('0' + b.toString(16)) : b.toString(16));
}
/**
 * Determines if the first color is lighter than the second color
 * @param hex1 String to parse. Expected to be in the form #000000
 * @param hex2 String to parse. Expected to be in the form #000000
 */
export function isLighter(color1: string, color2: string): boolean {
  const dec1 = parseInt(color1.replace('#', ''), 16);
  const dec2 = parseInt(color2.replace('#', ''), 16);

  return dec1 > dec2;
}

const hexToRgb = (hex: string) => {
  const result: any = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
};

export const isLightColor = (hexColor: string) => {
  const { r, g, b } = hexToRgb(hexColor);

  const colorArray = [r / 255, g / 255, b / 255].map((v) => {
    if (v <= 0.03928) {
      return v / 12.92;
    }

    return Math.pow((v + 0.055) / 1.055, 2.4);
  });

  const luminance = 0.2126 * colorArray[0]! + 0.7152 * colorArray[1]! + 0.0722 * colorArray[2]!;

  return luminance <= 0.179;
};
