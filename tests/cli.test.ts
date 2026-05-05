import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { handleAnalysis } from '../src/cli/analysis';
import { handleSynthesis } from '../src/cli/synthesis';
import { handleVoices } from '../src/cli/voices';
import { parseKeyValueString, parseJsonObject } from '../src/cli/helpers';
import type { VoisonaClient } from '../src';

describe('CLI helpers', () => {
  it('parses key:value strings into a record', () => {
    expect(parseKeyValueString('Happy:0.8,Angry:0.2')).toEqual({
      Happy: '0.8',
      Angry: '0.2',
    });
  });

  it('throws when key:value pairs are invalid', () => {
    expect(() => parseKeyValueString('Happy:0.8,Angry')).toThrow('Invalid key:value pair');
  });

  it('parses JSON object strings', () => {
    expect(parseJsonObject('{"can_overwrite_file":true}')).toEqual({
      can_overwrite_file: true,
    });
  });

  it('throws when JSON is invalid', () => {
    expect(() => parseJsonObject('not-json')).toThrow('Invalid JSON for --params');
  });
});

describe('CLI voices handler', () => {
  let consoleLog: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('lists available voices', async () => {
    const client = {
      listVoices: vi.fn().mockResolvedValue([
        {
          voice_name: 'Chis-A',
          voice_version: '1',
          display_names: [{ language: 'ja_JP', name: 'チス-A' }],
        },
      ]),
    } as unknown as VoisonaClient;

    await handleVoices(client, 'list', '', { json: false });
    expect(consoleLog).toHaveBeenCalledWith('Available voices (1):');
    expect(consoleLog).toHaveBeenCalledWith('- チス-A (Chis-A) [v1]');
  });

  it('lists available voices in JSON mode', async () => {
    const client = {
      listVoices: vi.fn().mockResolvedValue([
        {
          voice_name: 'Chis-A',
          voice_version: '1',
          display_names: [{ language: 'ja_JP', name: 'チス-A' }],
        },
      ]),
    } as unknown as VoisonaClient;

    await handleVoices(client, 'list', '', { json: true });
    expect(consoleLog).toHaveBeenCalledWith(
      JSON.stringify(
        [
          {
            voice_name: 'Chis-A',
            voice_version: '1',
            display_names: [{ language: 'ja_JP', name: 'チス-A' }],
          },
        ],
        null,
        2,
      ),
    );
  });

  it('prints voice info in JSON mode', async () => {
    const client = {
      listVoices: vi.fn().mockResolvedValue([
        {
          voice_name: 'Chis-A',
          voice_version: '1',
          display_names: [{ language: 'ja_JP', name: 'チス-A' }],
        },
      ]),
      getVoiceInformation: vi.fn().mockResolvedValue({
        voice_name: 'Chis-A',
        voice_version: '1',
        style_names: ['Happy', 'Angry'],
        languages: ['ja_JP'],
      }),
    } as unknown as VoisonaClient;

    const consoleLogJson = vi.spyOn(console, 'log').mockImplementation(() => {});
    await handleVoices(client, 'info', 'Chis-A', { json: true });
    expect(consoleLogJson).toHaveBeenCalledWith(
      JSON.stringify(
        {
          voice_name: 'Chis-A',
          voice_version: '1',
          style_names: ['Happy', 'Angry'],
          languages: ['ja_JP'],
        },
        null,
        2,
      ),
    );
  });

  it('throws when no voice name is provided for info', async () => {
    const client = {
      listVoices: vi.fn(),
    } as unknown as VoisonaClient;

    await expect(handleVoices(client, 'info', '', { json: false })).rejects.toThrow(
      'voice_name is required',
    );
  });

  it('prints voice info in text mode', async () => {
    const client = {
      listVoices: vi.fn().mockResolvedValue([
        {
          voice_name: 'Chis-A',
          voice_version: '1',
          display_names: [{ language: 'ja_JP', name: 'チス-A' }],
        },
      ]),
      getVoiceInformation: vi.fn().mockResolvedValue({
        voice_name: 'Chis-A',
        voice_version: '1',
        style_names: ['Happy', 'Angry'],
        languages: ['ja_JP'],
      }),
    } as unknown as VoisonaClient;

    await handleVoices(client, 'info', 'Chis-A', { json: false });
    expect(consoleLog).toHaveBeenCalledWith(
      'Voice Information: Chis-A\nVersion: 1\nStyles: Happy, Angry\nLanguages: ja_JP',
    );
  });
});

