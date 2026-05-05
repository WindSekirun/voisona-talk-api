import { BaseVoisonaClient } from './base';
import { AnalysisMixin } from './analysis';
import { SynthesisMixin } from './synthesis';
import { InfoMixin } from './info';

const MixedClient = InfoMixin(SynthesisMixin(AnalysisMixin(BaseVoisonaClient)));

/**
 * Client for interacting with the VoiSona Talk API.
 * Combines functionality from Analysis, Synthesis, and Information modules.
 */
export class VoisonaClient extends MixedClient {
  /**
   * Checks if the VoiSona Talk service is currently running and reachable.
   * @returns True if the service is running, false otherwise.
   */
  async isServiceRunning(): Promise<boolean> {
    try {
      await this.request('/languages');
      return true;
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
}

export type { VoisonaClientConfig } from './base';
