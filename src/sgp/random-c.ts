namespace ja2 {

export let guiPreRandomIndex: UINT32 = 0;
export let guiPreRandomNums: UINT32[] /* [MAX_PREGENERATED_NUMS] */ = createArray(MAX_PREGENERATED_NUMS, 0);

export function InitializeRandom(): void {
  // Seed the random-number generator with current time so that
  // the numbers will be different every time we run.
  srand(time(null));
  // Pregenerate all of the random numbers.
  for (guiPreRandomIndex = 0; guiPreRandomIndex < MAX_PREGENERATED_NUMS; guiPreRandomIndex++) {
    guiPreRandomNums[guiPreRandomIndex] = rand();
  }
  guiPreRandomIndex = 0;
}

// Returns a pseudo-random integer between 0 and uiRange
export function Random(uiRange: UINT32): UINT32 {
// Always return 0, if no range given (it's not an error)

  if (uiRange == 0)
    return 0;
  return rand() * uiRange / RAND_MAX % uiRange;
}

export function Chance(uiChance: UINT32): boolean {
  return (Random(100) < uiChance);
}

export function PreRandom(uiRange: UINT32): UINT32 {
  let uiNum: UINT32;
  if (!uiRange)
    return 0;
  // Extract the current pregenerated number
  uiNum = guiPreRandomNums[guiPreRandomIndex] * uiRange / RAND_MAX % uiRange;
  // Replace the current pregenerated number with a new one.

  // This was removed in the name of optimization.  Uncomment if you hate recycling.
  // guiPreRandomNums[ guiPreRandomIndex ] = rand();

  // Go to the next index.
  guiPreRandomIndex++;
  if (guiPreRandomIndex >= MAX_PREGENERATED_NUMS)
    guiPreRandomIndex = 0;
  return uiNum;
}

export function PreChance(uiChance: UINT32): boolean {
  return (PreRandom(100) < uiChance);
}

}
