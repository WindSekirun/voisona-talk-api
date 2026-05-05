import { join } from 'node:path';
import { mkdirSync } from 'node:fs';
import { replacePronunciation } from '../utils';
import {
  ApiResponse,
  ContentCreated,
  RequestSpeechSynthesisParams,
  RequestState,
  SpeechSynthesisBaseInformation,
  SpeechSynthesisRequest,
  API_CONSTRAINTS,
  Constructor,
} from '../types';

export function SynthesisMixin<TBase extends Constructor>(Base: TBase) {
  return class SynthesisClient extends Base {
    /**
     * Lists all current speech synthesis requests.
     * @returns A list of speech synthesis base information.
     */
    async listSpeechSynthesisRequests(): Promise<SpeechSynthesisBaseInformation[]> {
      const self = this as any as {
        request: <T>(path: string, options?: RequestInit) => Promise<T>;
      };
      const data =
        await self.request<ApiResponse<SpeechSynthesisBaseInformation>>('/speech-syntheses');
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

      const self = this as any as {
        request: <T>(path: string, options?: RequestInit) => Promise<T>;
      };
      return self.request<ContentCreated>('/speech-syntheses', {
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
      const self = this as any as {
        request: <T>(path: string, options?: RequestInit) => Promise<T>;
      };
      return self.request<SpeechSynthesisRequest>(`/speech-syntheses/${uuid}`);
    }

    /**
     * Deletes a specific speech synthesis request.
     * @param uuid The unique ID of the request to delete.
     */
    async deleteSpeechSynthesisRequest(uuid: string): Promise<void> {
      const self = this as any as {
        request: <T>(path: string, options?: RequestInit) => Promise<T>;
      };
      await self.request<void>(`/speech-syntheses/${uuid}`, {
        method: 'DELETE',
      });
    }

    /**
     * Gets the WAV data of synthesized speech.
     * Available only when destination is 'memory' and state is 'succeeded'.
     * @param uuid The unique ID of the request.
     * @returns The WAV data as an ArrayBuffer.
     */
    async getSynthesizedWav(uuid: string): Promise<ArrayBuffer> {
      const self = this as any as {
        request: <T>(path: string, options?: RequestInit) => Promise<T>;
      };
      return self.request<ArrayBuffer>(`/speech-syntheses/${uuid}/wav`);
    }

    /**
     * Clears speech synthesis requests that are in specific states.
     * @param states States to clear. Defaults to ['succeeded', 'failed'].
     */
    async clearSpeechSynthesisRequests(
      states: RequestState[] = ['succeeded', 'failed'],
    ): Promise<void> {
      const reqs = await this.listSpeechSynthesisRequests();
      const targets = reqs.filter((r) => states.includes(r.state as RequestState));
      await Promise.all(targets.map((r) => this.deleteSpeechSynthesisRequest(r.uuid)));
    }

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

      const finalParams: RequestSpeechSynthesisParams = {
        destination: 'file',
        ...params,
      };

      if (finalParams.destination === 'file' && !finalParams.output_file_path) {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 7);
        const outputDir = join(process.cwd(), 'output');

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
    }

    /**
     * Convenience method to request speech synthesis to memory and retrieve the WAV data.
     * @param params Parameters for the synthesis request (destination will be forced to 'memory').
     * @param options Polling and cleanup options.
     * @returns The WAV data as an ArrayBuffer.
     */
    async synthesizeToBuffer(
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
          autoCleanup: false,
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
      const self = this as any;
      const analysis = await self.analyzeAndWait(
        {
          language: params.language,
          text: params.text,
          force_enqueue: params.force_enqueue,
        },
        options,
      );

      let tsml = analysis.analyzed_text || '';

      for (const [word, pronunciation] of Object.entries(pronunciationMap)) {
        tsml = replacePronunciation(tsml, word, pronunciation);
      }

      return this.synthesizeAndWait(
        {
          ...params,
          text: undefined,
          analyzed_text: tsml,
        },
        options,
      );
    }
  };
}
