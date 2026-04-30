# Bulk Synthesis

Process multiple speech synthesis requests efficiently with concurrency control.

```typescript
import { VoisonaClient } from 'voisona-talk-api';

const client = new VoisonaClient({
  email: process.env.VOISONA_EMAIL,
  password: process.env.VOISONA_PASSWORD,
});

async function main() {
  const items = [
    { text: 'Message one', language: 'ja_JP' },
    { text: 'Message two', language: 'ja_JP' },
    { text: 'Message three', language: 'ja_JP' },
    { text: 'Message four', language: 'ja_JP' },
  ];

  try {
    console.log(`Starting bulk synthesis for ${items.length} items...`);
    
    // Process 2 items at a time
    const results = await client.bulkSynthesize(items, {
      concurrency: 2,
      pollInterval: 1000,
    });

    results.forEach((res, index) => {
      console.log(`[${index}] Success: ${res.output_file_path}`);
    });
  } catch (error) {
    console.error("Bulk synthesis failed:", error);
  }
}

main();
```
