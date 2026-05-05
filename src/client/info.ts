import {
  ApiResponse,
  VoiceBaseInformation,
  VoiceInformation,
  AudioDeviceInfo,
  Constructor,
} from '../types';

export function InfoMixin<TBase extends Constructor>(Base: TBase) {
  return class InfoClient extends Base {
    /**
     * Lists all available voice libraries.
     * @returns A list of voice libraries.
     */
    async listVoices(): Promise<VoiceBaseInformation[]> {
      const self = this as any as {
        request: <T>(path: string, options?: RequestInit) => Promise<T>;
      };
      const data = await self.request<ApiResponse<VoiceBaseInformation>>('/voices');
      return data.items ?? [];
    }

    /**
     * Retrieves detailed information about a specific voice library.
     * @param name The name of the voice library.
     * @param version The version of the voice library.
     * @returns Detailed voice information.
     */
    async getVoiceInformation(name: string, version: string): Promise<VoiceInformation> {
      const self = this as any as {
        request: <T>(path: string, options?: RequestInit) => Promise<T>;
      };
      return self.request<VoiceInformation>(`/voices/${name}/${version}`);
    }

    /**
     * Lists all supported languages.
     * @returns A list of language codes.
     */
    async listLanguages(): Promise<string[]> {
      const self = this as any as {
        request: <T>(path: string, options?: RequestInit) => Promise<T>;
      };
      const data = await self.request<{ items: { language: string }[] }>('/languages');
      return (data.items ?? []).map((i) => i.language);
    }

    /**
     * Gets information about the default audio output device.
     * @returns Information about the default audio device.
     */
    async getDefaultAudioDevice(): Promise<AudioDeviceInfo> {
      const self = this as any as {
        request: <T>(path: string, options?: RequestInit) => Promise<T>;
      };
      return self.request<AudioDeviceInfo>('/audio-devices/default');
    }

    /**
     * Helper to create a style_weights array from a mapping of style names to weights.
     * @param voiceInfo Detailed voice information containing style_names.
     * @param styleWeightsMap A record of style names and their corresponding weights (0.0 to 1.0).
     * @returns A number array representing the style weights in the correct order.
     */
    getStyleWeights(
      voiceInfo: VoiceInformation,
      styleWeightsMap: Record<string, number>,
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
  };
}