describe('CLI synthesis handler', () => {
  let consoleLog: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('combines style values and calls synthesizeAndWait', async () => {
    const client = {
      listVoices: vi.fn().mockResolvedValue([
        {
          voice_name: 'Chis-A',
          voice_version: '1',
          display_names: [{ language: 'ja_JP', name: 'チス-A' }],
        },
      ]),
      getVoiceInformation: vi.fn().mockResolvedValue({
        voice_name: 'Chis-A',
        voice_version: '1',
        style_names: ['Happy', 'Angry'],
        default_style_weights: [0.5, 0.5],
      }),
      getStyleWeights: vi.fn().mockImplementation((voiceInfo, styleWeightsMap) => {
        return Object.entries(styleWeightsMap).map(([, weight]) => Number(weight));
      }),
      synthesizeAndWait: vi.fn().mockResolvedValue({ output_file_path: './hello.wav' }),
      synthesizeWithPronunciation: vi.fn().mockResolvedValue({ output_file_path: './hello.wav' }),
    } as unknown as VoisonaClient;

    await handleSynthesis(client, 'request', 'こんにちは', {
      language: 'ja_JP',
      json: false,
      voice_name: 'Chis-A',
      styles: 'Happy:0.8,Angry:0.2',
      output: './hello.wav',
      verbose: false,
      params: undefined,
      speed: undefined,
      pitch: undefined,
      intonation: undefined,
      volume: undefined,
      huskiness: undefined,
      alp: undefined,
    });

    expect(client.getVoiceInformation).toHaveBeenCalledWith('Chis-A', '1');
    expect(client.synthesizeAndWait).toHaveBeenCalledWith(
      expect.objectContaining({
        language: 'ja_JP',
        text: 'こんにちは',
        voice_name: 'Chis-A',
        voice_version: '1',
        output_file_path: './hello.wav',
        global_parameters: {
          style_weights: [0.8, 0.2],
        },
      }),
      expect.any(Object),
    );
  });

  it('uses synthesizeWithPronunciation when --pron is provided', async () => {
    const client = {
      listVoices: vi.fn().mockResolvedValue([
        {
          voice_name: 'Chis-A',
          voice_version: '1',
          display_names: [{ language: 'ja_JP', name: 'チス-A' }],
        },
      ]),
      synthesizeAndWait: vi.fn().mockResolvedValue({ output_file_path: './hello.wav' }),
      synthesizeWithPronunciation: vi.fn().mockResolvedValue({ output_file_path: './hello.wav' }),
    } as unknown as VoisonaClient;

    await handleSynthesis(client, 'request', '焦る必要はありません。', {
      language: 'ja_JP',
      json: false,
      voice_name: 'Chis-A',
      pron: '焦る:アセル',
      output: './hello.wav',
      verbose: false,
      params: undefined,
      speed: undefined,
      pitch: undefined,
      intonation: undefined,
      volume: undefined,
      huskiness: undefined,
      alp: undefined,
      styles: undefined,
    });

    expect(client.synthesizeWithPronunciation).toHaveBeenCalledWith(
      expect.objectContaining({
        language: 'ja_JP',
        text: '焦る必要はありません。',
        voice_name: 'Chis-A',
        voice_version: '1',
        output_file_path: './hello.wav',
      }),
      { 焦る: 'アセル' },
      expect.any(Object),
    );
  });

  it('lists synthesis requests', async () => {
    const client = {
      listSpeechSynthesisRequests: vi
        .fn()
        .mockResolvedValue([{ uuid: 's1', state: 'succeeded', text: 'こんにちは' }]),
    } as unknown as VoisonaClient;

    await handleSynthesis(client, 'list', '', { json: false });
    expect(consoleLog).toHaveBeenCalledWith('Speech synthesis requests (1):');
    expect(consoleLog).toHaveBeenCalledWith('- s1: [succeeded] こんにちは...');
  });

  it('gets a synthesis request in JSON mode', async () => {
    const client = {
      getSpeechSynthesisRequest: vi
        .fn()
        .mockResolvedValue({ uuid: 's1', state: 'succeeded', text: 'こんにちは' }),
    } as unknown as VoisonaClient;

    await handleSynthesis(client, 'get', 's1', { json: true });
    expect(consoleLog).toHaveBeenCalledWith(
      JSON.stringify({ uuid: 's1', state: 'succeeded', text: 'こんにちは' }, null, 2),
    );
  });

  it('deletes a synthesis request', async () => {
    const client = {
      deleteSpeechSynthesisRequest: vi.fn().mockResolvedValue(undefined),
    } as unknown as VoisonaClient;

    await handleSynthesis(client, 'delete', 's1', { json: false });
    expect(consoleLog).toHaveBeenCalledWith('Deleted synthesis request: s1');
  });

  it('clears synthesis requests', async () => {
    const client = {
      clearSpeechSynthesisRequests: vi.fn().mockResolvedValue(undefined),
    } as unknown as VoisonaClient;

    await handleSynthesis(client, 'clear', '', { json: false });
    expect(consoleLog).toHaveBeenCalledWith('Cleared completed synthesis requests.');
  });

  it('throws for invalid style weight', async () => {
    const client = {
      listVoices: vi.fn().mockResolvedValue([
        {
          voice_name: 'Chis-A',
          voice_version: '1',
          display_names: [{ language: 'ja_JP', name: 'チス-A' }],
        },
      ]),
      getVoiceInformation: vi.fn().mockResolvedValue({
        voice_name: 'Chis-A',
        voice_version: '1',
        style_names: ['Happy'],
        default_style_weights: [0.5],
      }),
    } as unknown as VoisonaClient;

    await expect(
      handleSynthesis(client, 'request', 'こんにちは', {
        language: 'ja_JP',
        json: false,
        voice_name: 'Chis-A',
        styles: 'Happy:invalid',
        output: './hello.wav',
        verbose: false,
        params: undefined,
        speed: undefined,
        pitch: undefined,
        intonation: undefined,
        volume: undefined,
        huskiness: undefined,
        alp: undefined,
      }),
    ).rejects.toThrow("Invalid weight for style 'Happy': invalid");
  });

  it('normalizes style weight from percentage', async () => {
    const client = {
      listVoices: vi.fn().mockResolvedValue([
        {
          voice_name: 'Chis-A',
          voice_version: '1',
          display_names: [{ language: 'ja_JP', name: 'チス-A' }],
        },
      ]),
      getVoiceInformation: vi.fn().mockResolvedValue({
        voice_name: 'Chis-A',
        voice_version: '1',
        style_names: ['Happy'],
        default_style_weights: [0.5],
      }),
      getStyleWeights: vi.fn().mockImplementation((voiceInfo, styleWeightsMap) => {
        return Object.entries(styleWeightsMap).map(([, weight]) => Number(weight));
      }),
      synthesizeAndWait: vi.fn().mockResolvedValue({ output_file_path: './hello.wav' }),
    } as unknown as VoisonaClient;

    await handleSynthesis(client, 'request', 'こんにちは', {
      language: 'ja_JP',
      json: false,
      voice_name: 'Chis-A',
      styles: 'Happy:50',
      output: './hello.wav',
      verbose: false,
      params: undefined,
      speed: undefined,
      pitch: undefined,
      intonation: undefined,
      volume: undefined,
      huskiness: undefined,
      alp: undefined,
    });

    expect(client.synthesizeAndWait).toHaveBeenCalledWith(
      expect.objectContaining({
        global_parameters: {
          style_weights: [0.5],
        },
      }),
      expect.any(Object),
    );
  });

  it('prints progress when verbose', async () => {
    const client = {
      listVoices: vi.fn().mockResolvedValue([
        {
          voice_name: 'Chis-A',
          voice_version: '1',
          display_names: [{ language: 'ja_JP', name: 'チス-A' }],
        },
      ]),
      synthesizeAndWait: vi.fn().mockImplementation(async (params, options) => {
        options.onProgress(50);
        return { output_file_path: './hello.wav' };
      }),
    } as unknown as VoisonaClient;

    await handleSynthesis(client, 'request', 'こんにちは', {
      language: 'ja_JP',
      json: false,
      voice_name: 'Chis-A',
      output: './hello.wav',
      verbose: true,
      params: undefined,
      speed: undefined,
      pitch: undefined,
      intonation: undefined,
      volume: undefined,
      huskiness: undefined,
      alp: undefined,
      styles: undefined,
    });

    expect(consoleLog).toHaveBeenCalledWith('Progress: 50%');
  });

  it('throws for unknown command', async () => {
    const client = {} as unknown as VoisonaClient;

    await expect(handleSynthesis(client, 'unknown', '', { json: false })).rejects.toThrow(
      'Usage: voisona synthesis <command> [options]',
    );
  });
});

