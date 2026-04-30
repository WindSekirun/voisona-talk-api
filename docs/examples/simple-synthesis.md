# Simple Synthesis
The most basic way to generate speech from text.

```typescript
import { VoisonaClient } from 'voisona-talk-api';

const client = new VoisonaClient({
  email: process.env.VOISONA_EMAIL,
  password: process.env.VOISONA_PASSWORD,
});

const result = await client.synthesizeAndWait({
  text: 'こんにちは。VoiSona Talkのテストです.',
  language: 'ja_JP',
});

console.log(`Audio saved at: ${result.output_file_path}`);
```
