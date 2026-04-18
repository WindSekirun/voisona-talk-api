import { VoisonaClient } from '../src/index.js';
import 'dotenv/config';

async function main() {
  const client = new VoisonaClient({
    email: process.env.VOISONA_EMAIL,
    password: process.env.VOISONA_PASSWORD,
  });

  try {
    // 1. Get voice and its detailed style information
    const voices = await client.listVoices();
    const voiceBase = voices.find(v => v.languages.includes('ja_JP')) || voices[0];
    if (!voiceBase) {
      console.log('No voices found.');
      return;
    }

    const voiceInfo = await client.getVoiceInformation(voiceBase.voice_name, voiceBase.voice_version);
    console.log(`Using voice: ${voiceInfo.display_names[0]?.name}`);
    console.log(`Available styles: ${voiceInfo.style_names.join(', ')}`);

    // 2. Synthesize with specific styles (Emotions) and Global Parameters
    // Let's say we want "Happy" at 80% and "Angry" at 20% (names depend on the voice library)
    const styleWeights = client.getStyleWeights(voiceInfo, {
      'Happy': 0.8,
      'Angry': 0.2,
      // If style names differ (e.g., "Sad", "Normal"), use those keys
    });

    console.log('\n--- 1. Advanced Synthesis ---');
    console.log('Synthesizing with Happy style and high pitch...');
    const result = await client.synthesizeAndWait({
      text: 'わーい！今日はとてもいい天気ですね！',
      language: 'ja_JP',
      voice_name: voiceInfo.voice_name,
      voice_version: voiceInfo.voice_version,
      global_parameters: {
        style_weights: styleWeights,
        pitch: 200,      // Higher pitch (+200 cents)
        speed: 1.2,      // Faster (1.2x)
        intonation: 1.5, // More expressive
        volume: 2.0,     // Louder (+2dB)
      }
    });
    console.log(`Saved to: ${result.output_file_path}`);

    // 3. Bulk Processing Example
    console.log('\n--- 2. Bulk Synthesis ---');
    const messages = [
      'こんにちは、一つ目のメッセージです。',
      'こんばんは、二つ目のメッセージです。',
      'さようなら、三つ目のメッセージです。',
    ];

    console.log(`Processing ${messages.length} messages in bulk...`);
    const bulkResults = await client.bulkSynthesize(
      messages.map(text => ({
        text,
        language: 'ja_JP',
        voice_name: voiceInfo.voice_name,
      })),
      { concurrency: 2 }
    );

    bulkResults.forEach((res, i) => {
      console.log(`[${i + 1}] UUID: ${res.uuid} -> ${res.output_file_path}`);
    });

  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();
