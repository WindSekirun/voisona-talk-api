[**voisona-talk-api**](../index.md)

***

[voisona-talk-api](../index.md) / VoisonaClient

# Class: VoisonaClient

Defined in: [client/index.ts:12](https://github.com/WindSekirun/voisona-talk-api/blob/83850048b1f8b6d08a05f35d6a672bdff5c3e358/src/client/index.ts#L12)

Client for interacting with the VoiSona Talk API.
Combines functionality from Analysis, Synthesis, and Information modules.

## Extends

- `MixedClient`

## Constructors

### Constructor

> **new VoisonaClient**(`config`): `VoisonaClient`

Defined in: [client/base.ts:27](https://github.com/WindSekirun/voisona-talk-api/blob/83850048b1f8b6d08a05f35d6a672bdff5c3e358/src/client/base.ts#L27)

Initializes a new instance of the VoisonaClient.

#### Parameters

##### config

[`VoisonaClientConfig`](../interfaces/VoisonaClientConfig.md)

Configuration options for the client.

#### Returns

`VoisonaClient`

#### Throws

Error if email or password are missing.

#### Inherited from

`MixedClient.constructor`

## Properties

### authHeader

> `protected` `readonly` **authHeader**: `string`

Defined in: [client/base.ts:20](https://github.com/WindSekirun/voisona-talk-api/blob/83850048b1f8b6d08a05f35d6a672bdff5c3e358/src/client/base.ts#L20)

#### Inherited from

`MixedClient.authHeader`

***

### baseUrl

> `protected` `readonly` **baseUrl**: `string`

Defined in: [client/base.ts:19](https://github.com/WindSekirun/voisona-talk-api/blob/83850048b1f8b6d08a05f35d6a672bdff5c3e358/src/client/base.ts#L19)

#### Inherited from

`MixedClient.baseUrl`

## Methods

### analyzeAndWait()

> **analyzeAndWait**(`params`, `options?`): `Promise`\<[`TextAnalysisRequest`](../interfaces/TextAnalysisRequest.md)\>

Defined in: [client/analysis.ts:86](https://github.com/WindSekirun/voisona-talk-api/blob/83850048b1f8b6d08a05f35d6a672bdff5c3e358/src/client/analysis.ts#L86)

Convenience method to request text analysis and wait for it to succeed.

#### Parameters

##### params

[`RequestTextAnalysisParams`](../interfaces/RequestTextAnalysisParams.md)

Parameters for the analysis request.

##### options?

Polling options.

###### autoCleanup?

`boolean`

###### onProgress?

(`percentage`) => `void`

###### pollInterval?

`number`

###### timeout?

`number`

#### Returns

`Promise`\<[`TextAnalysisRequest`](../interfaces/TextAnalysisRequest.md)\>

The final successful text analysis request result.

#### Throws

Error if analysis fails or times out.

#### Inherited from

`MixedClient.analyzeAndWait`

***

### bulkSynthesize()

> **bulkSynthesize**(`items`, `options?`): `Promise`\<[`SpeechSynthesisRequest`](../interfaces/SpeechSynthesisRequest.md)[]\>

Defined in: [client/synthesis.ts:256](https://github.com/WindSekirun/voisona-talk-api/blob/83850048b1f8b6d08a05f35d6a672bdff5c3e358/src/client/synthesis.ts#L256)

Convenience method to process multiple synthesis requests with concurrency control.

#### Parameters

##### items

[`RequestSpeechSynthesisParams`](../interfaces/RequestSpeechSynthesisParams.md)[]

List of synthesis request parameters.

##### options?

Concurrency and polling options.

###### autoCleanup?

`boolean`

###### concurrency?

`number`

###### onProgress?

(`percentage`) => `void`

###### pollInterval?

`number`

###### timeout?

`number`

#### Returns

`Promise`\<[`SpeechSynthesisRequest`](../interfaces/SpeechSynthesisRequest.md)[]\>

A list of all successful synthesis results.

#### Inherited from

`MixedClient.bulkSynthesize`

***

### clearAllCompletedRequests()

> **clearAllCompletedRequests**(): `Promise`\<`void`\>

Defined in: [client/index.ts:58](https://github.com/WindSekirun/voisona-talk-api/blob/83850048b1f8b6d08a05f35d6a672bdff5c3e358/src/client/index.ts#L58)

Clears all completed (succeeded or failed) requests from both synthesis and analysis queues.

#### Returns

`Promise`\<`void`\>

***

### clearSpeechSynthesisRequests()

> **clearSpeechSynthesisRequests**(`states?`): `Promise`\<`void`\>

Defined in: [client/synthesis.ts:131](https://github.com/WindSekirun/voisona-talk-api/blob/83850048b1f8b6d08a05f35d6a672bdff5c3e358/src/client/synthesis.ts#L131)

Clears speech synthesis requests that are in specific states.

#### Parameters

##### states?

[`RequestState`](../type-aliases/RequestState.md)[] = `...`

States to clear. Defaults to ['succeeded', 'failed'].

#### Returns

`Promise`\<`void`\>

#### Inherited from

`MixedClient.clearSpeechSynthesisRequests`

***

### clearTextAnalysisRequests()

> **clearTextAnalysisRequests**(`states?`): `Promise`\<`void`\>

Defined in: [client/analysis.ts:73](https://github.com/WindSekirun/voisona-talk-api/blob/83850048b1f8b6d08a05f35d6a672bdff5c3e358/src/client/analysis.ts#L73)

Clears text analysis requests that are in specific states.

#### Parameters

##### states?

[`RequestState`](../type-aliases/RequestState.md)[] = `...`

States to clear. Defaults to ['succeeded', 'failed'].

#### Returns

`Promise`\<`void`\>

#### Inherited from

`MixedClient.clearTextAnalysisRequests`

***

### deleteSpeechSynthesisRequest()

> **deleteSpeechSynthesisRequest**(`uuid`): `Promise`\<`void`\>

Defined in: [client/synthesis.ts:109](https://github.com/WindSekirun/voisona-talk-api/blob/83850048b1f8b6d08a05f35d6a672bdff5c3e358/src/client/synthesis.ts#L109)

Deletes a specific speech synthesis request.

#### Parameters

##### uuid

`string`

The unique ID of the request to delete.

#### Returns

`Promise`\<`void`\>

#### Inherited from

`MixedClient.deleteSpeechSynthesisRequest`

***

### deleteTextAnalysisRequest()

> **deleteTextAnalysisRequest**(`uuid`): `Promise`\<`void`\>

Defined in: [client/analysis.ts:62](https://github.com/WindSekirun/voisona-talk-api/blob/83850048b1f8b6d08a05f35d6a672bdff5c3e358/src/client/analysis.ts#L62)

Deletes a specific text analysis request.

#### Parameters

##### uuid

`string`

The unique ID of the request to delete.

#### Returns

`Promise`\<`void`\>

#### Inherited from

`MixedClient.deleteTextAnalysisRequest`

***

### getDefaultAudioDevice()

> **getDefaultAudioDevice**(): `Promise`\<[`AudioDeviceInfo`](../interfaces/AudioDeviceInfo.md)\>

Defined in: [client/info.ts:46](https://github.com/WindSekirun/voisona-talk-api/blob/83850048b1f8b6d08a05f35d6a672bdff5c3e358/src/client/info.ts#L46)

Gets information about the default audio output device.

#### Returns

`Promise`\<[`AudioDeviceInfo`](../interfaces/AudioDeviceInfo.md)\>

Information about the default audio device.

#### Inherited from

`MixedClient.getDefaultAudioDevice`

***

### getQueueStatus()

> **getQueueStatus**(): `Promise`\<\{ `analysis`: \{ `failed`: `number`; `queued`: `number`; `running`: `number`; `succeeded`: `number`; \}; `synthesis`: \{ `failed`: `number`; `queued`: `number`; `running`: `number`; `succeeded`: `number`; \}; \}\>

Defined in: [client/index.ts:30](https://github.com/WindSekirun/voisona-talk-api/blob/83850048b1f8b6d08a05f35d6a672bdff5c3e358/src/client/index.ts#L30)

Gets the current queue status for both synthesis and analysis requests.

#### Returns

`Promise`\<\{ `analysis`: \{ `failed`: `number`; `queued`: `number`; `running`: `number`; `succeeded`: `number`; \}; `synthesis`: \{ `failed`: `number`; `queued`: `number`; `running`: `number`; `succeeded`: `number`; \}; \}\>

An object containing queue statistics.

***

### getSpeechSynthesisRequest()

> **getSpeechSynthesisRequest**(`uuid`): `Promise`\<[`SpeechSynthesisRequest`](../interfaces/SpeechSynthesisRequest.md)\>

Defined in: [client/synthesis.ts:100](https://github.com/WindSekirun/voisona-talk-api/blob/83850048b1f8b6d08a05f35d6a672bdff5c3e358/src/client/synthesis.ts#L100)

Retrieves detailed information about a specific speech synthesis request.

#### Parameters

##### uuid

`string`

The unique ID of the request.

#### Returns

`Promise`\<[`SpeechSynthesisRequest`](../interfaces/SpeechSynthesisRequest.md)\>

Detailed information about the synthesis request.

#### Inherited from

`MixedClient.getSpeechSynthesisRequest`

***

### getStyleWeights()

> **getStyleWeights**(`voiceInfo`, `styleWeightsMap`): `number`[]

Defined in: [client/info.ts:57](https://github.com/WindSekirun/voisona-talk-api/blob/83850048b1f8b6d08a05f35d6a672bdff5c3e358/src/client/info.ts#L57)

Helper to create a style_weights array from a mapping of style names to weights.

#### Parameters

##### voiceInfo

[`VoiceInformation`](../interfaces/VoiceInformation.md)

Detailed voice information containing style_names.

##### styleWeightsMap

`Record`\<`string`, `number`\>

A record of style names and their corresponding weights (0.0 to 1.0).

#### Returns

`number`[]

A number array representing the style weights in the correct order.

#### Inherited from

`MixedClient.getStyleWeights`

***

### getSynthesizedWav()

> **getSynthesizedWav**(`uuid`): `Promise`\<`ArrayBuffer`\>

Defined in: [client/synthesis.ts:122](https://github.com/WindSekirun/voisona-talk-api/blob/83850048b1f8b6d08a05f35d6a672bdff5c3e358/src/client/synthesis.ts#L122)

Gets the WAV data of synthesized speech.
Available only when destination is 'memory' and state is 'succeeded'.

#### Parameters

##### uuid

`string`

The unique ID of the request.

#### Returns

`Promise`\<`ArrayBuffer`\>

The WAV data as an ArrayBuffer.

#### Inherited from

`MixedClient.getSynthesizedWav`

***

### getTextAnalysisRequest()

> **getTextAnalysisRequest**(`uuid`): `Promise`\<[`TextAnalysisRequest`](../interfaces/TextAnalysisRequest.md)\>

Defined in: [client/analysis.ts:53](https://github.com/WindSekirun/voisona-talk-api/blob/83850048b1f8b6d08a05f35d6a672bdff5c3e358/src/client/analysis.ts#L53)

Retrieves detailed information and results of a specific text analysis request.

#### Parameters

##### uuid

`string`

The unique ID of the request.

#### Returns

`Promise`\<[`TextAnalysisRequest`](../interfaces/TextAnalysisRequest.md)\>

Detailed information and results of the analysis.

#### Inherited from

`MixedClient.getTextAnalysisRequest`

***

### getVoiceInformation()

> **getVoiceInformation**(`name`, `version`): `Promise`\<[`VoiceInformation`](../interfaces/VoiceInformation.md)\>

Defined in: [client/info.ts:27](https://github.com/WindSekirun/voisona-talk-api/blob/83850048b1f8b6d08a05f35d6a672bdff5c3e358/src/client/info.ts#L27)

Retrieves detailed information about a specific voice library.

#### Parameters

##### name

`string`

The name of the voice library.

##### version

`string`

The version of the voice library.

#### Returns

`Promise`\<[`VoiceInformation`](../interfaces/VoiceInformation.md)\>

Detailed voice information.

#### Inherited from

`MixedClient.getVoiceInformation`

***

### isServiceRunning()

> **isServiceRunning**(): `Promise`\<`boolean`\>

Defined in: [client/index.ts:17](https://github.com/WindSekirun/voisona-talk-api/blob/83850048b1f8b6d08a05f35d6a672bdff5c3e358/src/client/index.ts#L17)

Checks if the VoiSona Talk service is currently running and reachable.

#### Returns

`Promise`\<`boolean`\>

True if the service is running, false otherwise.

***

### listLanguages()

> **listLanguages**(): `Promise`\<`string`[]\>

Defined in: [client/info.ts:36](https://github.com/WindSekirun/voisona-talk-api/blob/83850048b1f8b6d08a05f35d6a672bdff5c3e358/src/client/info.ts#L36)

Lists all supported languages.

#### Returns

`Promise`\<`string`[]\>

A list of language codes.

#### Inherited from

`MixedClient.listLanguages`

***

### listSpeechSynthesisRequests()

> **listSpeechSynthesisRequests**(): `Promise`\<[`SpeechSynthesisBaseInformation`](../interfaces/SpeechSynthesisBaseInformation.md)[]\>

Defined in: [client/synthesis.ts:21](https://github.com/WindSekirun/voisona-talk-api/blob/83850048b1f8b6d08a05f35d6a672bdff5c3e358/src/client/synthesis.ts#L21)

Lists all current speech synthesis requests.

#### Returns

`Promise`\<[`SpeechSynthesisBaseInformation`](../interfaces/SpeechSynthesisBaseInformation.md)[]\>

A list of speech synthesis base information.

#### Inherited from

`MixedClient.listSpeechSynthesisRequests`

***

### listTextAnalysisRequests()

> **listTextAnalysisRequests**(): `Promise`\<[`TextAnalysisBaseInformation`](../interfaces/TextAnalysisBaseInformation.md)[]\>

Defined in: [client/analysis.ts:18](https://github.com/WindSekirun/voisona-talk-api/blob/83850048b1f8b6d08a05f35d6a672bdff5c3e358/src/client/analysis.ts#L18)

Lists all current text analysis requests.

#### Returns

`Promise`\<[`TextAnalysisBaseInformation`](../interfaces/TextAnalysisBaseInformation.md)[]\>

A list of text analysis base information.

#### Inherited from

`MixedClient.listTextAnalysisRequests`

***

### listVoices()

> **listVoices**(): `Promise`\<[`VoiceBaseInformation`](../interfaces/VoiceBaseInformation.md)[]\>

Defined in: [client/info.ts:15](https://github.com/WindSekirun/voisona-talk-api/blob/83850048b1f8b6d08a05f35d6a672bdff5c3e358/src/client/info.ts#L15)

Lists all available voice libraries.

#### Returns

`Promise`\<[`VoiceBaseInformation`](../interfaces/VoiceBaseInformation.md)[]\>

A list of voice libraries.

#### Inherited from

`MixedClient.listVoices`

***

### requestSpeechSynthesis()

> **requestSpeechSynthesis**(`params`): `Promise`\<[`ContentCreated`](../interfaces/ContentCreated.md)\>

Defined in: [client/synthesis.ts:33](https://github.com/WindSekirun/voisona-talk-api/blob/83850048b1f8b6d08a05f35d6a672bdff5c3e358/src/client/synthesis.ts#L33)

Requests a new speech synthesis. This enqueues the request.

#### Parameters

##### params

[`RequestSpeechSynthesisParams`](../interfaces/RequestSpeechSynthesisParams.md)

Parameters for the synthesis request.

#### Returns

`Promise`\<[`ContentCreated`](../interfaces/ContentCreated.md)\>

The created request information including its UUID.

#### Throws

Error if validation fails.

#### Inherited from

`MixedClient.requestSpeechSynthesis`

***

### requestTextAnalysis()

> **requestTextAnalysis**(`params`): `Promise`\<[`ContentCreated`](../interfaces/ContentCreated.md)\>

Defined in: [client/analysis.ts:30](https://github.com/WindSekirun/voisona-talk-api/blob/83850048b1f8b6d08a05f35d6a672bdff5c3e358/src/client/analysis.ts#L30)

Requests a new text analysis for speech synthesis.

#### Parameters

##### params

[`RequestTextAnalysisParams`](../interfaces/RequestTextAnalysisParams.md)

Parameters for the analysis request.

#### Returns

`Promise`\<[`ContentCreated`](../interfaces/ContentCreated.md)\>

The created request information including its UUID.

#### Throws

Error if validation fails.

#### Inherited from

`MixedClient.requestTextAnalysis`

***

### synthesizeAndWait()

> **synthesizeAndWait**(`params`, `options?`): `Promise`\<[`SpeechSynthesisRequest`](../interfaces/SpeechSynthesisRequest.md)\>

Defined in: [client/synthesis.ts:144](https://github.com/WindSekirun/voisona-talk-api/blob/83850048b1f8b6d08a05f35d6a672bdff5c3e358/src/client/synthesis.ts#L144)

Convenience method to request speech synthesis and wait for it to succeed.

#### Parameters

##### params

[`RequestSpeechSynthesisParams`](../interfaces/RequestSpeechSynthesisParams.md)

Parameters for the synthesis request.

##### options?

Polling options.

###### autoCleanup?

`boolean`

###### onProgress?

(`percentage`) => `void`

###### pollInterval?

`number`

###### timeout?

`number`

#### Returns

`Promise`\<[`SpeechSynthesisRequest`](../interfaces/SpeechSynthesisRequest.md)\>

The final successful speech synthesis request result.

#### Throws

Error if synthesis fails or times out.

#### Inherited from

`MixedClient.synthesizeAndWait`

***

### synthesizeToBuffer()

> **synthesizeToBuffer**(`params`, `options?`): `Promise`\<`ArrayBuffer`\>

Defined in: [client/synthesis.ts:214](https://github.com/WindSekirun/voisona-talk-api/blob/83850048b1f8b6d08a05f35d6a672bdff5c3e358/src/client/synthesis.ts#L214)

Convenience method to request speech synthesis to memory and retrieve the WAV data.

#### Parameters

##### params

[`RequestSpeechSynthesisParams`](../interfaces/RequestSpeechSynthesisParams.md)

Parameters for the synthesis request (destination will be forced to 'memory').

##### options?

Polling and cleanup options.

###### autoCleanup?

`boolean`

###### onProgress?

(`percentage`) => `void`

###### pollInterval?

`number`

###### timeout?

`number`

#### Returns

`Promise`\<`ArrayBuffer`\>

The WAV data as an ArrayBuffer.

#### Inherited from

`MixedClient.synthesizeToBuffer`

***

### synthesizeWithPronunciation()

> **synthesizeWithPronunciation**(`params`, `pronunciationMap`, `options?`): `Promise`\<[`SpeechSynthesisRequest`](../interfaces/SpeechSynthesisRequest.md)\>

Defined in: [client/synthesis.ts:288](https://github.com/WindSekirun/voisona-talk-api/blob/83850048b1f8b6d08a05f35d6a672bdff5c3e358/src/client/synthesis.ts#L288)

Convenience method to request speech synthesis with custom pronunciations for specific words.

#### Parameters

##### params

[`RequestSpeechSynthesisParams`](../interfaces/RequestSpeechSynthesisParams.md) & `object`

Parameters for the synthesis request (text is required).

##### pronunciationMap

`Record`\<`string`, `string`\>

A record where keys are words and values are their desired Katakana pronunciations.

##### options?

Polling options.

###### autoCleanup?

`boolean`

###### onProgress?

(`percentage`) => `void`

###### pollInterval?

`number`

###### timeout?

`number`

#### Returns

`Promise`\<[`SpeechSynthesisRequest`](../interfaces/SpeechSynthesisRequest.md)\>

The final successful speech synthesis request result.

#### Inherited from

`MixedClient.synthesizeWithPronunciation`
