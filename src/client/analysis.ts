import {
  ApiResponse,
  ContentCreated,
  RequestState,
  RequestTextAnalysisParams,
  TextAnalysisBaseInformation,
  TextAnalysisRequest,
  API_CONSTRAINTS,
  Constructor,
} from '../types';

export function AnalysisMixin<TBase extends Constructor>(Base: TBase) {
  return class AnalysisClient extends Base {
    /**
     * Lists all current text analysis requests.
     * @returns A list of text analysis base information.
     */
    async listTextAnalysisRequests(): Promise<TextAnalysisBaseInformation[]> {
      const self = this as any as {
        request: <T>(path: string, options?: RequestInit) => Promise<T>;
      };
      const data = await self.request<ApiResponse<TextAnalysisBaseInformation>>('/text-analyses');
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

      const self = this as any as {
        request: <T>(path: string, options?: RequestInit) => Promise<T>;
      };
      return self.request<ContentCreated>('/text-analyses', {
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
      const self = this as any as {
        request: <T>(path: string, options?: RequestInit) => Promise<T>;
      };
      return self.request<TextAnalysisRequest>(`/text-analyses/${uuid}`);
    }

    /**
     * Deletes a specific text analysis request.
     * @param uuid The unique ID of the request to delete.
     */
    async deleteTextAnalysisRequest(uuid: string): Promise<void> {
      const self = this as any as {
        request: <T>(path: string, options?: RequestInit) => Promise<T>;
      };
      await self.request<void>(`/text-analyses/${uuid}`, {
        method: 'DELETE',
      });
    }

    /**
     * Clears text analysis requests that are in specific states.
     * @param states States to clear. Defaults to ['succeeded', 'failed'].
     */
    async clearTextAnalysisRequests(
      states: RequestState[] = ['succeeded', 'failed'],
    ): Promise<void> {
      const reqs = await this.listTextAnalysisRequests();
      const targets = reqs.filter((r) => states.includes(r.state as RequestState));
      await Promise.all(targets.map((r) => this.deleteTextAnalysisRequest(r.uuid)));
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
  };
}
