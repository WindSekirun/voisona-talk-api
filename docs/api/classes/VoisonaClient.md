[**voisona-talk-api**](../index.md)

***

[voisona-talk-api](../index.md) / VoisonaClient

# Class: VoisonaClient

Defined in: [client.ts:35](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/client.ts#L35)

Client for interacting with the VoiSona Talk API.

## Constructors

### Constructor

> **new VoisonaClient**(`config`): `VoisonaClient`

Defined in: [client.ts:44](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/client.ts#L44)

Initializes a new instance of the VoisonaClient.

#### Parameters

##### config

[`VoisonaClientConfig`](../interfaces/VoisonaClientConfig.md)

Configuration options for the client.

#### Returns

`VoisonaClient`

#### Throws

Error if email or password are missing.

## Methods

### analyzeAndWait()

> **analyzeAndWait**(`params`, `options?`): `Promise`\<[`TextAnalysisRequest`](../interfaces/TextAnalysisRequest.md)\>

Defined in: [client.ts:385](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/client.ts#L385)

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

***

### bulkSynthesize()

> **bulkSynthesize**(`items`, `options?`): `Promise`\<[`SpeechSynthesisRequest`](../interfaces/SpeechSynthesisRequest.md)[]\>

Defined in: [client.ts:431](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/client.ts#L431)

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

***

### clearAllCompletedRequests()

> **clearAllCompletedRequests**(): `Promise`\<`void`\>

Defined in: [client.ts:574](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/client.ts#L574)

Clears all completed (succeeded or failed) requests from both synthesis and analysis queues.

#### Returns

`Promise`\<`void`\>

***

### clearSpeechSynthesisRequests()

> **clearSpeechSynthesisRequests**(`states?`): `Promise`\<`void`\>

Defined in: [client.ts:553](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/client.ts#L553)

Clears speech synthesis requests that are in specific states.

#### Parameters

##### states?

[`RequestState`](../type-aliases/RequestState.md)[] = `...`

States to clear. Defaults to ['succeeded', 'failed'].

#### Returns

`Promise`\<`void`\>

***

### clearTextAnalysisRequests()

> **clearTextAnalysisRequests**(`states?`): `Promise`\<`void`\>

Defined in: [client.ts:565](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/client.ts#L565)

Clears text analysis requests that are in specific states.

#### Parameters

##### states?

[`RequestState`](../type-aliases/RequestState.md)[] = `...`

States to clear. Defaults to ['succeeded', 'failed'].

#### Returns

`Promise`\<`void`\>

***

### deleteSpeechSynthesisRequest()

> **deleteSpeechSynthesisRequest**(`uuid`): `Promise`\<`void`\>

Defined in: [client.ts:214](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/client.ts#L214)

Deletes a specific speech synthesis request.

#### Parameters

##### uuid

`string`

The unique ID of the request to delete.

#### Returns

`Promise`\<`void`\>

***

### deleteTextAnalysisRequest()

> **deleteTextAnalysisRequest**(`uuid`): `Promise`\<`void`\>

Defined in: [client.ts:267](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/client.ts#L267)

Deletes a specific text analysis request.

#### Parameters

##### uuid

`string`

The unique ID of the request to delete.

#### Returns

`Promise`\<`void`\>

***

### getQueueStatus()

> **getQueueStatus**(): `Promise`\<\{ `analysis`: `Record`\<[`RequestState`](../type-aliases/RequestState.md), `number`\>; `synthesis`: `Record`\<[`RequestState`](../type-aliases/RequestState.md), `number`\>; \}\>

Defined in: [client.ts:524](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/client.ts#L524)

Retrieves the current status summary of the request queue.

#### Returns

`Promise`\<\{ `analysis`: `Record`\<[`RequestState`](../type-aliases/RequestState.md), `number`\>; `synthesis`: `Record`\<[`RequestState`](../type-aliases/RequestState.md), `number`\>; \}\>

Counts of requests in each state.

***

### getSpeechSynthesisRequest()

> **getSpeechSynthesisRequest**(`uuid`): `Promise`\<[`SpeechSynthesisRequest`](../interfaces/SpeechSynthesisRequest.md)\>

Defined in: [client.ts:206](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/client.ts#L206)

Retrieves detailed information about a specific speech synthesis request.

#### Parameters

##### uuid

`string`

The unique ID of the request.

#### Returns

`Promise`\<[`SpeechSynthesisRequest`](../interfaces/SpeechSynthesisRequest.md)\>

Detailed information about the synthesis request.

***

### getStyleWeights()

> **getStyleWeights**(`voiceInfo`, `styleWeightsMap`): `number`[]

Defined in: [client.ts:507](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/client.ts#L507)

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

***

### getTextAnalysisRequest()

> **getTextAnalysisRequest**(`uuid`): `Promise`\<[`TextAnalysisRequest`](../interfaces/TextAnalysisRequest.md)\>

Defined in: [client.ts:259](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/client.ts#L259)

Retrieves detailed information and results of a specific text analysis request.

#### Parameters

##### uuid

`string`

The unique ID of the request.

#### Returns

`Promise`\<[`TextAnalysisRequest`](../interfaces/TextAnalysisRequest.md)\>

Detailed information and results of the analysis.

***

### getVoiceInformation()

> **getVoiceInformation**(`name`, `version`): `Promise`\<[`VoiceInformation`](../interfaces/VoiceInformation.md)\>

Defined in: [client.ts:290](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/client.ts#L290)

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

***

### isServiceRunning()

> **isServiceRunning**(): `Promise`\<`boolean`\>

Defined in: [client.ts:64](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/client.ts#L64)

Checks if the VoiSona Talk service is currently running and reachable.

#### Returns

`Promise`\<`boolean`\>

True if the service is running, false otherwise.

***

### listLanguages()

> **listLanguages**(): `Promise`\<`string`[]\>

Defined in: [client.ts:298](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/client.ts#L298)

Lists all supported languages.

#### Returns

`Promise`\<`string`[]\>

A list of language codes.

***

### listSpeechSynthesisRequests()

> **listSpeechSynthesisRequests**(): `Promise`\<[`SpeechSynthesisBaseInformation`](../interfaces/SpeechSynthesisBaseInformation.md)[]\>

Defined in: [client.ts:141](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/client.ts#L141)

Lists all current speech synthesis requests.

#### Returns

`Promise`\<[`SpeechSynthesisBaseInformation`](../interfaces/SpeechSynthesisBaseInformation.md)[]\>

A list of speech synthesis base information.

***

### listTextAnalysisRequests()

> **listTextAnalysisRequests**(): `Promise`\<[`TextAnalysisBaseInformation`](../interfaces/TextAnalysisBaseInformation.md)[]\>

Defined in: [client.ts:226](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/client.ts#L226)

Lists all current text analysis requests.

#### Returns

`Promise`\<[`TextAnalysisBaseInformation`](../interfaces/TextAnalysisBaseInformation.md)[]\>

A list of text analysis base information.

***

### listVoices()

> **listVoices**(): `Promise`\<[`VoiceBaseInformation`](../interfaces/VoiceBaseInformation.md)[]\>

Defined in: [client.ts:279](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/client.ts#L279)

Lists all available voice libraries.

#### Returns

`Promise`\<[`VoiceBaseInformation`](../interfaces/VoiceBaseInformation.md)[]\>

A list of voice libraries.

***

### requestSpeechSynthesis()

> **requestSpeechSynthesis**(`params`): `Promise`\<[`ContentCreated`](../interfaces/ContentCreated.md)\>

Defined in: [client.ts:153](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/client.ts#L153)

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

***

### requestTextAnalysis()

> **requestTextAnalysis**(`params`): `Promise`\<[`ContentCreated`](../interfaces/ContentCreated.md)\>

Defined in: [client.ts:237](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/client.ts#L237)

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

***

### synthesizeAndWait()

> **synthesizeAndWait**(`params`, `options?`): `Promise`\<[`SpeechSynthesisRequest`](../interfaces/SpeechSynthesisRequest.md)\>

Defined in: [client.ts:312](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/client.ts#L312)

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

***

### synthesizeWithPronunciation()

> **synthesizeWithPronunciation**(`params`, `pronunciationMap`, `options?`): `Promise`\<[`SpeechSynthesisRequest`](../interfaces/SpeechSynthesisRequest.md)\>

Defined in: [client.ts:463](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/client.ts#L463)

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
