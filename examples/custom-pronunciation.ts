import { VoisonaClient } from '../src/index';
import 'dotenv/config';

async function main() {
  const client = new VoisonaClient({
    email: process.env.VOISONA_EMAIL,
    password: process.env.VOISONA_PASSWORD,
  });

  try {
    const text =
      'まもなく列車が到着します。焦る必要はありませんから、安全線の内側でお待ちください。';

    console.log('Synthesizing with custom pronunciation...');
    console.log(`Original Text: ${text}`);

    // "焦る" might be misread as "Kogeru" (to burn/scorch)
    // We force it to "Aseru" (to be in a hurry)
    const result = await client.synthesizeWithPronunciation(
      {
        language: 'ja_JP',
        text: text,
      },
      {
        焦る: 'アセル',
      },
    );

    console.log(`Success! Audio saved to: ${result.output_file_path}`);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();
