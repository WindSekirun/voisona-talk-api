# VoiSona Talk API TypeScript Library

A TypeScript-based library for the VoiSona Talk API (v0.9.0), providing a type-safe and intuitive way to integrate speech synthesis and text analysis.

## Features

- **Type Safety**: Full TypeScript support for all OpenAPI schemas.
- **Easy Synthesis**: `synthesizeAndWait` handles enqueuing and polling automatically.
- **Default WAV Output**: Synthesis defaults to `.wav` file output in the `output/` directory.
- **Emotion Control**: `getStyleWeights` helper for intuitive style/emotion management by name.
- **Bulk Processing**: `bulkSynthesize` for handling multiple requests with concurrency control.
- **Environment Support**: Easy configuration via `.env` files.

## Installation

```bash
pnpm add voisona-talk-api
```

## Quick Start

Before using the library, ensure your VoiSona Talk editor is configured correctly. See the [Connection Guide](docs/CONNECT_WITH_VOISONA.md) for step-by-step instructions.

```typescript
import { VoisonaClient } from 'voisona-talk-api';
import 'dotenv/config';

const client = new VoisonaClient({
  email: process.env.VOISONA_EMAIL,
  password: process.env.VOISONA_PASSWORD,
});

// Simple synthesis (defaults to .wav file output in output/ directory)
const result = await client.synthesizeAndWait({
  text: 'こんにちは。VoiSona Talkのテストです。',
  language: 'ja_JP',
});

console.log(`Audio saved at: ${result.output_file_path}`);
```

## Advanced Usage

### Emotion & Style Control

Manage voice styles (emotions) using names instead of index arrays.

```typescript
const voiceInfo = await client.getVoiceInformation('voice_name', '1.0.0');

const styleWeights = client.getStyleWeights(voiceInfo, {
  Happy: 0.8,
  Angry: 0.2,
});

await client.synthesizeAndWait({
  text: 'わーい！',
  language: 'ja_JP',
  global_parameters: { style_weights: styleWeights },
});
```

### Global Parameters

Fine-tune the output with various parameters.

```typescript
await client.synthesizeAndWait({
  text: 'もっと速く！',
  language: 'ja_JP',
  global_parameters: {
    speed: 1.5, // 0.2 to 5.0
    pitch: 100, // in cents (-600 to 600)
    intonation: 1.2, // expressive range
  },
});
```

### Bulk Synthesis

Process multiple messages efficiently.

```typescript
const results = await client.bulkSynthesize(
  [
    { text: 'Message one', language: 'ja_JP' },
    { text: 'Message two', language: 'ja_JP' },
  ],
  { concurrency: 2 },
);
```

### Custom Pronunciation

If a word is read incorrectly, you can specify the correct Katakana pronunciation:

```typescript
await client.synthesizeWithPronunciation(
  {
    language: 'ja_JP',
    text: '焦る必要はありません。',
  },
  {
    焦る: 'アセル', // Fix "Kogeru" to "Aseru"
  },
);
```

## Development

### Prerequisites

- Node.js v18+
- pnpm
- **VoiSona Talk Editor** (Running locally)

### Scripts

- `pnpm run build`: Build for CJS and ESM.
- `pnpm test`: Run unit tests.
- `pnpm run test:coverage`: Generate coverage report.

## License

MIT
