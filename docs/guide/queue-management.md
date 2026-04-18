# Queue Management

VoiSona Talk has a limited request queue. If the memory is full, the API returns a `409 Conflict` error. This guide shows how to manage the queue effectively.

## Handling 409 Conflict

When you see "Not enough memory for a new request", you have two options:

1.  **Force Enqueue**: Set `force_enqueue: true` to automatically remove the oldest completed requests to make room.
2.  **Manual Cleanup**: Use the client's cleanup methods to clear finished requests.

## Example: Automatic & Manual Cleanup

```typescript
import { VoisonaClient } from 'voisona-talk-api';

const client = new VoisonaClient({ /* config */ });

async function main() {
  // Option 1: Force enqueue (Recommended for high-frequency tasks)
  await client.synthesizeAndWait({
    text: 'Important message',
    language: 'ja_JP',
    force_enqueue: true // Automatically clears space if needed
  });

  // Option 2: Monitor and manual cleanup
  const status = await client.getQueueStatus();
  console.log(`Synthesis Queue: ${status.synthesis.queued} queued, ${status.synthesis.succeeded} finished`);

  if (status.synthesis.succeeded > 10) {
    console.log("Clearing completed requests...");
    await client.clearAllCompletedRequests();
  }
}
```

::: tip Default Behavior
By default, `synthesizeAndWait` sets `autoCleanup: true`, which deletes the request from the server immediately after a successful synthesis, keeping your queue lean.
:::
