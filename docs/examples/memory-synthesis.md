# Memory Synthesis
Synthesize speech directly into an ArrayBuffer without creating temporary files.

```typescript
import { VoisonaClient } from 'voisona-talk-api';
import { writeFileSync } from 'node:fs';

const client = new VoisonaClient({
  email: process.env.VOISONA_EMAIL,
  password: process.env.VOISONA_PASSWORD,
});

async function run() {
  // 1. Synthesize directly to a buffer
  const buffer = await client.synthesizeToBuffer({
    text: 'メモリに出力しています。',
    language: 'ja_JP'
  });

  // 2. Use the buffer (example: save to file manually)
  writeFileSync('output_buffer.wav', Buffer.from(buffer));
  console.log('WAV data saved from memory buffer.');
}

run();
```

::: info New in v0.9.1
This feature requires VoiSona Talk v0.9.1 or later.
:::
