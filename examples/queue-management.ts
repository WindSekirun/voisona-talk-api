import { VoisonaClient } from '../src/index';

async function main() {
  const client = new VoisonaClient({
    email: process.env.VOISONA_EMAIL,
    password: process.env.VOISONA_PASSWORD,
  });

  try {
    // 1. Check current queue status
    console.log('--- Current Queue Status ---');
    const status = await client.getQueueStatus();
    console.log('Synthesis Queue:', status.synthesis);
    console.log('Analysis Queue:', status.analysis);

    // 2. Clear only succeeded requests
    console.log('\nClearing only succeeded synthesis requests...');
    await client.clearSpeechSynthesisRequests(['succeeded']);

    // 3. Clear all completed (succeeded and failed) requests
    console.log('Clearing all completed requests (synthesis & analysis)...');
    await client.clearAllCompletedRequests();

    // 4. Verify status after cleanup
    const newStatus = await client.getQueueStatus();
    console.log('\n--- Queue Status After Cleanup ---');
    console.log('Synthesis Queue:', newStatus.synthesis);
    console.log('Analysis Queue:', newStatus.analysis);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();
