import { VoisonaClient } from '../src';
import { join } from 'node:path';

/**
 * This example demonstrates how to use the 'phoneme_durations' parameter
 * to control the duration of individual phonemes in a sentence.
 *
 * Requirements:
 * 1. VoiSona Talk editor (v0.9.1 or later) must be running.
 * 2. API must be enabled in the editor settings.
 * 3. VOISONA_EMAIL and VOISONA_PASSWORD environment variables must be set.
 */

async function main() {
  const client = new VoisonaClient({});

  try {
    console.log('--- Phoneme Duration Control Example ---');

    // Scenario 1: Slow Motion / Emphasis
    // We make a specific word much slower to emphasize it.
    console.log('\nScenario 1: Emphasizing "ありがとう" (Slow Motion)');
    const analysis1 = await client.analyzeAndWait({
      language: 'ja_JP',
      text: '本当に、ありがとうございます。',
    });

    // "ありがとうございます" (a r i g a t o o g o z a i m a s u)
    // We want to lengthen the "ありがとう" part.
    // We can use -1 for parts we don't want to touch.
    // For simplicity, let's assume we want to lengthen everything after the pause.
    const slowDurations = analysis1.analyzed_text!.includes('アリガトー')
      ? Array(20).fill(0.25) // Force 0.25s for each phoneme for a very slow effect
      : Array(20).fill(-1);

    await client.synthesizeAndWait({
      language: 'ja_JP',
      analyzed_text: analysis1.analyzed_text,
      phoneme_durations: slowDurations,
      output_file_path: join(process.cwd(), 'output', 'phoneme_slow.wav'),
    });
    console.log('Saved to: output/phoneme_slow.wav');

    // Scenario 2: Staccato / Robotic Effect
    // We make every phoneme very short and uniform.
    console.log('\nScenario 2: Robotic Staccato');
    const text2 = 'システム、起動。プロセスを開始します。';
    const analysis2 = await client.analyzeAndWait({ language: 'ja_JP', text: text2 });

    // Set all phonemes to a fixed short duration (e.g., 0.05s)
    const staccatoDurations = Array(50).fill(0.06);

    await client.synthesizeAndWait({
      language: 'ja_JP',
      analyzed_text: analysis2.analyzed_text,
      phoneme_durations: staccatoDurations,
      output_file_path: join(process.cwd(), 'output', 'phoneme_robotic.wav'),
    });
    console.log('Saved to: output/phoneme_robotic.wav');

    // Scenario 3: Surprised / Lengthened Ending
    // Lengthening the final vowel to sound more emotional or surprised.
    console.log('\nScenario 3: Surprised Ending ("ええー！？")');
    const analysis3 = await client.analyzeAndWait({
      language: 'ja_JP',
      text: 'ええ、そうなんですか！？',
    });

    // We make the last few phonemes before the final silence longer.
    // -1, -1, ..., 0.5, 0.5, -1
    const surprisedDurations = [-1, -1, -1, -1, -1, -1, -1, 0.4, 0.4, 0.6, -1];

    await client.synthesizeAndWait({
      language: 'ja_JP',
      analyzed_text: analysis3.analyzed_text,
      phoneme_durations: surprisedDurations,
      output_file_path: join(process.cwd(), 'output', 'phoneme_surprised.wav'),
    });
    console.log('Saved to: output/phoneme_surprised.wav');
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

main();
