[**voisona-talk-api**](../index.md)

***

[voisona-talk-api](../index.md) / SpeechSynthesisRequest

# Interface: SpeechSynthesisRequest

Defined in: [types.ts:87](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L87)

Detailed information for a speech synthesis request.

## Extends

- [`SpeechSynthesisBaseInformation`](SpeechSynthesisBaseInformation.md)

## Properties

### analyzed\_text?

> `optional` **analyzed\_text?**: `string`

Defined in: [types.ts:89](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L89)

TSML analyzed text used for synthesis.

***

### destination

> **destination**: [`Destination`](../type-aliases/Destination.md)

Defined in: [types.ts:69](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L69)

Destination of the synthesized sound.

#### Inherited from

[`SpeechSynthesisBaseInformation`](SpeechSynthesisBaseInformation.md).[`destination`](SpeechSynthesisBaseInformation.md#destination)

***

### duration?

> `optional` **duration?**: `number`

Defined in: [types.ts:91](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L91)

Duration of the synthetic sound in seconds.

***

### global\_parameters?

> `optional` **global\_parameters?**: [`GlobalParameters`](GlobalParameters.md)

Defined in: [types.ts:93](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L93)

Global parameters used for synthesis.

***

### language

> **language**: `string`

Defined in: [types.ts:71](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L71)

Language code (e.g., "ja_JP").

#### Inherited from

[`SpeechSynthesisBaseInformation`](SpeechSynthesisBaseInformation.md).[`language`](SpeechSynthesisBaseInformation.md#language)

***

### meta?

> `optional` **meta?**: [`MetaInformation`](MetaInformation.md)

Defined in: [types.ts:103](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L103)

Metadata information.

***

### output\_file\_path?

> `optional` **output\_file\_path?**: `string`

Defined in: [types.ts:73](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L73)

Absolute path to the output WAV file. Meaningful only if destination is 'file'.

#### Inherited from

[`SpeechSynthesisBaseInformation`](SpeechSynthesisBaseInformation.md).[`output_file_path`](SpeechSynthesisBaseInformation.md#output_file_path)

***

### phoneme\_durations?

> `optional` **phoneme\_durations?**: `number`[]

Defined in: [types.ts:97](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L97)

Array of phoneme durations in seconds.

***

### phonemes?

> `optional` **phonemes?**: `string`[]

Defined in: [types.ts:95](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L95)

Array of phoneme labels.

***

### progress\_percentage

> **progress\_percentage**: `number`

Defined in: [types.ts:75](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L75)

Progress of the request (0 to 100).

#### Inherited from

[`SpeechSynthesisBaseInformation`](SpeechSynthesisBaseInformation.md).[`progress_percentage`](SpeechSynthesisBaseInformation.md#progress_percentage)

***

### state

> **state**: [`RequestState`](../type-aliases/RequestState.md)

Defined in: [types.ts:77](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L77)

Current state of the request.

#### Inherited from

[`SpeechSynthesisBaseInformation`](SpeechSynthesisBaseInformation.md).[`state`](SpeechSynthesisBaseInformation.md#state)

***

### text

> **text**: `string`

Defined in: [types.ts:79](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L79)

Source text for synthesis.

#### Inherited from

[`SpeechSynthesisBaseInformation`](SpeechSynthesisBaseInformation.md).[`text`](SpeechSynthesisBaseInformation.md#text)

***

### uuid

> **uuid**: `string`

Defined in: [types.ts:81](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L81)

Unique ID for the request.

#### Inherited from

[`SpeechSynthesisBaseInformation`](SpeechSynthesisBaseInformation.md).[`uuid`](SpeechSynthesisBaseInformation.md#uuid)

***

### voice\_name?

> `optional` **voice\_name?**: `string`

Defined in: [types.ts:99](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L99)

Name of the voice library used.

***

### voice\_version?

> `optional` **voice\_version?**: `string`

Defined in: [types.ts:101](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L101)

Version of the voice library used.
