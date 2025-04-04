export const listToMap = arrayToObject;
export const arrayToMap = arrayToObject;

// Converts an array of values to an object.
// The keygen allows you to determine which value is the key.
// e.g. you can select an id, or a name or some other unique value.
export function arrayToObject<T>(
  input: T[],
  keygen: (input: T) => string | number,
): Record<string | number, T> {
  const output: Record<string | number, T> = {};

  for (const i of input) {
    output[keygen(i)] = i;
  }

  return output;
}

export const listToMappedObject = arrayToMappedObject;
export function arrayToMappedObject<T, U>(
  input: T[],
  keygen: (input: T) => string | number,
  map: (input: T) => U,
): Record<string | number, U> {
  const output: Record<string | number, U> = {};

  for (const i of input) {
    output[keygen(i)] = map(i);
  }

  return output;
}

export const listToGroup = arrayToObjectOfArrays;
export function arrayToObjectOfArrays<T>(
  input: T[],
  keygen: (input: T) => string | number,
): Record<string, T[]> {
  const output: Record<string, T[]> = {};

  for (const i of input) {
    const val = output[keygen(i)] ?? [];
    val.push(i);
    output[keygen(i)] = val;
  }

  return output;
}
