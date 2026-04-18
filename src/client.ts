import { join } from 'node:path';
import { mkdirSync } from 'node:fs';
import { replacePronunciation } from './utils';
import {
  ApiResponse,
  ContentCreated,
  RequestSpeechSynthesisParams,
  RequestTextAnalysisParams,
  SpeechSynthesisBaseInformation,
  SpeechSynthesisRequest,
  TextAnalysisBaseInformation,
  TextAnalysisRequest,
  VoiceBaseInformation,
  VoiceInformation,
  ErrorResponse,
  RequestState,
  API_CONSTRAINTS,
} from './types';

/**
 * Configuration for the VoisonaClient.
 */
export interface VoisonaClientConfig {
  /** API user email. Defaults to VOISONA_EMAIL environment variable. */
  email?: string;
  /** API user password. Defaults to VOISONA_PASSWORD environment variable. */
  password?: string;
  /** Base URL of the VoiSona Talk API. Defaults to http://localhost:32766/api/talk/v1. */
  baseUrl?: string;
}

/**
 * Client for interacting with the VoiSona Talk API.
 */
export class VoisonaClient {
  private readonly baseUrl: string;
  private readonly authHeader: string;

  /**
   * Initializes a new instance of the VoisonaClient.
   * @param config Configuration options for the client.
   * @throws Error if email or password are missing.
   */
  constructor(config: VoisonaClientConfig) {
    this.baseUrl = config.baseUrl ?? 'http://localhost:32766/api/talk/v1';

    const email = config.email ?? process.env.VOISONA_EMAIL;
    const password = config.password ?? process.env.VOISONA_PASSWORD;

    if (!email || !password) {
      throw new Error('VoiSona Talk API requires email and password for Basic Authentication.');
    }

    this.authHeader = `Basic ${Buffer.from(`${email}:${password}`).toString('base64')}`;
  }

