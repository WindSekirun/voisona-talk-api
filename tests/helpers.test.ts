import { resolve } from 'node:path';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VoisonaClient } from '../src/client';
import { VoiceInformation } from '../src/types';

describe('VoisonaClient Helpers', () => {
  const config = {
    email: 'test@example.com',
    password: 'password123',
  };

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    vi.useFakeTimers();
  });

  // --- Synthesis Helpers ---

  it('should synthesize and wait for success', async () => {
    const client = new VoisonaClient(config);
    const uuid = 'test-uuid';

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ uuid }),
    } as Response);

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ uuid, state: 'queued', progress_percentage: 0 }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          uuid,
          state: 'succeeded',
          progress_percentage: 100,
          output_file_path: 'output.wav',
        }),
      } as Response);

    const promise = client.synthesizeAndWait(
      { language: 'ja_JP', text: 'Hello' },
      { pollInterval: 100 },
    );
    await vi.advanceTimersByTimeAsync(100);
    await vi.advanceTimersByTimeAsync(100);

    const result = await promise;
    expect(result.state).toBe('succeeded');
    expect(fetch).toHaveBeenCalledTimes(3);
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
      json: async () => ({ uuid, state: 'failed', meta: { warnings: [{ detail: 'Some error' }] } }),
    } as Response);

    const promise = client.synthesizeAndWait(
      { language: 'ja_JP', text: 'Fail' },
      { pollInterval: 100 },
    );
    const expectation = expect(promise).rejects.toThrow(
      `Speech synthesis failed for UUID: ${uuid}. Details: [{"detail":"Some error"}]`,
    );

    await vi.advanceTimersByTimeAsync(100);
    await expectation;
  });

  // --- Analysis Helpers ---

  it('should analyze and wait for success', async () => {
    const client = new VoisonaClient(config);
    const uuid = 'ana-uuid';

    vi.mocked(fetch).mockResolvedValueOnce({ ok: true, json: async () => ({ uuid }) } as Response);
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ uuid, state: 'succeeded', analyzed_text: 'tsml' }),
    } as Response);

    const promise = client.analyzeAndWait(
      { language: 'ja_JP', text: 'Hello' },
      { pollInterval: 100 },
    );
    await vi.advanceTimersByTimeAsync(100);

    const result = await promise;
    expect(result.analyzed_text).toBe('tsml');
  });

  it('should throw error if analysis fails', async () => {
    const client = new VoisonaClient(config);
    const uuid = 'ana-fail-uuid';

    vi.mocked(fetch).mockResolvedValueOnce({ ok: true, json: async () => ({ uuid }) } as Response);
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ uuid, state: 'failed' }),
    } as Response);

    const promise = client.analyzeAndWait(
      { language: 'ja_JP', text: 'Fail' },
      { pollInterval: 100 },
    );
    const expectation = expect(promise).rejects.toThrow(`Text analysis failed for UUID: ${uuid}`);

    await vi.advanceTimersByTimeAsync(100);
    await expectation;
  });

  it('should timeout if synthesis takes too long', async () => {
    const client = new VoisonaClient(config);
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ uuid: 'timeout-uuid', state: 'queued' }),
    } as Response);

    const promise = client.synthesizeAndWait(
      { language: 'ja_JP', text: 'Slow' },
      { pollInterval: 100, timeout: 500 },
    );
    const expectation = expect(promise).rejects.toThrow(
      'Speech synthesis timed out for UUID: timeout-uuid',
    );

    await vi.advanceTimersByTimeAsync(1000);
    await expectation;
  });

  it('should timeout if analysis takes too long', async () => {
    const client = new VoisonaClient(config);
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ uuid: 'timeout-ana-uuid', state: 'queued' }),
    } as Response);

    const promise = client.analyzeAndWait(
      { language: 'ja_JP', text: 'Slow' },
      { pollInterval: 100, timeout: 500 },
    );
    const expectation = expect(promise).rejects.toThrow(
      'Text analysis timed out for UUID: timeout-ana-uuid',
    );

    await vi.advanceTimersByTimeAsync(1000);
    await expectation;
  });

  it('should generate a default output path if none provided', async () => {
    const client = new VoisonaClient(config);
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ uuid: 'default-path', state: 'succeeded' }),
    } as Response);

    await client.synthesizeAndWait({
      language: 'ja_JP',
      text: 'Default Path Test',
    });

    const calls = vi.mocked(fetch).mock.calls;
    const postCallBody = JSON.parse(calls[0]![1]!.body as string);

    // Check if it's in an 'output' folder and ends with .wav
    expect(postCallBody.output_file_path).toMatch(/output[\\/]output_.*\.wav$/);
    expect(postCallBody.destination).toBe('file');
  });

  it('should use custom output file path if provided', async () => {
    const client = new VoisonaClient(config);
    const customPath = resolve('my-custom-output.wav');

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ uuid: 'custom-path', state: 'succeeded' }),
    } as Response);

    await client.synthesizeAndWait({
      language: 'ja_JP',
      text: 'Custom',
      output_file_path: customPath,
    });

    const calls = vi.mocked(fetch).mock.calls;
    const postCallBody = JSON.parse(calls[0]![1]!.body as string);

    expect(postCallBody.output_file_path).toBe(customPath);
  });

  // --- Bulk & Utils ---

  it('should bulk synthesize in chunks', async () => {
    const client = new VoisonaClient(config);

    // For 3 items:
    // Chunk 1 (2 items): 2 requests + 2 polls
    // Chunk 2 (1 item): 1 request + 1 poll
    vi.mocked(fetch)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ uuid: 'uuid1' }) } as Response)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ uuid: 'uuid2' }) } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ uuid: 'uuid1', state: 'succeeded' }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ uuid: 'uuid2', state: 'succeeded' }),
      } as Response)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ uuid: 'uuid3' }) } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ uuid: 'uuid3', state: 'succeeded' }),
      } as Response);

    const promise = client.bulkSynthesize(
      [
        { language: 'ja_JP', text: 'One' },
        { language: 'ja_JP', text: 'Two' },
        { language: 'ja_JP', text: 'Three' },
      ],
      { concurrency: 2, pollInterval: 100 },
    );

    await vi.advanceTimersByTimeAsync(100);
    await vi.advanceTimersByTimeAsync(100);

    const results = await promise;
    expect(results).toHaveLength(3);
  });

  it('should map style weights correctly', () => {
    const client = new VoisonaClient(config);
    const mockVoice: Partial<VoiceInformation> = {
      style_names: ['Normal', 'Happy', 'Sad'],
      default_style_weights: [1.0, 0.0, 0.0],
    };

    const weights = client.getStyleWeights(mockVoice as VoiceInformation, {
      Happy: 0.5,
      Sad: 0.2,
      Unknown: 1.0, // Should be ignored
    });

    expect(weights).toEqual([1.0, 0.5, 0.2]);
  });
});
