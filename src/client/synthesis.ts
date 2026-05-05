import { join } from 'node:path';
import { mkdirSync } from 'node:fs';
import { VoisonaClient } from './base';
import { replacePronunciation } from '../utils';
import {
  ApiResponse,
  ContentCreated,
  RequestSpeechSynthesisParams,
  RequestState,
  SpeechSynthesisBaseInformation,
  SpeechSynthesisRequest,
  API_CONSTRAINTS,
} from '../types';

// Extend the base class with synthesis methods
declare module './base' {
  interface VoisonaClient {
    // --- Speech Synthesis ---

    /**
     * Lists all current speech synthesis requests.
     * @returns A list of speech synthesis base information.
     */
    listSpeechSynthesisRequests(): Promise<SpeechSynthesisBaseInformation[]>;

    /**
     * Requests a new speech synthesis. This enqueues the request.
     * @param params Parameters for the synthesis request.
     * @returns The created request information including its UUID.
     * @throws Error if validation fails.
     */
    requestSpeechSynthesis(params: RequestSpeechSynthesisParams): Promise<ContentCreated>;

    /**
     * Retrieves detailed information about a specific speech synthesis request.
     * @param uuid The unique ID of the request.
     * @returns Detailed information about the synthesis request.
     */
    getSpeechSynthesisRequest(uuid: string): Promise<SpeechSynthesisRequest>;

    /**
     * Deletes a specific speech synthesis request.
     * @param uuid The unique ID of the request to delete.
     */
    deleteSpeechSynthesisRequest(uuid: string): Promise<void>;

    /**
     * Gets the WAV data of synthesized speech.
     * Available only when destination is 'memory' and state is 'succeeded'.
     * @param uuid The unique ID of the request.
     * @returns The WAV data as an ArrayBuffer.
     */
    getSynthesizedWav(uuid: string): Promise<ArrayBuffer>;

    /**
     * Clears speech synthesis requests that are in specific states.
     * @param states States to clear. Defaults to ['succeeded', 'failed'].
     */
    clearSpeechSynthesisRequests(states?: RequestState[]): Promise<void>;

    /**
     * Convenience method to request speech synthesis and wait for it to succeed.
     * @param params Parameters for the synthesis request.
     * @param options Polling options.
     * @returns The final successful speech synthesis request result.
     * @throws Error if synthesis fails or times out.
     */
    synthesizeAndWait(
      params: RequestSpeechSynthesisParams,
      options?: {
        pollInterval?: number;
        timeout?: number;
        autoCleanup?: boolean;
        onProgress?: (percentage: number) => void;
      },
    ): Promise<SpeechSynthesisRequest>;

    /**
     * Convenience method to request speech synthesis to memory and retrieve the WAV data.
     * @param params Parameters for the synthesis request (destination will be forced to 'memory').
     * @param options Polling and cleanup options.
     * @returns The WAV data as an ArrayBuffer.
     */
    synthesizeToBuffer(
      params: RequestSpeechSynthesisParams,
      options?: {
        pollInterval?: number;
        timeout?: number;
        autoCleanup?: boolean;
        onProgress?: (percentage: number) => void;
      },
    ): Promise<ArrayBuffer>;

    /**
     * Convenience method to process multiple synthesis requests with concurrency control.
     * @param items List of synthesis request parameters.
     * @param options Concurrency and polling options.
     * @returns A list of all successful synthesis results.
     */
    bulkSynthesize(
      items: RequestSpeechSynthesisParams[],
      options?: {
        concurrency?: number;
        pollInterval?: number;
        timeout?: number;
        autoCleanup?: boolean;
        onProgress?: (percentage: number) => void;
      },
    ): Promise<SpeechSynthesisRequest[]>;

    /**
     * Convenience method to request speech synthesis with custom pronunciations for specific words.
     *
     * @param params Parameters for the synthesis request (text is required).
     * @param pronunciationMap A record where keys are words and values are their desired Katakana pronunciations.
     * @param options Polling options.
     * @returns The final successful speech synthesis request result.
     */
    synthesizeWithPronunciation(
      params: RequestSpeechSynthesisParams & { text: string },
      pronunciationMap: Record<string, string>,
      options?: {
        pollInterval?: number;
        timeout?: number;
        autoCleanup?: boolean;
        onProgress?: (percentage: number) => void;
      },
    ): Promise<SpeechSynthesisRequest>;
  }
}

