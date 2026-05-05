import { ErrorResponse } from '../types';

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

    const credentials = `${email}:${password}`;
    const encoded =
      typeof btoa !== 'undefined' ? btoa(credentials) : Buffer.from(credentials).toString('base64');
    this.authHeader = `Basic ${encoded}`;
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
   * Gets the current queue status for both synthesis and analysis requests.
   * @returns An object containing queue statistics.
   */
  async getQueueStatus(): Promise<{
    synthesis: { queued: number; running: number; succeeded: number; failed: number };
    analysis: { queued: number; running: number; succeeded: number; failed: number };
  }> {
    const [synthesisReqs, analysisReqs] = await Promise.all([
      this.listSpeechSynthesisRequests(),
      this.listTextAnalysisRequests(),
    ]);

    const countStates = (reqs: { state: string }[]) => {
      const states = { queued: 0, running: 0, succeeded: 0, failed: 0 };
      for (const req of reqs) {
        if (req.state in states) {
          states[req.state as keyof typeof states]++;
        }
      }
      return states;
    };

    return {
      synthesis: countStates(synthesisReqs),
      analysis: countStates(analysisReqs),
    };
  }

  /**
   * Clears all completed (succeeded or failed) requests from both synthesis and analysis queues.
   */
  async clearAllCompletedRequests(): Promise<void> {
    const [synthesisReqs, analysisReqs] = await Promise.all([
      this.listSpeechSynthesisRequests(),
      this.listTextAnalysisRequests(),
    ]);

    const completedSynthesisReqs = synthesisReqs.filter(
      (r) => r.state === 'succeeded' || r.state === 'failed',
    );
    const completedAnalysisReqs = analysisReqs.filter(
      (r) => r.state === 'succeeded' || r.state === 'failed',
    );

    await Promise.all([
      ...completedSynthesisReqs.map((req) => this.deleteSpeechSynthesisRequest(req.uuid)),
      ...completedAnalysisReqs.map((req) => this.deleteTextAnalysisRequest(req.uuid)),
    ]);
  }

  /**
   * Performs an internal HTTP request to the API.
   * @private
   */
  protected async request<T>(path: string, options: RequestInit = {}): Promise<T> {
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
        (response.status === 200 && response.headers?.get('Content-Length') === '0')
      ) {
        return {} as T;
      }

      // Handle binary data (WAV)
      if (response.headers?.get('Content-Type')?.includes('audio/wav')) {
        return (await response.arrayBuffer()) as T;
      }

      const data = (await response.json()) as any;

      // Log warnings if present in meta information
      if (
        data?.meta?.warnings &&
        Array.isArray(data.meta.warnings) &&
        data.meta.warnings.length > 0
      ) {
        console.warn(`VoiSona Talk API Warning: ${JSON.stringify(data.meta.warnings, null, 2)}`);
      }

      return data as T;
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
}
