import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VoisonaClient } from '../src/client.js';

describe('VoisonaClient Helpers', () => {
  const config = {
    email: 'test@example.com',
    password: 'password123'
  };

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    vi.useFakeTimers();
  });

  it('should synthesize and wait for success', async () => {
    const client = new VoisonaClient(config);
    const uuid = 'test-uuid';

    // Mock initial request
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ uuid }),
    } as Response);

    // Mock polling status - queued then succeeded
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ uuid, state: 'queued', progress_percentage: 0 }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ uuid, state: 'succeeded', progress_percentage: 100, output_file_path: 'C:/out.wav' }),
      } as Response);

    const promise = client.synthesizeAndWait({ language: 'ja_JP', text: 'Hello' }, { pollInterval: 100 });
    
    // Fast-forward through polls
    await vi.advanceTimersByTimeAsync(100);
    await vi.advanceTimersByTimeAsync(100);

    const result = await promise;
    expect(result.state).toBe('succeeded');
    expect(result.output_file_path).toBe('C:/out.wav');
    expect(fetch).toHaveBeenCalledTimes(3); // 1 request + 2 polls
  });

  it('should throw error if synthesis fails', async () => {
    const client = new VoisonaClient(config);
    const uuid = 'fail-uuid';

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ uuid }),
    } as Response);

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ uuid, state: 'failed' }),
    } as Response);

    const promise = client.synthesizeAndWait({ language: 'ja_JP', text: 'Fail' }, { pollInterval: 100 });
    
    await vi.advanceTimersByTimeAsync(100);

    try {
      await promise;
      expect.fail('Should have thrown an error');
    } catch (error: any) {
      expect(error.message).toBe(`Speech synthesis failed for UUID: ${uuid}`);
    }
  });

  it('should bulk synthesize in chunks', async () => {
    const client = new VoisonaClient(config);
    
    // Mock requests and polls for two items
    // First item
    vi.mocked(fetch)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ uuid: 'uuid1' }) } as Response) // request
      .mockResolvedValueOnce({ ok: true, json: async () => ({ uuid: 'uuid1', state: 'succeeded' }) } as Response); // poll
    
    // Second item
    vi.mocked(fetch)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ uuid: 'uuid2' }) } as Response) // request
      .mockResolvedValueOnce({ ok: true, json: async () => ({ uuid: 'uuid2', state: 'succeeded' }) } as Response); // poll

    const promise = client.bulkSynthesize([
      { language: 'ja_JP', text: 'One' },
      { language: 'ja_JP', text: 'Two' }
    ], { concurrency: 1, pollInterval: 100 });

    await vi.advanceTimersByTimeAsync(100);
    await vi.advanceTimersByTimeAsync(100);

    const results = await promise;
    expect(results).toHaveLength(2);
    expect(results[0].uuid).toBe('uuid1');
    expect(results[1].uuid).toBe('uuid2');
  });
});
