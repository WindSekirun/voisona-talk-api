[**voisona-talk-api**](../index.md)

***

[voisona-talk-api](../index.md) / TextAnalysisRequest

# Interface: TextAnalysisRequest

Defined in: [types.ts:131](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L131)

Detailed information and results of a text analysis request.

## Extends

- [`TextAnalysisBaseInformation`](TextAnalysisBaseInformation.md)

## Properties

### analyzed\_text?

> `optional` **analyzed\_text?**: `string`

Defined in: [types.ts:133](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L133)

Linguistic and prosodic data analyzed from text (TSML).

***

### meta?

> `optional` **meta?**: [`MetaInformation`](MetaInformation.md)

Defined in: [types.ts:135](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L135)

Metadata information.

***

### progress\_percentage

> **progress\_percentage**: `number`

Defined in: [types.ts:119](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L119)

Progress of the analysis (0 to 100).

#### Inherited from

[`TextAnalysisBaseInformation`](TextAnalysisBaseInformation.md).[`progress_percentage`](TextAnalysisBaseInformation.md#progress_percentage)

***

### state

> **state**: [`RequestState`](../type-aliases/RequestState.md)

Defined in: [types.ts:121](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L121)

Current state of the request.

#### Inherited from

[`TextAnalysisBaseInformation`](TextAnalysisBaseInformation.md).[`state`](TextAnalysisBaseInformation.md#state)

***

### text

> **text**: `string`

Defined in: [types.ts:123](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L123)

Source text for analysis.

#### Inherited from

[`TextAnalysisBaseInformation`](TextAnalysisBaseInformation.md).[`text`](TextAnalysisBaseInformation.md#text)

***

### uuid

> **uuid**: `string`

Defined in: [types.ts:125](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L125)

Unique ID for the request.

#### Inherited from

[`TextAnalysisBaseInformation`](TextAnalysisBaseInformation.md).[`uuid`](TextAnalysisBaseInformation.md#uuid)
