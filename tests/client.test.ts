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

  it('should getTextAnalysisRequest', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ uuid: 'a', state: 'succeeded', analyzed_text: 'tsml' }),
    } as Response);

    const client = new VoisonaClient(config);
    const result = await client.getTextAnalysisRequest('a');
    expect(result.analyzed_text).toBe('tsml');
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
});
