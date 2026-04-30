[**voisona-talk-api**](../index.md)

***

[voisona-talk-api](../index.md) / RequestSpeechSynthesisParams

# Interface: RequestSpeechSynthesisParams

Defined in: [types.ts:182](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L182)

Parameters for requesting speech synthesis.

## Properties

### analyzed\_text?

> `optional` **analyzed\_text?**: `string`

Defined in: [types.ts:194](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L194)

TSML analyzed text. Max 50000 characters.
If provided, 'text' is ignored.

***

### can\_overwrite\_file?

> `optional` **can\_overwrite\_file?**: `boolean`

Defined in: [types.ts:200](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L200)

Whether to overwrite the output file. Defaults to false.

***

### destination?

> `optional` **destination?**: [`Destination`](../type-aliases/Destination.md)

Defined in: [types.ts:196](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L196)

Destination of the output sound. Defaults to 'audio_device'.

***

### force\_enqueue?

> `optional` **force\_enqueue?**: `boolean`

Defined in: [types.ts:202](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L202)

Whether to force enqueue by removing old requests. Defaults to false.

***

### global\_parameters?

> `optional` **global\_parameters?**: [`GlobalParameters`](GlobalParameters.md)

Defined in: [types.ts:204](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L204)

Global synthesis parameters.

***

### language

> **language**: `string`

Defined in: [types.ts:184](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L184)

Language code (e.g., "ja_JP"). Required.

***

### output\_file\_path?

> `optional` **output\_file\_path?**: `string`

Defined in: [types.ts:198](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L198)

Absolute path for output file. Required if destination is 'file'.

***

### phoneme\_durations?

> `optional` **phoneme\_durations?**: `number`[]

Defined in: [types.ts:209](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L209)

Requested phoneme durations in seconds.
-1 means automatic.

***

### text?

> `optional` **text?**: `string`

Defined in: [types.ts:189](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L189)

Source text. Max 500 characters.
Required if analyzed_text is not provided.

***

### voice\_name?

> `optional` **voice\_name?**: `string`

Defined in: [types.ts:211](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L211)

Specific voice name to use.

***

### voice\_version?

> `optional` **voice\_version?**: `string`

Defined in: [types.ts:213](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L213)

Specific voice version to use.
