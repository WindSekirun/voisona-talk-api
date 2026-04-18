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
