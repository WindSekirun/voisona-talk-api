import { VoisonaClient } from './base';
import {
  ApiResponse,
  ContentCreated,
  RequestState,
  RequestTextAnalysisParams,
  TextAnalysisBaseInformation,
  TextAnalysisRequest,
  API_CONSTRAINTS,
} from '../types';

// Extend the base class with analysis methods
declare module './base' {
  interface VoisonaClient {
    // --- Text Analysis ---

    /**
     * Lists all current text analysis requests.
     * @returns A list of text analysis base information.
     */
    listTextAnalysisRequests(): Promise<TextAnalysisBaseInformation[]>;

    /**
     * Requests a new text analysis for speech synthesis.
     * @param params Parameters for the analysis request.
     * @returns The created request information including its UUID.
     * @throws Error if validation fails.
     */
    requestTextAnalysis(params: RequestTextAnalysisParams): Promise<ContentCreated>;

    /**
     * Retrieves detailed information and results of a specific text analysis request.
     * @param uuid The unique ID of the request.
     * @returns Detailed information and results of the analysis.
     */
    getTextAnalysisRequest(uuid: string): Promise<TextAnalysisRequest>;

    /**
     * Deletes a specific text analysis request.
     * @param uuid The unique ID of the request to delete.
     */
    deleteTextAnalysisRequest(uuid: string): Promise<void>;

    /**
     * Clears text analysis requests that are in specific states.
     * @param states States to clear. Defaults to ['succeeded', 'failed'].
     */
    clearTextAnalysisRequests(states?: RequestState[]): Promise<void>;

    /**
     * Convenience method to request text analysis and wait for it to succeed.
     * @param params Parameters for the analysis request.
     * @param options Polling options.
     * @returns The final successful text analysis request result.
     * @throws Error if analysis fails or times out.
     */
    analyzeAndWait(
      params: RequestTextAnalysisParams,
      options?: {
        pollInterval?: number;
        timeout?: number;
        autoCleanup?: boolean;
        onProgress?: (percentage: number) => void;
      },
    ): Promise<TextAnalysisRequest>;
  }
}

// Implementation
VoisonaClient.prototype.listTextAnalysisRequests = async function (): Promise<
  TextAnalysisBaseInformation[]
> {
  const data = await this.request<ApiResponse<TextAnalysisBaseInformation>>('/text-analyses');
  return data.items ?? [];
};

VoisonaClient.prototype.requestTextAnalysis = async function (
  params: RequestTextAnalysisParams,
): Promise<ContentCreated> {
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
};

VoisonaClient.prototype.getTextAnalysisRequest = async function (
  uuid: string,
): Promise<TextAnalysisRequest> {
  return this.request<TextAnalysisRequest>(`/text-analyses/${uuid}`);
};

VoisonaClient.prototype.deleteTextAnalysisRequest = async function (uuid: string): Promise<void> {
  await this.request<void>(`/text-analyses/${uuid}`, {
    method: 'DELETE',
  });
};

VoisonaClient.prototype.clearTextAnalysisRequests = async function (
  states: RequestState[] = ['succeeded', 'failed'],
): Promise<void> {
  const reqs = await this.listTextAnalysisRequests();
  const targets = reqs.filter((r) => states.includes(requestToState(r.state)));
  await Promise.all(targets.map((r) => this.deleteTextAnalysisRequest(r.uuid)));
};

function requestToState(state: string): RequestState {
  return state as RequestState;
}

// Helper method for analysis
VoisonaClient.prototype.analyzeAndWait = async function (
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
};
