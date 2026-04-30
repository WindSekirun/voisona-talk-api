[**voisona-talk-api**](../index.md)

***

[voisona-talk-api](../index.md) / GlobalParameters

# Interface: GlobalParameters

Defined in: [types.ts:29](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L29)

Global parameters for speech synthesis.

## Properties

### alp?

> `optional` **alp?**: `number`

Defined in: [types.ts:34](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L34)

Age-like parameter (frequency warping).
Range: -1 to 1. Default: 0.

***

### huskiness?

> `optional` **huskiness?**: `number`

Defined in: [types.ts:39](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L39)

Huskiness control parameter.
Range: -20 to 20. Default: 0.

***

### intonation?

> `optional` **intonation?**: `number`

Defined in: [types.ts:44](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L44)

Scale factor for pitch contour variation.
Range: 0 to 2. Default: 1.

***

### pitch?

> `optional` **pitch?**: `number`

Defined in: [types.ts:49](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L49)

Pitch shift coefficient in cents.
Range: -600 to 600. Default: 0.

***

### speed?

> `optional` **speed?**: `number`

Defined in: [types.ts:54](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L54)

Speech rate (speed).
Range: 0.2 to 5. Default: 1.

***

### style\_weights?

> `optional` **style\_weights?**: `number`[]

Defined in: [types.ts:59](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L59)

Array of style weight coefficients.
Typically sums to 1.0.

***

### volume?

> `optional` **volume?**: `number`

Defined in: [types.ts:64](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L64)

Amplitude multiplier in decibels.
Range: -8 to 8. Default: 0.
