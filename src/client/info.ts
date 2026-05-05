import { VoisonaClient } from './base';
import { ApiResponse, VoiceBaseInformation, VoiceInformation, AudioDeviceInfo } from '../types';

// Extend the base class with info methods
declare module './base' {
  interface VoisonaClient {
    // --- Information ---

    /**
     * Lists all available voice libraries.
     * @returns A list of voice libraries.
     */
    listVoices(): Promise<VoiceBaseInformation[]>;

    /**
     * Retrieves detailed information about a specific voice library.
     * @param name The name of the voice library.
     * @param version The version of the voice library.
     * @returns Detailed voice information.
     */
    getVoiceInformation(name: string, version: string): Promise<VoiceInformation>;

    /**
     * Lists all supported languages.
     * @returns A list of language codes.
     */
    listLanguages(): Promise<string[]>;

    /**
     * Gets information about the default audio output device.
     * @returns Information about the default audio device.
     */
    getDefaultAudioDevice(): Promise<AudioDeviceInfo>;

    /**
     * Helper to create a style_weights array from a mapping of style names to weights.
     * @param voiceInfo Detailed voice information containing style_names.
     * @param styleWeightsMap A record of style names and their corresponding weights (0.0 to 1.0).
     * @returns A number array representing the style weights in the correct order.
     */
    getStyleWeights(voiceInfo: VoiceInformation, styleWeightsMap: Record<string, number>): number[];
  }
}

// Implementation
VoisonaClient.prototype.listVoices = async function (): Promise<VoiceBaseInformation[]> {
  const data = await this.request<ApiResponse<VoiceBaseInformation>>('/voices');
  return data.items ?? [];
};

VoisonaClient.prototype.getVoiceInformation = async function (
  name: string,
  version: string,
): Promise<VoiceInformation> {
  return this.request<VoiceInformation>(`/voices/${name}/${version}`);
};

VoisonaClient.prototype.listLanguages = async function (): Promise<string[]> {
  const data = await this.request<{ items: { language: string }[] }>('/languages');
  return (data.items ?? []).map((i) => i.language);
};

VoisonaClient.prototype.getDefaultAudioDevice = async function (): Promise<AudioDeviceInfo> {
  return this.request<AudioDeviceInfo>('/audio-devices/default');
};

// Helper method for info
VoisonaClient.prototype.getStyleWeights = function (
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
};
