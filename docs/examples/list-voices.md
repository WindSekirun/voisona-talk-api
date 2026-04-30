# List Available Voices

Before synthesizing speech, you might want to see which voice libraries are installed and available.

```typescript
import { VoisonaClient } from 'voisona-talk-api';

const client = new VoisonaClient({
  email: process.env.VOISONA_EMAIL,
  password: process.env.VOISONA_PASSWORD,
});

async function main() {
  try {
    const voices = await client.listVoices();
    console.log(`Found ${voices.length} voices:`);

    voices.forEach((voice) => {
      const displayName = voice.display_names.find(n => n.language === 'ja_JP')?.name 
        || voice.display_names[0]?.name;
        
      console.log(`- ${displayName} (ID: ${voice.voice_name}, Version: ${voice.voice_version})`);
      console.log(`  Supported Languages: ${voice.languages.join(', ')}`);
    });
  } catch (error) {
    console.error("Failed to list voices:", error);
  }
}

main();
```
