import { VoisonaClient } from '../src';

/**

 * Example: List Available Voices
 * This example demonstrates how to fetch and display the list of
 * installed voice libraries in your VoiSona Talk editor.
 */
async function main() {
  const client = new VoisonaClient({
    email: process.env.VOISONA_EMAIL,
    password: process.env.VOISONA_PASSWORD,
  });

  try {
    const voices = await client.listVoices();
    console.log(`Found ${voices.length} voice libraries:`);

    voices.forEach((voice) => {
      // Find English display name or fallback to the first available one
      const displayName =
        voice.display_names.find((n) => n.language === 'en_US')?.name ||
        voice.display_names[0]?.name;

      console.log(`- ${displayName}`);
      console.log(`  ID: ${voice.voice_name}`);
      console.log(`  Version: ${voice.voice_version}`);
      console.log(`  Languages: ${voice.languages.join(', ')}`);
      console.log('');
    });
  } catch (error) {
    console.error('Failed to list voices:', error);
  }
}

main();
