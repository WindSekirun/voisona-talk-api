import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VoisonaClient } from '../src/client.js';

describe('VoisonaClient', () => {
  const config = {
    email: 'test@example.com',
    password: 'password123',
    baseUrl: 'http://localhost:32766/api/talk/v1'
  };

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('should initialize with config', () => {
    const client = new VoisonaClient(config);
    expect(client).toBeDefined();
  });

  it('should throw error if email or password missing', () => {
    expect(() => new VoisonaClient({})).toThrow('VoiSona Talk API requires email and password');
  });

  it('should call listVoices and return items', async () => {
    const mockVoices = {
      items: [
        { voice_name: 'test_voice', voice_version: '1.0.0', languages: ['ja_JP'] }
      ]
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockVoices,
    } as Response);

    const client = new VoisonaClient(config);
    const voices = await client.listVoices();

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/voices'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': expect.stringContaining('Basic'),
        }),
      })
    );
    expect(voices).toEqual(mockVoices.items);
  });

  it('should handle API errors', async () => {
    const mockError = {
      status: 400,
      title: 'Bad Request',
      detail: 'Invalid parameter'
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: async () => mockError,
    } as Response);

    const client = new VoisonaClient(config);
    await expect(client.listVoices()).rejects.toThrow('API Error [400]: Bad Request - Invalid parameter');
  });
});
