[**voisona-talk-api**](../index.md)

***

[voisona-talk-api](../index.md) / SpeechSynthesisRequest

# Interface: SpeechSynthesisRequest

Defined in: [types.ts:90](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L90)

Detailed information for a speech synthesis request.

## Extends

- [`SpeechSynthesisBaseInformation`](SpeechSynthesisBaseInformation.md)

## Properties

### analyzed\_text?

> `optional` **analyzed\_text?**: `string`

Defined in: [types.ts:92](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L92)

TSML analyzed text used for synthesis.

***

### destination

> **destination**: [`Destination`](../type-aliases/Destination.md)

Defined in: [types.ts:72](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L72)

Destination of the synthesized sound.

#### Inherited from

[`SpeechSynthesisBaseInformation`](SpeechSynthesisBaseInformation.md).[`destination`](SpeechSynthesisBaseInformation.md#destination)

***

### duration?

> `optional` **duration?**: `number`

Defined in: [types.ts:94](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L94)

Duration of the synthetic sound in seconds.

***

### global\_parameters?

> `optional` **global\_parameters?**: [`GlobalParameters`](GlobalParameters.md)

Defined in: [types.ts:96](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L96)

Global parameters used for synthesis.

***

### language

> **language**: `string`

Defined in: [types.ts:74](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L74)

Language code (e.g., "ja_JP").

#### Inherited from

[`SpeechSynthesisBaseInformation`](SpeechSynthesisBaseInformation.md).[`language`](SpeechSynthesisBaseInformation.md#language)

***

### meta?

> `optional` **meta?**: [`MetaInformation`](MetaInformation.md)

Defined in: [types.ts:111](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L111)

Metadata information.

***

### output\_file\_path?

> `optional` **output\_file\_path?**: `string`

Defined in: [types.ts:76](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L76)

Absolute path to the output WAV file. Meaningful only if destination is 'file'.

#### Inherited from

[`SpeechSynthesisBaseInformation`](SpeechSynthesisBaseInformation.md).[`output_file_path`](SpeechSynthesisBaseInformation.md#output_file_path)

***

### phoneme\_durations?

> `optional` **phoneme\_durations?**: `number`[]

Defined in: [types.ts:105](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L105)

Actual phoneme durations in seconds.

***

### phonemes?

> `optional` **phonemes?**: `string`[]

Defined in: [types.ts:98](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L98)

Array of phoneme labels.

***

### progress\_percentage

> **progress\_percentage**: `number`

Defined in: [types.ts:78](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L78)

Progress of the request (0 to 100).

#### Inherited from

[`SpeechSynthesisBaseInformation`](SpeechSynthesisBaseInformation.md).[`progress_percentage`](SpeechSynthesisBaseInformation.md#progress_percentage)

***

### requested\_phoneme\_durations?

> `optional` **requested\_phoneme\_durations?**: `number`[]

Defined in: [types.ts:103](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L103)

Requested phoneme durations in seconds.
Returned only when the request included phoneme_durations.

***

### state

> **state**: [`RequestState`](../type-aliases/RequestState.md)

Defined in: [types.ts:80](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L80)

Current state of the request.

#### Inherited from

[`SpeechSynthesisBaseInformation`](SpeechSynthesisBaseInformation.md).[`state`](SpeechSynthesisBaseInformation.md#state)

***

### text

> **text**: `string`

Defined in: [types.ts:82](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L82)

Source text for synthesis.

#### Inherited from

[`SpeechSynthesisBaseInformation`](SpeechSynthesisBaseInformation.md).[`text`](SpeechSynthesisBaseInformation.md#text)

***

### uuid

> **uuid**: `string`

Defined in: [types.ts:84](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L84)

Unique ID for the request.

#### Inherited from

[`SpeechSynthesisBaseInformation`](SpeechSynthesisBaseInformation.md).[`uuid`](SpeechSynthesisBaseInformation.md#uuid)

***

### voice\_name?

> `optional` **voice\_name?**: `string`

Defined in: [types.ts:107](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L107)

Name of the voice library used.

***

### voice\_version?

> `optional` **voice\_version?**: `string`

Defined in: [types.ts:109](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L109)

Version of the voice library used.
