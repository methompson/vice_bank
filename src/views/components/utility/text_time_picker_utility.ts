export function convert24HrsTo12Hrs(hr: number): number {
  if (hr === 0) {
    return 12;
  } else if (hr > 12) {
    return hr - 12;
  }

  return hr;
}

/**
 * Converts a 12-hour format hour to a 24-hour format hour.
 * @param hr Current hour in 12-hour format (1-12).
 * @param am True if the time is in AM, false if in PM.
 * @returns The equivalent hour in 24-hour format (0-23).
 */
export function convert12Hrsto24Hrs(hr: number, am: boolean): number {
  if (am) {
    return hr === 12 ? 0 : hr;
  }

  return (hr % 12) + 12;
}