// Implementation
VoisonaClient.prototype.listSpeechSynthesisRequests = async function (): Promise<
  SpeechSynthesisBaseInformation[]
> {
  const data = await this.request<ApiResponse<SpeechSynthesisBaseInformation>>('/speech-syntheses');
  return data.items ?? [];
};

VoisonaClient.prototype.requestSpeechSynthesis = async function (
  params: RequestSpeechSynthesisParams,
): Promise<ContentCreated> {
  if (!params.analyzed_text && (!params.text || params.text.trim().length === 0)) {
    throw new Error('Either "text" or "analyzed_text" must be provided for speech synthesis.');
  }

  if (params.text && params.text.length > API_CONSTRAINTS.TEXT_MAX_LENGTH) {
    throw new Error(
      `"text" exceeds maximum length of ${API_CONSTRAINTS.TEXT_MAX_LENGTH} characters.`,
    );
  }

  if (
    params.analyzed_text &&
    params.analyzed_text.length > API_CONSTRAINTS.ANALYZED_TEXT_MAX_LENGTH
  ) {
    throw new Error(
      `"analyzed_text" exceeds maximum length of ${API_CONSTRAINTS.ANALYZED_TEXT_MAX_LENGTH} characters.`,
    );
  }

  if (params.global_parameters) {
    const gp = params.global_parameters;
    const validate = (
      name: string,
      val: number | undefined,
      range: { MIN: number; MAX: number },
    ) => {
      if (val !== undefined && (val < range.MIN || val > range.MAX)) {
        throw new Error(
          `Global parameter "${name}" must be between ${range.MIN} and ${range.MAX}.`,
        );
      }
    };

    validate('alp', gp.alp, API_CONSTRAINTS.ALP);
    validate('huskiness', gp.huskiness, API_CONSTRAINTS.HUSKINESS);
    validate('intonation', gp.intonation, API_CONSTRAINTS.INTONATION);
    validate('pitch', gp.pitch, API_CONSTRAINTS.PITCH);
    validate('speed', gp.speed, API_CONSTRAINTS.SPEED);
    validate('volume', gp.volume, API_CONSTRAINTS.VOLUME);
  }

  if (params.phoneme_durations) {
    for (const duration of params.phoneme_durations) {
      if (
        duration < API_CONSTRAINTS.PHONEME_DURATION.MIN ||
        duration > API_CONSTRAINTS.PHONEME_DURATION.MAX
      ) {
        throw new Error(
          `Phoneme duration must be between ${API_CONSTRAINTS.PHONEME_DURATION.MIN} and ${API_CONSTRAINTS.PHONEME_DURATION.MAX}.`,
        );
      }
    }
  }

  return this.request<ContentCreated>('/speech-syntheses', {
    method: 'POST',
    body: JSON.stringify(params),
  });
};

VoisonaClient.prototype.getSpeechSynthesisRequest = async function (
  uuid: string,
): Promise<SpeechSynthesisRequest> {
  return this.request<SpeechSynthesisRequest>(`/speech-syntheses/${uuid}`);
};

VoisonaClient.prototype.deleteSpeechSynthesisRequest = async function (
  uuid: string,
): Promise<void> {
  await this.request<void>(`/speech-syntheses/${uuid}`, {
    method: 'DELETE',
  });
};

VoisonaClient.prototype.getSynthesizedWav = async function (uuid: string): Promise<ArrayBuffer> {
  return this.request<ArrayBuffer>(`/speech-syntheses/${uuid}/wav`);
};

VoisonaClient.prototype.clearSpeechSynthesisRequests = async function (
  states: RequestState[] = ['succeeded', 'failed'],
): Promise<void> {
  const reqs = await this.listSpeechSynthesisRequests();
  const targets = reqs.filter((r) => states.includes(requestToState(r.state)));
  await Promise.all(targets.map((r) => this.deleteSpeechSynthesisRequest(r.uuid)));
};

function requestToState(state: string): RequestState {
  return state as RequestState;
}