describe('CLI analysis handler', () => {
  let consoleLog: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('prints analysis request output', async () => {
    const client = {
      listTextAnalysisRequests: vi
        .fn()
        .mockResolvedValue([{ uuid: 'a', state: 'succeeded', text: 'こんにちは' }]),
      getTextAnalysisRequest: vi
        .fn()
        .mockResolvedValue({ uuid: 'a', state: 'succeeded', analyzed_text: 'tsml' }),
      deleteTextAnalysisRequest: vi.fn().mockResolvedValue(undefined),
      clearTextAnalysisRequests: vi.fn().mockResolvedValue(undefined),
      analyzeAndWait: vi.fn().mockResolvedValue({ analyzed_text: 'tsml' }),
    } as unknown as VoisonaClient;

    await handleAnalysis(client, 'request', 'こんにちは', {
      json: false,
      verbose: false,
      language: 'ja_JP',
    });

    expect(consoleLog).toHaveBeenCalledWith('\nAnalysis Success! Result: tsml');
  });

  it('lists analysis requests', async () => {
    const client = {
      listTextAnalysisRequests: vi
        .fn()
        .mockResolvedValue([{ uuid: 'a1', state: 'queued', text: 'テスト' }]),
    } as unknown as VoisonaClient;

    await handleAnalysis(client, 'list', '', { json: false });
    expect(consoleLog).toHaveBeenCalledWith('Text analysis requests (1):');
    expect(consoleLog).toHaveBeenCalledWith('- a1: [queued] テスト...');
  });

  it('gets an analysis request in JSON mode', async () => {
    const client = {
      getTextAnalysisRequest: vi
        .fn()
        .mockResolvedValue({ uuid: 'a1', state: 'completed', analyzed_text: '結果' }),
    } as unknown as VoisonaClient;

    await handleAnalysis(client, 'get', 'a1', { json: true });
    expect(consoleLog).toHaveBeenCalledWith(
      JSON.stringify({ uuid: 'a1', state: 'completed', analyzed_text: '結果' }, null, 2),
    );
  });

  it('deletes an analysis request', async () => {
    const client = {
      deleteTextAnalysisRequest: vi.fn().mockResolvedValue(undefined),
    } as unknown as VoisonaClient;

    await handleAnalysis(client, 'delete', 'a1', { json: false });
    expect(consoleLog).toHaveBeenCalledWith('Deleted analysis request: a1');
  });

  it('clears analysis requests', async () => {
    const client = {
      clearTextAnalysisRequests: vi.fn().mockResolvedValue(undefined),
    } as unknown as VoisonaClient;

    await handleAnalysis(client, 'clear', '', { json: false });
    expect(consoleLog).toHaveBeenCalledWith('Cleared completed analysis requests.');
  });

  it('lists analysis requests in JSON mode', async () => {
    const client = {
      listTextAnalysisRequests: vi
        .fn()
        .mockResolvedValue([{ uuid: 'a1', state: 'queued', text: 'テスト' }]),
    } as unknown as VoisonaClient;

    await handleAnalysis(client, 'list', '', { json: true });
    expect(consoleLog).toHaveBeenCalledWith(
      JSON.stringify([{ uuid: 'a1', state: 'queued', text: 'テスト' }], null, 2),
    );
  });

  it('throws when no UUID is provided for get', async () => {
    const client = {} as unknown as VoisonaClient;

    await expect(handleAnalysis(client, 'get', '', { json: false })).rejects.toThrow(
      'UUID is required. Usage: voisona analysis get <uuid>',
    );
  });

  it('throws when no UUID is provided for delete', async () => {
    const client = {} as unknown as VoisonaClient;

    await expect(handleAnalysis(client, 'delete', '', { json: false })).rejects.toThrow(
      'UUID is required. Usage: voisona analysis delete <uuid>',
    );
  });

  it('throws when no text is provided for request', async () => {
    const client = {} as unknown as VoisonaClient;

    await expect(
      handleAnalysis(client, 'request', '', { json: false, verbose: false, language: 'ja_JP' }),
    ).rejects.toThrow('Text is required. Usage: voisona analysis request <text>');
  });

  it('prints verbose output for request', async () => {
    const client = {
      analyzeAndWait: vi.fn().mockResolvedValue({ analyzed_text: 'tsml' }),
    } as unknown as VoisonaClient;

    await handleAnalysis(client, 'request', 'こんにちは', {
      json: false,
      verbose: true,
      language: 'ja_JP',
    });

    expect(consoleLog).toHaveBeenCalledWith('Analyzing text: "こんにちは"');
    expect(consoleLog).toHaveBeenCalledWith('\nAnalysis Success! Result: tsml');
  });

  it('throws for unknown command', async () => {
    const client = {} as unknown as VoisonaClient;

    await expect(handleAnalysis(client, 'unknown', '', { json: false })).rejects.toThrow(
      'Usage: voisona analysis <command> [options]',
    );
  });
});
