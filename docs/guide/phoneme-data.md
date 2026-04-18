# Phoneme Data & Timing

VoiSona Talk API provides precise timing data for each phoneme, which is useful for lip-sync or animated captions.

## Retrieving Phoneme Data

When you use `synthesizeAndWait` (or `getSpeechSynthesisRequest`), the result contains `phonemes` and `phoneme_durations`.

- **`phonemes`**: Array of phonetic labels (e.g., `s`, `i`, `l`, `k`, `o`).
- **`phoneme_durations`**: Array of durations in seconds for each corresponding phoneme.

## Example: Printing Timing Data

```typescript
const result = await client.synthesizeAndWait({
  text: 'こんにちは',
  language: 'ja_JP',
});

if (result.phonemes && result.phoneme_durations) {
  let currentTime = 0;
  console.log("Timing Data:");
  
  result.phonemes.forEach((p, i) => {
    const duration = result.phoneme_durations![i];
    console.log(`[${currentTime.toFixed(3)}s] Phoneme: ${p} (Duration: ${duration}s)`);
    currentTime += duration;
  });
}
```

::: info Full Phoneme List
The exact phoneme labels depend on the voice library and language used. `sil` usually represents silence or pauses.
:::
