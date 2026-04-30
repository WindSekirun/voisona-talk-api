[**voisona-talk-api**](../index.md)

***

[voisona-talk-api](../index.md) / replacePronunciation

# Function: replacePronunciation()

> **replacePronunciation**(`tsml`, `word`, `pronunciation`): `string`

Defined in: [utils.ts:9](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/utils.ts#L9)

Replaces the pronunciation of a specific word in a TSML string.

## Parameters

### tsml

`string`

The original TSML string.

### word

`string`

The word to find (the text content of the `<word>` tag).

### pronunciation

`string`

The new pronunciation (in Katakana).

## Returns

`string`

The modified TSML string.
