import { VoisonaClient } from '../src';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * This example demonstrates how to use the 'memory' destination to get WAV data
 * directly as a buffer, and how to use 'phoneme_durations' for fine-grained control.
 *
 * Requirements:
 * 1. VoiSona Talk editor (v0.9.1 or later) must be running.
 * 2. API must be enabled in the editor settings.
 * 3. VOISONA_EMAIL and VOISONA_PASSWORD environment variables must be set.
 */

async function main() {
  const client = new VoisonaClient({});

  try {
    console.log('--- Memory Synthesis Example ---');

    // 1. Get information about the default audio device (New in 0.9.1)
    const device = await client.getDefaultAudioDevice();
    console.log(`Default Audio Device: ${device.device_name} (${device.device_type})`);

    // 2. Synthesize to buffer (convenience method using 'memory' destination)
    console.log('Synthesizing to memory...');
    const wavBuffer = await client.synthesizeToBuffer({
      language: 'ja_JP',
      text: 'メモリに出力しています。',
    });

    const outputPath = join(process.cwd(), 'output', 'memory_example.wav');
    writeFileSync(outputPath, Buffer.from(wavBuffer));
    console.log(`WAV data saved to: ${outputPath}`);
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

main();
