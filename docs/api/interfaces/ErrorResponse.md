[**voisona-talk-api**](../index.md)

***

[voisona-talk-api](../index.md) / ErrorResponse

# Interface: ErrorResponse

Defined in: [types.ts:251](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L251)

Error response structure following Problem Details for HTTP APIs.

## Properties

### detail

> **detail**: `string`

Defined in: [types.ts:257](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L257)

Detailed explanation of the error.

***

### meta?

> `optional` **meta?**: [`MetaInformation`](MetaInformation.md)

Defined in: [types.ts:259](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L259)

Metadata information.

***

### status

> **status**: `number`

Defined in: [types.ts:253](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L253)

HTTP status code.

***

### title

> **title**: `string`

Defined in: [types.ts:255](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L255)

Short summary of the error.
