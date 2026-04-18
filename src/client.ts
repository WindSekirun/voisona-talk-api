import { join } from 'node:path';
import { mkdirSync } from 'node:fs';
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
  API_CONSTRAINTS,
} from './types.js';

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
   * Performs an internal HTTP request to the API.
   * @private
   */
  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': this.authHeader,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorData: ErrorResponse;
      try {
        errorData = await response.json() as ErrorResponse;
      } catch {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }
      throw new Error(`API Error [${errorData.status}]: ${errorData.title} - ${errorData.detail}`);
    }

    if (response.status === 204 || response.status === 200 && response.headers.get('Content-Length') === '0') {
      return {} as T;
    }

    return response.json() as Promise<T>;
  }

  // --- Speech Synthesis ---

  /**
   * Lists all current speech synthesis requests.
   * @returns A list of speech synthesis base information.
   */
  async listSpeechSynthesisRequests(): Promise<SpeechSynthesisBaseInformation[]> {
    const data = await this.request<ApiResponse<SpeechSynthesisBaseInformation>>('/speech-syntheses');
    return data.items ?? [];
  }

  /**
   * Requests a new speech synthesis. This enqueues the request.
   * @param params Parameters for the synthesis request.
   * @returns The created request information including its UUID.
   */
  async requestSpeechSynthesis(params: RequestSpeechSynthesisParams): Promise<ContentCreated> {
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
   */
  async requestTextAnalysis(params: RequestTextAnalysisParams): Promise<ContentCreated> {
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
    return (data.items ?? []).map(i => i.language);
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
    options: { pollInterval?: number; timeout?: number } = {}
  ): Promise<SpeechSynthesisRequest> {
    const { 
      pollInterval = API_CONSTRAINTS.POLL_INTERVAL_DEFAULT, 
      timeout = API_CONSTRAINTS.POLL_TIMEOUT_DEFAULT 
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
      } catch (err) {
        // Ignore if directory already exists
      }
      
      finalParams.output_file_path = join(outputDir, `output_${timestamp}_${random}.wav`);
    }

    const { uuid } = await this.requestSpeechSynthesis(finalParams);

    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const request = await this.getSpeechSynthesisRequest(uuid);
      if (request.state === 'succeeded') {
        return request;
      }
      if (request.state === 'failed') {
        const detail = request.meta?.warnings ? JSON.stringify(request.meta.warnings) : 'No additional details';
        throw new Error(`Speech synthesis failed for UUID: ${uuid}. Details: ${detail}`);
      }
      await new Promise(resolve => setTimeout(resolve, pollInterval));
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
    options: { pollInterval?: number; timeout?: number } = {}
  ): Promise<TextAnalysisRequest> {
    const { 
      pollInterval = API_CONSTRAINTS.POLL_INTERVAL_DEFAULT, 
      timeout = API_CONSTRAINTS.POLL_TIMEOUT_DEFAULT 
    } = options;
    const { uuid } = await this.requestTextAnalysis(params);

    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const request = await this.getTextAnalysisRequest(uuid);
      if (request.state === 'succeeded') {
        return request;
      }
      if (request.state === 'failed') {
        throw new Error(`Text analysis failed for UUID: ${uuid}`);
      }
      await new Promise(resolve => setTimeout(resolve, pollInterval));
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
    options: { concurrency?: number; pollInterval?: number; timeout?: number } = {}
  ): Promise<SpeechSynthesisRequest[]> {
    const { concurrency = 3, ...pollOptions } = options;
    const results: SpeechSynthesisRequest[] = [];
    
    for (let i = 0; i < items.length; i += concurrency) {
      const chunk = items.slice(i, i + concurrency);
      const chunkResults = await Promise.all(
        chunk.map(item => this.synthesizeAndWait(item, pollOptions))
      );
      results.push(...chunkResults);
    }

    return results;
  }

  /**
   * Helper to create a style_weights array from a mapping of style names to weights.
   * @param voiceInfo Detailed voice information containing style_names.
   * @param styleWeightsMap A record of style names and their corresponding weights (0.0 to 1.0).
   * @returns A number array representing the style weights in the correct order.
   */
  getStyleWeights(
    voiceInfo: VoiceInformation,
    styleWeightsMap: Record<string, number>
  ): number[] {
    const weights = [...voiceInfo.default_style_weights];
    for (const [name, weight] of Object.entries(styleWeightsMap)) {
      const index = voiceInfo.style_names.indexOf(name);
      if (index !== -1) {
        weights[index] = weight;
      }
    }
    return weights;
  }
}
