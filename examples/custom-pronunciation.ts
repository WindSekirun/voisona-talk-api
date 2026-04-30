import { VoisonaClient } from '../src';

/**

 * Example: Custom Pronunciation
 * This example shows how to fix misreadings by overriding the
 * internal TSML (Text Synthesis Markup Language) pronunciation.
 */
async function main() {
  const client = new VoisonaClient({
    email: process.env.VOISONA_EMAIL,
    password: process.env.VOISONA_PASSWORD,
  });

  try {
    console.log('Synthesizing with custom pronunciation...');

    // The word "焦る" (to hurry) might be read incorrectly.
    // We provide a map to ensure it's always read as "アセル".
    const result = await client.synthesizeWithPronunciation(
      {
        text: 'そんなに焦る必要はありません。',
        language: 'ja_JP',
      },
      {
        // Format: { "Word in Text": "Target Katakana" }
        焦る: 'アセル',
      },
    );

    console.log('Synthesis successful!');
    console.log(`Audio saved at: ${result.output_file_path}`);
  } catch (error) {
    console.error('Error during synthesis:', error);
  }
}

main();
