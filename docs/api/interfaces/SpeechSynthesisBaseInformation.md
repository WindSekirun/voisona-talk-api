[**voisona-talk-api**](../index.md)

***

[voisona-talk-api](../index.md) / SpeechSynthesisBaseInformation

# Interface: SpeechSynthesisBaseInformation

Defined in: [types.ts:67](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L67)

Base information for a speech synthesis request.

## Extended by

- [`SpeechSynthesisRequest`](SpeechSynthesisRequest.md)

## Properties

### destination

> **destination**: [`Destination`](../type-aliases/Destination.md)

Defined in: [types.ts:69](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L69)

Destination of the synthesized sound.

***

### language

> **language**: `string`

Defined in: [types.ts:71](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L71)

Language code (e.g., "ja_JP").

***

### output\_file\_path?

> `optional` **output\_file\_path?**: `string`

Defined in: [types.ts:73](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L73)

Absolute path to the output WAV file. Meaningful only if destination is 'file'.

***

### progress\_percentage

> **progress\_percentage**: `number`

Defined in: [types.ts:75](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L75)

Progress of the request (0 to 100).

***

### state

> **state**: [`RequestState`](../type-aliases/RequestState.md)

Defined in: [types.ts:77](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L77)

Current state of the request.

***

### text

> **text**: `string`

Defined in: [types.ts:79](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L79)

Source text for synthesis.

***

### uuid

> **uuid**: `string`

Defined in: [types.ts:81](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L81)

Unique ID for the request.
