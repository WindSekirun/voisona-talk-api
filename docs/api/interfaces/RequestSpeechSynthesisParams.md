[**voisona-talk-api**](../index.md)

***

[voisona-talk-api](../index.md) / RequestSpeechSynthesisParams

# Interface: RequestSpeechSynthesisParams

Defined in: [types.ts:162](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L162)

Parameters for requesting speech synthesis.

## Properties

### analyzed\_text?

> `optional` **analyzed\_text?**: `string`

Defined in: [types.ts:174](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L174)

TSML analyzed text. Max 50000 characters.
If provided, 'text' is ignored.

***

### can\_overwrite\_file?

> `optional` **can\_overwrite\_file?**: `boolean`

Defined in: [types.ts:180](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L180)

Whether to overwrite the output file. Defaults to false.

***

### destination?

> `optional` **destination?**: [`Destination`](../type-aliases/Destination.md)

Defined in: [types.ts:176](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L176)

Destination of the output sound. Defaults to 'audio_device'.

***

### force\_enqueue?

> `optional` **force\_enqueue?**: `boolean`

Defined in: [types.ts:182](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L182)

Whether to force enqueue by removing old requests. Defaults to false.

***

### global\_parameters?

> `optional` **global\_parameters?**: [`GlobalParameters`](GlobalParameters.md)

Defined in: [types.ts:184](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L184)

Global synthesis parameters.

***

### language

> **language**: `string`

Defined in: [types.ts:164](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L164)

Language code (e.g., "ja_JP"). Required.

***

### output\_file\_path?

> `optional` **output\_file\_path?**: `string`

Defined in: [types.ts:178](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L178)

Absolute path for output file. Required if destination is 'file'.

***

### text?

> `optional` **text?**: `string`

Defined in: [types.ts:169](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L169)

Source text. Max 500 characters.
Required if analyzed_text is not provided.

***

### voice\_name?

> `optional` **voice\_name?**: `string`

Defined in: [types.ts:186](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L186)

Specific voice name to use.

***

### voice\_version?

> `optional` **voice\_version?**: `string`

Defined in: [types.ts:188](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L188)

Specific voice version to use.
