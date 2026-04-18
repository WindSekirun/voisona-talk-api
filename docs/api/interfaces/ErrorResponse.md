[**voisona-talk-api**](../index.md)

***

[voisona-talk-api](../index.md) / ErrorResponse

# Interface: ErrorResponse

Defined in: [types.ts:226](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L226)

Error response structure following Problem Details for HTTP APIs.

## Properties

### detail

> **detail**: `string`

Defined in: [types.ts:232](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L232)

Detailed explanation of the error.

***

### meta?

> `optional` **meta?**: [`MetaInformation`](MetaInformation.md)

Defined in: [types.ts:234](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L234)

Metadata information.

***

### status

> **status**: `number`

Defined in: [types.ts:228](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L228)

HTTP status code.

***

### title

> **title**: `string`

Defined in: [types.ts:230](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L230)

Short summary of the error.
