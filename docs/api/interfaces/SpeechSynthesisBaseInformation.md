[**voisona-talk-api**](../index.md)

***

[voisona-talk-api](../index.md) / SpeechSynthesisBaseInformation

# Interface: SpeechSynthesisBaseInformation

Defined in: [types.ts:70](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L70)

Base information for a speech synthesis request.

## Extended by

- [`SpeechSynthesisRequest`](SpeechSynthesisRequest.md)

## Properties

### destination

> **destination**: [`Destination`](../type-aliases/Destination.md)

Defined in: [types.ts:72](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L72)

Destination of the synthesized sound.

***

### language

> **language**: `string`

Defined in: [types.ts:74](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L74)

Language code (e.g., "ja_JP").

***

### output\_file\_path?

> `optional` **output\_file\_path?**: `string`

Defined in: [types.ts:76](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L76)

Absolute path to the output WAV file. Meaningful only if destination is 'file'.

***

### progress\_percentage

> **progress\_percentage**: `number`

Defined in: [types.ts:78](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L78)

Progress of the request (0 to 100).

***

### state

> **state**: [`RequestState`](../type-aliases/RequestState.md)

Defined in: [types.ts:80](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L80)

Current state of the request.

***

### text

> **text**: `string`

Defined in: [types.ts:82](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L82)

Source text for synthesis.

***

### uuid

> **uuid**: `string`

Defined in: [types.ts:84](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L84)

Unique ID for the request.
