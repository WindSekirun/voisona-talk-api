[**voisona-talk-api**](../index.md)

***

[voisona-talk-api](../index.md) / RequestTextAnalysisParams

# Interface: RequestTextAnalysisParams

Defined in: [types.ts:194](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L194)

Parameters for requesting text analysis.

## Properties

### force\_enqueue?

> `optional` **force\_enqueue?**: `boolean`

Defined in: [types.ts:200](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L200)

Whether to force enqueue by removing old requests. Defaults to false.

***

### language

> **language**: `string`

Defined in: [types.ts:196](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L196)

Language code (e.g., "ja_JP"). Required.

***

### text

> **text**: `string`

Defined in: [types.ts:198](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L198)

Text to analyze. Min 1, Max 500 characters.
