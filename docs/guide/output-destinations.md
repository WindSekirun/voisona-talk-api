# Output Destinations

VoiSona Talk supports three types of output destinations for synthesized speech.

## 1. File Output (Default)

The synthesized speech is saved as a WAV file on your local filesystem.

```typescript
const result = await client.synthesizeAndWait({
  text: 'ファイルに出力します。',
  language: 'ja_JP',
  destination: 'file',
  output_file_path: 'C:\\path\\to\\output.wav',
  can_overwrite_file: true
});
```

- **Pros**: Easy to use for simple scripts.
- **Cons**: Requires filesystem access; overhead of file I/O.

## 2. Memory Output (New in v0.9.1)

Synthesize speech directly into memory and retrieve it as an `ArrayBuffer`. This is ideal for web servers or applications that need to process the audio data in-memory.

The library provides a convenience method `synthesizeToBuffer` for this purpose.

```typescript
// Synthesize to memory and get ArrayBuffer directly
const buffer = await client.synthesizeToBuffer({
  text: 'メモリに出力します。',
  language: 'ja_JP'
});

// Use the buffer (e.g., send as HTTP response)
// ...
```

- **Pros**: No temporary files; faster for real-time applications.
- **Cons**: Consumes system memory for large batches.

## 3. Audio Device

Output the speech directly through the default audio device configured in VoiSona Talk.

```typescript
await client.requestSpeechSynthesis({
  text: 'スピーカーから出力します。',
  language: 'ja_JP',
  destination: 'audio_device'
});
```

### Retrieving Audio Device Info

You can check which audio device is currently selected as the default:

```typescript
const device = await client.getDefaultAudioDevice();
console.log(`Using device: ${device.device_name} (${device.device_type})`);
```

---

## Which one to choose?

| Use Case | Recommended Destination |
| :--- | :--- |
| Simple scripts / Saving for later | `file` |
| Web APIs / Real-time playback | `memory` |
| Direct interactive output | `audio_device` |