  /**
   * Checks if the VoiSona Talk service is currently running and reachable.
   * @returns True if the service is running, false otherwise.
   */
  async isServiceRunning(): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/languages`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: this.authHeader },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Performs an internal HTTP request to the API.
   * @private
   */
  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          Authorization: this.authHeader,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        let errorData: ErrorResponse;
        try {
          errorData = (await response.json()) as ErrorResponse;
        } catch {
          throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }
        throw new Error(
          `API Error [${errorData.status}]: ${errorData.title} - ${errorData.detail}`,
        );
      }

      if (
        response.status === 204 ||
        (response.status === 200 && response.headers.get('Content-Length') === '0')
      ) {
        return {} as T;
      }

      return response.json() as Promise<T>;
    } catch (error: any) {
      if (error.cause?.code === 'ECONNREFUSED' || error.message?.includes('fetch failed')) {
        throw new Error(
          `Could not connect to VoiSona Talk API at ${this.baseUrl}. Please ensure VoiSona Talk is running and the port is correct.`,
          { cause: error },
        );
      }
      throw error;
    }
  }

  // --- Speech Synthesis ---

  /**
   * Lists all current speech synthesis requests.
   * @returns A list of speech synthesis base information.
   */
  async listSpeechSynthesisRequests(): Promise<SpeechSynthesisBaseInformation[]> {
    const data =
      await this.request<ApiResponse<SpeechSynthesisBaseInformation>>('/speech-syntheses');
    return data.items ?? [];
  }

  /**
   * Requests a new speech synthesis. This enqueues the request.
   * @param params Parameters for the synthesis request.
   * @returns The created request information including its UUID.
   * @throws Error if validation fails.
   */
  async requestSpeechSynthesis(params: RequestSpeechSynthesisParams): Promise<ContentCreated> {
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

    return this.request<ContentCreated>('/speech-syntheses', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Retrieves detailed information about a specific speech synthesis request.
   * @param uuid The unique ID of the request.
   * @returns Detailed information about the synthesis request.
   */
  async getSpeechSynthesisRequest(uuid: string): Promise<SpeechSynthesisRequest> {
    return this.request<SpeechSynthesisRequest>(`/speech-syntheses/${uuid}`);
  }

  /**
   * Deletes a specific speech synthesis request.
   * @param uuid The unique ID of the request to delete.
   */
  async deleteSpeechSynthesisRequest(uuid: string): Promise<void> {
    await this.request<void>(`/speech-syntheses/${uuid}`, {
      method: 'DELETE',
    });
  }

  // --- Text Analysis ---

  /**
   * Lists all current text analysis requests.
   * @returns A list of text analysis base information.
   */
  async listTextAnalysisRequests(): Promise<TextAnalysisBaseInformation[]> {
    const data = await this.request<ApiResponse<TextAnalysisBaseInformation>>('/text-analyses');
    return data.items ?? [];
  }

  /**
   * Requests a new text analysis for speech synthesis.
   * @param params Parameters for the analysis request.
   * @returns The created request information including its UUID.
   * @throws Error if validation fails.
   */
  async requestTextAnalysis(params: RequestTextAnalysisParams): Promise<ContentCreated> {
    if (!params.text || params.text.trim().length === 0) {
      throw new Error('"text" is required and cannot be empty for text analysis.');
    }

    if (params.text.length > API_CONSTRAINTS.TEXT_MAX_LENGTH) {
      throw new Error(
        `"text" exceeds maximum length of ${API_CONSTRAINTS.TEXT_MAX_LENGTH} characters.`,
      );
    }

    return this.request<ContentCreated>('/text-analyses', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Retrieves detailed information and results of a specific text analysis request.
   * @param uuid The unique ID of the request.
   * @returns Detailed information and results of the analysis.
   */
  async getTextAnalysisRequest(uuid: string): Promise<TextAnalysisRequest> {
    return this.request<TextAnalysisRequest>(`/text-analyses/${uuid}`);
  }

  /**
   * Deletes a specific text analysis request.
   * @param uuid The unique ID of the request to delete.
   */
  async deleteTextAnalysisRequest(uuid: string): Promise<void> {
    await this.request<void>(`/text-analyses/${uuid}`, {
      method: 'DELETE',
    });
  }

  // --- Information ---

  /**
   * Lists all available voice libraries.
   * @returns A list of voice libraries.
   */
  async listVoices(): Promise<VoiceBaseInformation[]> {
    const data = await this.request<ApiResponse<VoiceBaseInformation>>('/voices');
    return data.items ?? [];
  }

  /**
   * Retrieves detailed information about a specific voice library.
   * @param name The name of the voice library.
   * @param version The version of the voice library.
   * @returns Detailed voice information.
   */
  async getVoiceInformation(name: string, version: string): Promise<VoiceInformation> {
    return this.request<VoiceInformation>(`/voices/${name}/${version}`);
  }

  /**
   * Lists all supported languages.
   * @returns A list of language codes.
   */
  async listLanguages(): Promise<string[]> {
    const data = await this.request<{ items: { language: string }[] }>('/languages');
    return (data.items ?? []).map((i) => i.language);
  }

  // --- Helpers ---

  /**
   * Convenience method to request speech synthesis and wait for it to succeed.
   * @param params Parameters for the synthesis request.
   * @param options Polling options.
   * @returns The final successful speech synthesis request result.
   * @throws Error if synthesis fails or times out.
   */
  async synthesizeAndWait(
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
        if (autoCleanup) {
          await this.deleteSpeechSynthesisRequest(uuid);
        }
        return request;
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
  }

  /**
   * Convenience method to request text analysis and wait for it to succeed.
   * @param params Parameters for the analysis request.
   * @param options Polling options.
   * @returns The final successful text analysis request result.
   * @throws Error if analysis fails or times out.
   */
  async analyzeAndWait(
    params: RequestTextAnalysisParams,
    options: {
      pollInterval?: number;
      timeout?: number;
      autoCleanup?: boolean;
      onProgress?: (percentage: number) => void;
    } = {},
  ): Promise<TextAnalysisRequest> {
    const {
      pollInterval = API_CONSTRAINTS.POLL_INTERVAL_DEFAULT,
      timeout = API_CONSTRAINTS.POLL_TIMEOUT_DEFAULT,
      autoCleanup = true,
      onProgress,
    } = options;
    const { uuid } = await this.requestTextAnalysis(params);

    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const request = await this.getTextAnalysisRequest(uuid);

      if (onProgress) {
        onProgress(request.progress_percentage);
      }

      if (request.state === 'succeeded') {
        if (autoCleanup) {
          await this.deleteTextAnalysisRequest(uuid);
        }
        return request;
      }
      if (request.state === 'failed') {
        throw new Error(`Text analysis failed for UUID: ${uuid}`);
      }
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }

    throw new Error(`Text analysis timed out for UUID: ${uuid}`);
  }

  /**
   * Convenience method to process multiple synthesis requests with concurrency control.
   * @param items List of synthesis request parameters.
   * @param options Concurrency and polling options.
   * @returns A list of all successful synthesis results.
   */
  async bulkSynthesize(
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
  }

  /**
   * Convenience method to request speech synthesis with custom pronunciations for specific words.
   *
   * @param params Parameters for the synthesis request (text is required).
   * @param pronunciationMap A record where keys are words and values are their desired Katakana pronunciations.
   * @param options Polling options.
   * @returns The final successful speech synthesis request result.
   */
  async synthesizeWithPronunciation(
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
  }

  /**
   * Helper to create a style_weights array from a mapping of style names to weights.
   * @param voiceInfo Detailed voice information containing style_names.
   * @param styleWeightsMap A record of style names and their corresponding weights (0.0 to 1.0).
   * @returns A number array representing the style weights in the correct order.
   */
  getStyleWeights(voiceInfo: VoiceInformation, styleWeightsMap: Record<string, number>): number[] {
    const weights = [...voiceInfo.default_style_weights];
    for (const [name, weight] of Object.entries(styleWeightsMap)) {
      const index = voiceInfo.style_names.indexOf(name);
      if (index !== -1) {
        weights[index] = weight;
      }
    }
    return weights;
  }

  // --- Queue Management Utilities ---

  /**
   * Retrieves the current status summary of the request queue.
   * @returns Counts of requests in each state.
   */
  async getQueueStatus(): Promise<{
    synthesis: Record<RequestState, number>;
    analysis: Record<RequestState, number>;
  }> {
    const [synthesisReqs, analysisReqs] = await Promise.all([
      this.listSpeechSynthesisRequests(),
      this.listTextAnalysisRequests(),
    ]);

    const getCounts = (reqs: { state: RequestState }[]) => {
      return reqs.reduce(
        (acc, req) => {
          acc[req.state]++;
          return acc;
        },
        { queued: 0, running: 0, succeeded: 0, failed: 0 } as Record<RequestState, number>,
      );
    };

    return {
      synthesis: getCounts(synthesisReqs),
      analysis: getCounts(analysisReqs),
    };
  }

  /**
   * Clears speech synthesis requests that are in specific states.
   * @param states States to clear. Defaults to ['succeeded', 'failed'].
   */
  async clearSpeechSynthesisRequests(
    states: RequestState[] = ['succeeded', 'failed'],
  ): Promise<void> {
    const reqs = await this.listSpeechSynthesisRequests();
    const targets = reqs.filter((r) => states.includes(requestToState(r.state)));
    await Promise.all(targets.map((r) => this.deleteSpeechSynthesisRequest(r.uuid)));
  }

  /**
   * Clears text analysis requests that are in specific states.
   * @param states States to clear. Defaults to ['succeeded', 'failed'].
   */
  async clearTextAnalysisRequests(states: RequestState[] = ['succeeded', 'failed']): Promise<void> {
    const reqs = await this.listTextAnalysisRequests();
    const targets = reqs.filter((r) => states.includes(requestToState(r.state)));
    await Promise.all(targets.map((r) => this.deleteTextAnalysisRequest(r.uuid)));
  }

  /**
   * Clears all completed (succeeded or failed) requests from both synthesis and analysis queues.
   */
  async clearAllCompletedRequests(): Promise<void> {
    await Promise.all([this.clearSpeechSynthesisRequests(), this.clearTextAnalysisRequests()]);
  }
}

/**
 * Internal helper to cast string state to RequestState type.
 * @private
 */
function requestToState(state: string): RequestState {
  return state as RequestState;
}
