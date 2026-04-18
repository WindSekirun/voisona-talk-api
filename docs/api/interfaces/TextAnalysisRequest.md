[**voisona-talk-api**](../index.md)

***

[voisona-talk-api](../index.md) / TextAnalysisRequest

# Interface: TextAnalysisRequest

Defined in: [types.ts:123](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L123)

Detailed information and results of a text analysis request.

## Extends

- [`TextAnalysisBaseInformation`](TextAnalysisBaseInformation.md)

## Properties

### analyzed\_text?

> `optional` **analyzed\_text?**: `string`

Defined in: [types.ts:125](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L125)

Linguistic and prosodic data analyzed from text (TSML).

***

### meta?

> `optional` **meta?**: [`MetaInformation`](MetaInformation.md)

Defined in: [types.ts:127](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L127)

Metadata information.

***

### progress\_percentage

> **progress\_percentage**: `number`

Defined in: [types.ts:111](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L111)

Progress of the analysis (0 to 100).

#### Inherited from

[`TextAnalysisBaseInformation`](TextAnalysisBaseInformation.md).[`progress_percentage`](TextAnalysisBaseInformation.md#progress_percentage)

***

### state

> **state**: [`RequestState`](../type-aliases/RequestState.md)

Defined in: [types.ts:113](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L113)

Current state of the request.

#### Inherited from

[`TextAnalysisBaseInformation`](TextAnalysisBaseInformation.md).[`state`](TextAnalysisBaseInformation.md#state)

***

### text

> **text**: `string`

Defined in: [types.ts:115](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L115)

Source text for analysis.

#### Inherited from

[`TextAnalysisBaseInformation`](TextAnalysisBaseInformation.md).[`text`](TextAnalysisBaseInformation.md#text)

***

### uuid

> **uuid**: `string`

Defined in: [types.ts:117](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L117)

Unique ID for the request.

#### Inherited from

[`TextAnalysisBaseInformation`](TextAnalysisBaseInformation.md).[`uuid`](TextAnalysisBaseInformation.md#uuid)