// Helper methods for synthesis
VoisonaClient.prototype.synthesizeAndWait = async function (
  params: RequestSpeechSynthesisParams,
  options: {
    pollInterval?: number;
    timeout?: number;
    autoCleanup?: boolean;
    onProgress?: (percentage: number) => void;
  } = {},
): Promise<SpeechSynthesisRequest> {
  const {
    pollInterval = API_CONSTRAINTS.POLL_INTERVAL_DEFAULT,
    timeout = API_CONSTRAINTS.POLL_TIMEOUT_DEFAULT,
    autoCleanup = true,
    onProgress,
  } = options;

  // Default to 'file' destination as requested in PRD
  const finalParams: RequestSpeechSynthesisParams = {
    destination: 'file',
    ...params,
  };

  // If destination is 'file' but no path is provided, use a default in the 'output' directory
  if (finalParams.destination === 'file' && !finalParams.output_file_path) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 7);
    const outputDir = join(process.cwd(), 'output');

    // Ensure output directory exists
    try {
      mkdirSync(outputDir, { recursive: true });
    } catch {
      // Ignore if directory already exists
    }

    finalParams.output_file_path = join(outputDir, `output_${timestamp}_${random}.wav`);
  }

  const { uuid } = await this.requestSpeechSynthesis(finalParams);

  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    const request = await this.getSpeechSynthesisRequest(uuid);

    if (onProgress) {
      onProgress(request.progress_percentage);
    }

    if (request.state === 'succeeded') {
      // We don't autoCleanup yet if we might need the WAV (though for 'file' it's already saved)
      // For consistency with getSynthesizedWav, we might want to wait if it's 'memory'
      // But synthesizeAndWait is general.
      const result = request;
      if (autoCleanup) {
        await this.deleteSpeechSynthesisRequest(uuid);
      }
      return result;
    }
    if (request.state === 'failed') {
      const detail = request.meta?.warnings
        ? JSON.stringify(request.meta.warnings)
        : 'No additional details';
      throw new Error(`Speech synthesis failed for UUID: ${uuid}. Details: ${detail}`);
    }
    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }

  throw new Error(`Speech synthesis timed out for UUID: ${uuid}`);
};

VoisonaClient.prototype.synthesizeToBuffer = async function (
  params: RequestSpeechSynthesisParams,
  options: {
    pollInterval?: number;
    timeout?: number;
    autoCleanup?: boolean;
    onProgress?: (percentage: number) => void;
  } = {},
): Promise<ArrayBuffer> {
  const { autoCleanup = true, ...pollOptions } = options;

  const request = await this.synthesizeAndWait(
    {
      ...params,
      destination: 'memory',
    },
    {
      ...pollOptions,
      autoCleanup: false, // Must not delete until we get the WAV
    },
  );

  try {
    const buffer = await this.getSynthesizedWav(request.uuid);
    if (autoCleanup) {
      await this.deleteSpeechSynthesisRequest(request.uuid);
    }
    return buffer;
  } catch (error) {
    if (autoCleanup) {
      await this.deleteSpeechSynthesisRequest(request.uuid).catch(() => {});
    }
    throw error;
  }
};

VoisonaClient.prototype.bulkSynthesize = async function (
  items: RequestSpeechSynthesisParams[],
  options: {
    concurrency?: number;
    pollInterval?: number;
    timeout?: number;
    autoCleanup?: boolean;
    onProgress?: (percentage: number) => void;
  } = {},
): Promise<SpeechSynthesisRequest[]> {
  const { concurrency = 3, ...pollOptions } = options;
  const results: SpeechSynthesisRequest[] = [];

  for (let i = 0; i < items.length; i += concurrency) {
    const chunk = items.slice(i, i + concurrency);
    const chunkResults = await Promise.all(
      chunk.map((item) => this.synthesizeAndWait(item, pollOptions)),
    );
    results.push(...chunkResults);
  }

  return results;
};

VoisonaClient.prototype.synthesizeWithPronunciation = async function (
  params: RequestSpeechSynthesisParams & { text: string },
  pronunciationMap: Record<string, string>,
  options: {
    pollInterval?: number;
    timeout?: number;
    autoCleanup?: boolean;
    onProgress?: (percentage: number) => void;
  } = {},
): Promise<SpeechSynthesisRequest> {
  // 1. Analyze text first to get TSML
  const analysis = await this.analyzeAndWait(
    {
      language: params.language,
      text: params.text,
      force_enqueue: params.force_enqueue,
    },
    options,
  );

  let tsml = analysis.analyzed_text || '';

  // 2. Apply pronunciation replacements
  for (const [word, pronunciation] of Object.entries(pronunciationMap)) {
    tsml = replacePronunciation(tsml, word, pronunciation);
  }

  // 3. Synthesize using the modified TSML
  return this.synthesizeAndWait(
    {
      ...params,
      text: undefined, // Ignored if analyzed_text is provided
      analyzed_text: tsml,
    },
    options,
  );
};
