UINT32 guiPreRandomIndex = 0;
UINT32 guiPreRandomNums[MAX_PREGENERATED_NUMS];

void InitializeRandom() {
  // Seed the random-number generator with current time so that
  // the numbers will be different every time we run.
  srand((unsigned)time(NULL));
  // Pregenerate all of the random numbers.
  for (guiPreRandomIndex = 0; guiPreRandomIndex < MAX_PREGENERATED_NUMS; guiPreRandomIndex++) {
    guiPreRandomNums[guiPreRandomIndex] = rand();
  }
  guiPreRandomIndex = 0;
}

// Returns a pseudo-random integer between 0 and uiRange
UINT32 Random(UINT32 uiRange) {
// Always return 0, if no range given (it's not an error)

  if (uiRange == 0)
    return 0;
  return rand() * uiRange / RAND_MAX % uiRange;
}

BOOLEAN Chance(UINT32 uiChance) {
  return (BOOLEAN)(Random(100) < uiChance);
}

UINT32 PreRandom(UINT32 uiRange) {
  UINT32 uiNum;
  if (!uiRange)
    return 0;
  // Extract the current pregenerated number
  uiNum = guiPreRandomNums[guiPreRandomIndex] * uiRange / RAND_MAX % uiRange;
  // Replace the current pregenerated number with a new one.

  // This was removed in the name of optimization.  Uncomment if you hate recycling.
  // guiPreRandomNums[ guiPreRandomIndex ] = rand();

  // Go to the next index.
  guiPreRandomIndex++;
  if (guiPreRandomIndex >= (UINT32)MAX_PREGENERATED_NUMS)
    guiPreRandomIndex = 0;
  return uiNum;
}

BOOLEAN PreChance(UINT32 uiChance) {
  return (BOOLEAN)(PreRandom(100) < uiChance);
}
