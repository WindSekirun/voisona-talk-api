[**voisona-talk-api**](../index.md)

***

[voisona-talk-api](../index.md) / GlobalParameters

# Interface: GlobalParameters

Defined in: [types.ts:26](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L26)

Global parameters for speech synthesis.

## Properties

### alp?

> `optional` **alp?**: `number`

Defined in: [types.ts:31](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L31)

Age-like parameter (frequency warping).
Range: -1 to 1. Default: 0.

***

### huskiness?

> `optional` **huskiness?**: `number`

Defined in: [types.ts:36](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L36)

Huskiness control parameter.
Range: -20 to 20. Default: 0.

***

### intonation?

> `optional` **intonation?**: `number`

Defined in: [types.ts:41](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L41)

Scale factor for pitch contour variation.
Range: 0 to 2. Default: 1.

***

### pitch?

> `optional` **pitch?**: `number`

Defined in: [types.ts:46](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L46)

Pitch shift coefficient in cents.
Range: -600 to 600. Default: 0.

***

### speed?

> `optional` **speed?**: `number`

Defined in: [types.ts:51](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L51)

Speech rate (speed).
Range: 0.2 to 5. Default: 1.

***

### style\_weights?

> `optional` **style\_weights?**: `number`[]

Defined in: [types.ts:56](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L56)

Array of style weight coefficients.
Typically sums to 1.0.

***

### volume?

> `optional` **volume?**: `number`

Defined in: [types.ts:61](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L61)

Amplitude multiplier in decibels.
Range: -8 to 8. Default: 0.
