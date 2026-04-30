[**voisona-talk-api**](../index.md)

***

[voisona-talk-api](../index.md) / RequestTextAnalysisParams

# Interface: RequestTextAnalysisParams

Defined in: [types.ts:219](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L219)

Parameters for requesting text analysis.

## Properties

### force\_enqueue?

> `optional` **force\_enqueue?**: `boolean`

Defined in: [types.ts:225](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L225)

Whether to force enqueue by removing old requests. Defaults to false.

***

### language

> **language**: `string`

Defined in: [types.ts:221](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L221)

Language code (e.g., "ja_JP"). Required.

***

### text

> **text**: `string`

Defined in: [types.ts:223](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L223)

Text to analyze. Min 1, Max 500 characters.
