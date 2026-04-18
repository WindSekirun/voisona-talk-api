import { VoisonaClient } from '../src/index';
import 'dotenv/config';

async function main() {
  // Ensure VOISONA_EMAIL and VOISONA_PASSWORD are set in your .env file
  const client = new VoisonaClient({
    email: process.env.VOISONA_EMAIL,
    password: process.env.VOISONA_PASSWORD,
  });

  try {
    console.log('Listing available voices...');
    const voices = await client.listVoices();
    console.log(`Found ${voices.length} voices.`);

    if (voices.length > 0) {
      // Find a Japanese voice if available, otherwise use the first one
      const voice = voices.find((v) => v.languages.includes('ja_JP')) || voices[0];
      if (!voice) return;

      console.log(`Using voice: ${voice.display_names[0]?.name} (${voice.voice_name})`);

      console.log('Synthesizing Japanese text...');
      // By default, synthesizeAndWait now outputs to a .wav file in the current directory
      const result = await client.synthesizeAndWait({
        text: 'こんにちは。これはVoiSona Talk ライブラリのテストです。',
        language: 'ja_JP',
        voice_name: voice.voice_name,
        voice_version: voice.voice_version,
      });

      console.log('Synthesis successful!');
      console.log(`Output path: ${result.output_file_path}`);
    } else {
      console.log(
        'No voices found. Please make sure VoiSona Talk is running and you have voice libraries installed.',
      );
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();
