[**voisona-talk-api**](../index.md)

***

[voisona-talk-api](../index.md) / TextAnalysisBaseInformation

# Interface: TextAnalysisBaseInformation

Defined in: [types.ts:109](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L109)

Base information for a text analysis request.

## Extended by

- [`TextAnalysisRequest`](TextAnalysisRequest.md)

## Properties

### progress\_percentage

> **progress\_percentage**: `number`

Defined in: [types.ts:111](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L111)

Progress of the analysis (0 to 100).

***

### state

> **state**: [`RequestState`](../type-aliases/RequestState.md)

Defined in: [types.ts:113](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L113)

Current state of the request.

***

### text

> **text**: `string`

Defined in: [types.ts:115](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L115)

Source text for analysis.

***

### uuid

> **uuid**: `string`

Defined in: [types.ts:117](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L117)

Unique ID for the request.
