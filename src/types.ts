/**
 * VoiSona Talk API Types (v0.9.0)
 */

/**
 * State of a speech synthesis or text analysis request.
 */
export type RequestState = 'queued' | 'running' | 'succeeded' | 'failed';

/**
 * Destination of the synthesized speech sound.
 */
export type Destination = 'audio_device' | 'file';

/**
 * Metadata information containing warnings.
 */
export interface MetaInformation {
  /** Array of warning objects. */
  warnings?: Array<Record<string, unknown>>;
}

/**
 * Global parameters for speech synthesis.
 */
export interface GlobalParameters {
  /** 
   * Age-like parameter (frequency warping). 
   * Range: -1 to 1. Default: 0. 
   */
  alp?: number;
  /** 
   * Huskiness control parameter. 
   * Range: -20 to 20. Default: 0. 
   */
  huskiness?: number;
  /** 
   * Scale factor for pitch contour variation. 
   * Range: 0 to 2. Default: 1. 
   */
  intonation?: number;
  /** 
   * Pitch shift coefficient in cents. 
   * Range: -600 to 600. Default: 0. 
   */
  pitch?: number;
  /** 
   * Speech rate (speed). 
   * Range: 0.2 to 5. Default: 1. 
   */
  speed?: number;
  /** 
   * Array of style weight coefficients. 
   * Typically sums to 1.0. 
   */
  style_weights?: number[];
  /** 
   * Amplitude multiplier in decibels. 
   * Range: -8 to 8. Default: 0. 
   */
  volume?: number;
}

/**
 * Base information for a speech synthesis request.
 */
export interface SpeechSynthesisBaseInformation {
  /** Destination of the synthesized sound. */
  destination: Destination;
  /** Language code (e.g., "ja_JP"). */
  language: string;
  /** Absolute path to the output WAV file. Meaningful only if destination is 'file'. */
  output_file_path?: string;
  /** Progress of the request (0 to 100). */
  progress_percentage: number;
  /** Current state of the request. */
  state: RequestState;
  /** Source text for synthesis. */
  text: string;
  /** Unique ID for the request. */
  uuid: string;
}

/**
 * Detailed information for a speech synthesis request.
 */
export interface SpeechSynthesisRequest extends SpeechSynthesisBaseInformation {
  /** TSML analyzed text used for synthesis. */
  analyzed_text?: string;
  /** Duration of the synthetic sound in seconds. */
  duration?: number;
  /** Global parameters used for synthesis. */
  global_parameters?: GlobalParameters;
  /** Array of phoneme labels. */
  phonemes?: string[];
  /** Array of phoneme durations in seconds. */
  phoneme_durations?: number[];
  /** Name of the voice library used. */
  voice_name?: string;
  /** Version of the voice library used. */
  voice_version?: string;
  /** Metadata information. */
  meta?: MetaInformation;
}

/**
 * Base information for a text analysis request.
 */
export interface TextAnalysisBaseInformation {
  /** Progress of the analysis (0 to 100). */
  progress_percentage: number;
  /** Current state of the request. */
  state: RequestState;
  /** Source text for analysis. */
  text: string;
  /** Unique ID for the request. */
  uuid: string;
}

/**
 * Detailed information and results of a text analysis request.
 */
export interface TextAnalysisRequest extends TextAnalysisBaseInformation {
  /** Linguistic and prosodic data analyzed from text (TSML). */
  analyzed_text?: string;
  /** Metadata information. */
  meta?: MetaInformation;
}

/**
 * Base information about a voice library.
 */
export interface VoiceBaseInformation {
  /** Display names in different languages. */
  display_names: Array<{
    language: string;
    name: string;
  }>;
  /** Supported languages. */
  languages: string[];
  /** Internal name of the voice library. */
  voice_name: string;
  /** Version string of the voice library. */
  voice_version: string;
}

/**
 * Detailed information about a voice library, including styles.
 */
export interface VoiceInformation extends VoiceBaseInformation {
  /** Default weights for each style. */
  default_style_weights: number[];
  /** Names of the available styles. */
  style_names: string[];
  /** Metadata information. */
  meta?: MetaInformation;
}

/**
 * Parameters for requesting speech synthesis.
 */
export interface RequestSpeechSynthesisParams {
  /** Language code (e.g., "ja_JP"). Required. */
  language: string;
  /** 
   * Source text. Max 500 characters. 
   * Required if analyzed_text is not provided. 
   */
  text?: string;
  /** 
   * TSML analyzed text. Max 50000 characters. 
   * If provided, 'text' is ignored. 
   */
  analyzed_text?: string;
  /** Destination of the output sound. Defaults to 'audio_device'. */
  destination?: Destination;
  /** Absolute path for output file. Required if destination is 'file'. */
  output_file_path?: string;
  /** Whether to overwrite the output file. Defaults to false. */
  can_overwrite_file?: boolean;
  /** Whether to force enqueue by removing old requests. Defaults to false. */
  force_enqueue?: boolean;
  /** Global synthesis parameters. */
  global_parameters?: GlobalParameters;
  /** Specific voice name to use. */
  voice_name?: string;
  /** Specific voice version to use. */
  voice_version?: string;
}

/**
 * Parameters for requesting text analysis.
 */
export interface RequestTextAnalysisParams {
  /** Language code (e.g., "ja_JP"). Required. */
  language: string;
  /** Text to analyze. Min 1, Max 500 characters. */
  text: string;
  /** Whether to force enqueue by removing old requests. Defaults to false. */
  force_enqueue?: boolean;
}

/**
 * Generic API response structure for lists.
 */
export interface ApiResponse<T> {
  /** List of items. */
  items?: T[];
  /** Metadata information. */
  meta?: MetaInformation;
}

/**
 * Response for a successful request creation.
 */
export interface ContentCreated {
  /** UUID of the created request. */
  uuid: string;
  /** Metadata information. */
  meta?: MetaInformation;
}

/**
 * Error response structure following Problem Details for HTTP APIs.
 */
export interface ErrorResponse {
  /** HTTP status code. */
  status: number;
  /** Short summary of the error. */
  title: string;
  /** Detailed explanation of the error. */
  detail: string;
  /** Metadata information. */
  meta?: MetaInformation;
}

/**
 * API Constraints according to the OpenAPI specification.
 */
export const API_CONSTRAINTS = {
  TEXT_MAX_LENGTH: 500,
  ANALYZED_TEXT_MAX_LENGTH: 50000,
  POLL_INTERVAL_DEFAULT: 1000,
  POLL_TIMEOUT_DEFAULT: 60000,
} as const;
