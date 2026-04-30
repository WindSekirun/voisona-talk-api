[**voisona-talk-api**](../index.md)

***

[voisona-talk-api](../index.md) / TextAnalysisBaseInformation

# Interface: TextAnalysisBaseInformation

Defined in: [types.ts:117](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L117)

Base information for a text analysis request.

## Extended by

- [`TextAnalysisRequest`](TextAnalysisRequest.md)

## Properties

### progress\_percentage

> **progress\_percentage**: `number`

Defined in: [types.ts:119](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L119)

Progress of the analysis (0 to 100).

***

### state

> **state**: [`RequestState`](../type-aliases/RequestState.md)

Defined in: [types.ts:121](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L121)

Current state of the request.

***

### text

> **text**: `string`

Defined in: [types.ts:123](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L123)

Source text for analysis.

***

### uuid

> **uuid**: `string`

Defined in: [types.ts:125](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L125)

Unique ID for the request.
