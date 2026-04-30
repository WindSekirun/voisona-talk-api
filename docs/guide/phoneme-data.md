# Phoneme Data & Timing

VoiSona Talk API provides precise timing data for each phoneme, which is useful for lip-sync or animated captions.

## Retrieving Phoneme Data

When you use `synthesizeAndWait` (or `getSpeechSynthesisRequest`), the result contains `phonemes` and `phoneme_durations`.

- **`phonemes`**: Array of phonetic labels (e.g., `s`, `i`, `l`, `k`, `o`).
- **`phoneme_durations`**: Array of durations in seconds for each corresponding phoneme.

## Controlling Phoneme Durations (New in v0.9.1)

You can specify custom durations for individual phonemes using the `phoneme_durations` parameter in your synthesis request. This is useful for emphasizing specific sounds or creating unique speech patterns.

### How it works:
1. Provide an array of numbers corresponding to the phoneme sequence.
2. Use `-1` for automatic duration (let the synthesizer decide).
3. Specify a positive value (in seconds) to force a specific duration.

### Example: Making a sound longer

```typescript
// 1. Analyze text first to get the correct phoneme alignment
const analysis = await client.analyzeAndWait({
  language: 'ja_JP',
  text: 'こんにちは',
});

// 2. Define durations (e.g., make the last 'a' sound 0.8 seconds long)
// Sequence: [sil, k, o, N, n, i, ch, i, w, a, sil]
const customDurations = [-1, -1, -1, -1, -1, -1, -1, -1, -1, 0.8, -1];

const result = await client.synthesizeAndWait({
  language: 'ja_JP',
  analyzed_text: analysis.analyzed_text,
  phoneme_durations: customDurations,
});
```

::: warning Advanced Use
Phoneme sequences can change based on text normalization or library updates. For reproducible results, always use `analyzed_text` (TSML) when providing custom durations.
:::

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
