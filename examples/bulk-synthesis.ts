import { VoisonaClient } from '../src/index';
import 'dotenv/config';

/**
 * Example: Bulk Synthesis
 * This example demonstrates how to process multiple synthesis requests
 * with concurrency control to avoid overloading the system.
 */
async function main() {
  const client = new VoisonaClient({
    email: process.env.VOISONA_EMAIL,
    password: process.env.VOISONA_PASSWORD,
  });

  const items = [
    { text: 'Message one', language: 'ja_JP' },
    { text: 'Message two', language: 'ja_JP' },
    { text: 'Message three', language: 'ja_JP' },
    { text: 'Message four', language: 'ja_JP' },
  ];

  try {
    console.log(`Starting bulk synthesis for ${items.length} items...`);

    // Process 2 items at a time with a 1-second polling interval
    const results = await client.bulkSynthesize(items, {
      concurrency: 2,
      pollInterval: 1000,
    });

    results.forEach((res, index) => {
      console.log(`[${index}] Success! Audio saved at: ${res.output_file_path}`);
    });
  } catch (error) {
    console.error('Bulk synthesis failed:', error);
  }
}

main();
