import { VoisonaClient } from '../src/index';

/**
 * Example: Advanced Style Control
 * This example demonstrates how to use global parameters (speed, pitch, etc.)
 * and how to control voice styles (emotions) using intuitive names.
 */
async function main() {
  const client = new VoisonaClient({
    email: process.env.VOISONA_EMAIL,
    password: process.env.VOISONA_PASSWORD,
  });

  try {
    // 1. Get voice and its detailed style information
    // We need this to map style names (like 'Happy') to their internal indices.
    const voices = await client.listVoices();
    const targetVoice = voices.find((v) => v.languages.includes('ja_JP')) || voices[0];

    if (!targetVoice) {
      console.error('No voice libraries found.');
      return;
    }

    const voiceInfo = await client.getVoiceInformation(
      targetVoice.voice_name,
      targetVoice.voice_version,
    );

    console.log(`Using voice: ${voiceInfo.display_names[0]?.name}`);
    console.log(`Available styles: ${voiceInfo.style_names.join(', ')}`);

    // 2. Map styles by name using the helper
    // This creates the numerical array required by the API.
    const styleWeights = client.getStyleWeights(voiceInfo, {
      Happy: 1.0, // Set Happy to 100%
      // All other styles will remain at their default values (usually 0.0)
    });

    console.log('Synthesizing with custom parameters...');
    const result = await client.synthesizeAndWait({
      text: 'わーい！今日はとてもいい天気ですね！',
      language: 'ja_JP',
      voice_name: voiceInfo.voice_name,
      global_parameters: {
        style_weights: styleWeights,
        pitch: 200, // Higher pitch (+200 cents)
        speed: 1.2, // Faster (1.2x)
        intonation: 1.5, // More expressive contour
        volume: 2.0, // Louder (+2dB)
      },
    });

    console.log('Synthesis successful!');
    console.log(`Audio saved at: ${result.output_file_path}`);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();
