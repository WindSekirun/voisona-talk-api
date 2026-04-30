import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VoisonaClient } from '../src/client';

describe('VoisonaClient Core API', () => {
  const config = {
    email: 'test@example.com',
    password: 'password123',
    baseUrl: 'http://localhost:32766/api/talk/v1',
  };

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('should throw error if email or password missing', () => {
    // Temporarily clear env vars to test error
    const oldEmail = process.env.VOISONA_EMAIL;
    const oldPassword = process.env.VOISONA_PASSWORD;
    delete process.env.VOISONA_EMAIL;
    delete process.env.VOISONA_PASSWORD;

    expect(() => new VoisonaClient({})).toThrow('VoiSona Talk API requires email and password');

    // Restore
    process.env.VOISONA_EMAIL = oldEmail;
    process.env.VOISONA_PASSWORD = oldPassword;
  });

  it('should handle generic HTTP errors (no JSON body)', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: () => {
        throw new Error('Not JSON');
      },
    } as unknown as Response);

    const client = new VoisonaClient(config);
    await expect(client.listVoices()).rejects.toThrow('HTTP Error: 500 Internal Server Error');
  });

  it('should listSpeechSynthesisRequests', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ items: [{ uuid: '1' }] }),
    } as Response);

    const client = new VoisonaClient(config);
    const result = await client.listSpeechSynthesisRequests();
    expect(result).toHaveLength(1);
    expect(result[0]!.uuid).toBe('1');
  });

  it('should deleteSpeechSynthesisRequest', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 204,
    } as Response);

    const client = new VoisonaClient(config);
    await client.deleteSpeechSynthesisRequest('uuid');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/speech-syntheses/uuid'),
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  // --- Text Analysis Tests ---

  it('should listTextAnalysisRequests', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ items: [{ uuid: 'a' }] }),
    } as Response);

    const client = new VoisonaClient(config);
    const result = await client.listTextAnalysisRequests();
    expect(result).toHaveLength(1);
  });

  it('should requestTextAnalysis', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ uuid: 'new-uuid' }),
    } as Response);

    const client = new VoisonaClient(config);
    const result = await client.requestTextAnalysis({ language: 'ja_JP', text: 'test' });
    expect(result.uuid).toBe('new-uuid');
  });

  it('should validate text length for analysis', async () => {
    const client = new VoisonaClient(config);
    const longText = 'a'.repeat(501);
    await expect(client.requestTextAnalysis({ language: 'ja_JP', text: longText })).rejects.toThrow(
      'exceeds maximum length',
    );
  });

  it('should validate empty text for analysis', async () => {
    const client = new VoisonaClient(config);
    await expect(client.requestTextAnalysis({ language: 'ja_JP', text: '' })).rejects.toThrow(
      'required and cannot be empty',
    );
  });

  it('should validate synthesis params (missing text and analyzed_text)', async () => {
    const client = new VoisonaClient(config);
    await expect(client.requestSpeechSynthesis({ language: 'ja_JP' })).rejects.toThrow(
      'Either "text" or "analyzed_text" must be provided',
    );
  });

  it('should validate synthesis params (text too long)', async () => {
    const client = new VoisonaClient(config);
    const longText = 'a'.repeat(501);
    await expect(
      client.requestSpeechSynthesis({ language: 'ja_JP', text: longText }),
    ).rejects.toThrow('exceeds maximum length');
  });

  it('should validate range of global parameters', async () => {
    const client = new VoisonaClient(config);
    await expect(
      client.requestSpeechSynthesis({
        language: 'ja_JP',
        text: 'test',
        global_parameters: { speed: 10 },
      }),
    ).rejects.toThrow('Global parameter "speed" must be between 0.2 and 5');

    await expect(
      client.requestSpeechSynthesis({
        language: 'ja_JP',
        text: 'test',
        global_parameters: { pitch: -1000 },
      }),
    ).rejects.toThrow('Global parameter "pitch" must be between -600 and 600');
  });

  it('should validate analyzed_text length', async () => {
    const client = new VoisonaClient(config);
    const longAnalyzedText = 'a'.repeat(50001);
    await expect(
      client.requestSpeechSynthesis({ language: 'ja_JP', analyzed_text: longAnalyzedText }),
    ).rejects.toThrow('exceeds maximum length of 50000');
  });

  it('should bulkSynthesize multiple requests', async () => {
    vi.mocked(fetch)
      // Call 1
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ uuid: 'u1' }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ uuid: 'u1', state: 'succeeded' }),
      } as Response)
      .mockResolvedValueOnce({ ok: true, status: 204 } as Response)
      // Call 2
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ uuid: 'u2' }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ uuid: 'u2', state: 'succeeded' }),
      } as Response)
      .mockResolvedValueOnce({ ok: true, status: 204 } as Response);

    const client = new VoisonaClient(config);
    const results = await client.bulkSynthesize(
      [
        { language: 'ja_JP', text: 'one' },
        { language: 'ja_JP', text: 'two' },
      ],
      { concurrency: 1, pollInterval: 1 },
    );

    expect(results).toHaveLength(2);
    expect(results[0]?.uuid).toBe('u1');
    expect(results[1]?.uuid).toBe('u2');
  });

  it('should timeout in synthesizeAndWait', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ uuid: 'timeout-uuid' }),
      } as Response)
      .mockResolvedValue({
        ok: true,
        json: async () => ({ uuid: 'timeout-uuid', state: 'running' }),
      } as Response);

    const client = new VoisonaClient(config);
    await expect(
      client.synthesizeAndWait(
        { language: 'ja_JP', text: 'test' },
        { timeout: 10, pollInterval: 1 },
      ),
    ).rejects.toThrow('timed out');
  });

  it('should getTextAnalysisRequest', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ uuid: 'a', state: 'succeeded', analyzed_text: 'tsml' }),
    } as Response);

    const client = new VoisonaClient(config);
    const result = await client.getTextAnalysisRequest('a');
    expect(result.analyzed_text).toBe('tsml');
  });

  it('should call onProgress in synthesizeAndWait', async () => {
    vi.mocked(fetch)
      // requestSpeechSynthesis
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ uuid: 'uuid-123' }),
      } as Response)
      // getSpeechSynthesisRequest (running)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ uuid: 'uuid-123', state: 'running', progress_percentage: 50 }),
      } as Response)
      // getSpeechSynthesisRequest (succeeded)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ uuid: 'uuid-123', state: 'succeeded', progress_percentage: 100 }),
      } as Response)
      // deleteSpeechSynthesisRequest
      .mockResolvedValueOnce({ ok: true, status: 204 } as Response);

    const client = new VoisonaClient(config);
    const onProgress = vi.fn();

    await client.synthesizeAndWait(
      { language: 'ja_JP', text: 'test' },
      { onProgress, pollInterval: 1 },
    );

    expect(onProgress).toHaveBeenCalledWith(50);
    expect(onProgress).toHaveBeenCalledWith(100);
  });

  it('should log warnings if present in meta', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        items: [],
        meta: { warnings: [{ message: 'Something is not right' }] },
      }),
    } as Response);

    const client = new VoisonaClient(config);
    await client.listVoices();

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Something is not right'));
    consoleSpy.mockRestore();
  });

  it('should deleteTextAnalysisRequest', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'Content-Length': '0' }),
    } as Response);

    const client = new VoisonaClient(config);
    await client.deleteTextAnalysisRequest('a');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/text-analyses/a'),
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  // --- Info Tests ---

  it('should getVoiceInformation', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ voice_name: 'v', style_names: ['Happy'] }),
    } as Response);

    const client = new VoisonaClient(config);
    const result = await client.getVoiceInformation('v', '1.0');
    expect(result.voice_name).toBe('v');
  });

  it('should listLanguages', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ items: [{ language: 'ja_JP' }, { language: 'en_US' }] }),
    } as Response);

    const client = new VoisonaClient(config);
    const result = await client.listLanguages();
    expect(result).toEqual(['ja_JP', 'en_US']);
  });

  // --- Queue Management Tests ---

  it('should getQueueStatus', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: [{ state: 'queued' }, { state: 'succeeded' }] }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: [{ state: 'running' }] }),
      } as Response);

    const client = new VoisonaClient(config);
    const status = await client.getQueueStatus();

    expect(status.synthesis.queued).toBe(1);
    expect(status.synthesis.succeeded).toBe(1);
    expect(status.analysis.running).toBe(1);
    expect(status.analysis.queued).toBe(0);
  });

  it('should clear all completed requests', async () => {
    vi.mocked(fetch)
      // list synthesis
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [
            { uuid: 's1', state: 'succeeded' },
            { uuid: 's2', state: 'running' },
          ],
        }),
      } as Response)
      // list analysis
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: [{ uuid: 'a1', state: 'failed' }] }),
      } as Response)
      // delete s1
      .mockResolvedValueOnce({ ok: true, status: 204 } as Response)
      // delete a1
      .mockResolvedValueOnce({ ok: true, status: 204 } as Response);

    const client = new VoisonaClient(config);
    await client.clearAllCompletedRequests();

    const deleteCalls = vi.mocked(fetch).mock.calls.filter((c) => c[1]?.method === 'DELETE');
    expect(deleteCalls).toHaveLength(2);
    expect(deleteCalls[0]![0]).toContain('/speech-syntheses/s1');
    expect(deleteCalls[1]![0]).toContain('/text-analyses/a1');
  });

  it('should handle API errors with data', async () => {
    const mockError = { status: 400, title: 'Error', detail: 'Reason' };
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => mockError,
    } as Response);

    const client = new VoisonaClient(config);
    await expect(client.listVoices()).rejects.toThrow('API Error [400]: Error - Reason');
  });

  it('should throw clear error when service is unreachable (ECONNREFUSED)', async () => {
    vi.mocked(fetch).mockRejectedValue({
      cause: { code: 'ECONNREFUSED' },
    });

    const client = new VoisonaClient(config);
    await expect(client.listVoices()).rejects.toThrow(
      'Please ensure VoiSona Talk is running and the port is correct.',
    );
  });

  it('should return true for isServiceRunning when reachable', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
    } as Response);

    const client = new VoisonaClient(config);
    const result = await client.isServiceRunning();
    expect(result).toBe(true);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/languages'), expect.any(Object));
  });

  it('should return false for isServiceRunning when unreachable', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('fetch failed'));

    const client = new VoisonaClient(config);
    const result = await client.isServiceRunning();
    expect(result).toBe(false);
  });

  // --- 0.9.1 Features Tests ---

  it('should get default audio device info', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ device_name: 'Speakers', device_type: 'Windows Audio' }),
    } as Response);

    const client = new VoisonaClient(config);
    const device = await client.getDefaultAudioDevice();
    expect(device.device_name).toBe('Speakers');
    expect(device.device_type).toBe('Windows Audio');
  });

  it('should get synthesized WAV data', async () => {
    const mockBuffer = new ArrayBuffer(10);
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      headers: new Headers({ 'Content-Type': 'audio/wav' }),
      arrayBuffer: async () => mockBuffer,
    } as Response);

    const client = new VoisonaClient(config);
    const result = await client.getSynthesizedWav('uuid');
    expect(result).toBeInstanceOf(ArrayBuffer);
    expect(result.byteLength).toBe(10);
  });

  it('should validate phoneme_durations range', async () => {
    const client = new VoisonaClient(config);
    await expect(
      client.requestSpeechSynthesis({
        language: 'ja_JP',
        text: 'test',
        phoneme_durations: [11],
      }),
    ).rejects.toThrow('Phoneme duration must be between -1 and 10');

    await expect(
      client.requestSpeechSynthesis({
        language: 'ja_JP',
        text: 'test',
        phoneme_durations: [-2],
      }),
    ).rejects.toThrow('Phoneme duration must be between -1 and 10');
  });

  it('should handle synthesizeToBuffer', async () => {
    const mockBuffer = new ArrayBuffer(5);
    vi.mocked(fetch)
      // requestSpeechSynthesis
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ uuid: 'mem-uuid' }),
      } as Response)
      // getSpeechSynthesisRequest (succeeded)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ uuid: 'mem-uuid', state: 'succeeded' }),
      } as Response)
      // getSynthesizedWav
      .mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'Content-Type': 'audio/wav' }),
        arrayBuffer: async () => mockBuffer,
      } as Response)
      // deleteSpeechSynthesisRequest
      .mockResolvedValueOnce({ ok: true, status: 204 } as Response);

    const client = new VoisonaClient(config);
    const result = await client.synthesizeToBuffer(
      { language: 'ja_JP', text: 'test' },
      { pollInterval: 1 },
    );

    expect(result).toBeInstanceOf(ArrayBuffer);
    expect(result.byteLength).toBe(5);
  });

  it('should cleanup on synthesizeToBuffer failure', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ uuid: 'fail-mem-uuid' }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ uuid: 'fail-mem-uuid', state: 'succeeded' }),
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response)
      .mockResolvedValueOnce({ ok: true, status: 204 } as Response);

    const client = new VoisonaClient(config);
    await expect(
      client.synthesizeToBuffer({ language: 'ja_JP', text: 'test' }, { pollInterval: 1 }),
    ).rejects.toThrow('HTTP Error: 500');

    // Verify cleanup call
    const deleteCall = vi
      .mocked(fetch)
      .mock.calls.find(
        (c) =>
          String(c[0]).includes('/speech-syntheses/fail-mem-uuid') && c[1]?.method === 'DELETE',
      );
    expect(deleteCall).toBeDefined();
  });

  it('should handle synthesizeWithPronunciation', async () => {
    vi.mocked(fetch)
      // analyzeAndWait -> requestTextAnalysis
      .mockResolvedValueOnce({ ok: true, json: async () => ({ uuid: 'a1' }) } as Response)
      // analyzeAndWait -> getTextAnalysisRequest
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          uuid: 'a1',
          state: 'succeeded',
          analyzed_text: '<TSML><word pronunciation="KOGERU">焦る</word></TSML>',
        }),
      } as Response)
      // analyzeAndWait -> deleteTextAnalysisRequest
      .mockResolvedValueOnce({ ok: true, status: 204 } as Response)
      // synthesizeAndWait -> requestSpeechSynthesis
      .mockResolvedValueOnce({ ok: true, json: async () => ({ uuid: 's1' }) } as Response)
      // synthesizeAndWait -> getSpeechSynthesisRequest
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ uuid: 's1', state: 'succeeded' }),
      } as Response)
      // synthesizeAndWait -> deleteSpeechSynthesisRequest
      .mockResolvedValueOnce({ ok: true, status: 204 } as Response);

    const client = new VoisonaClient(config);
    const result = await client.synthesizeWithPronunciation(
      { language: 'ja_JP', text: '焦る' },
      { 焦る: 'アセル' },
      { pollInterval: 1 },
    );

    expect(result.uuid).toBe('s1');
    const synthCall = vi
      .mocked(fetch)
      .mock.calls.find(
        (c) => String(c[0]).includes('/speech-syntheses') && c[1]?.method === 'POST',
      );
    // The body is a JSON string, so the TSML inside it will have escaped quotes
    expect(synthCall![1]!.body).toContain('pronunciation=\\"アセル\\"');
  });
});
