[**voisona-talk-api**](../index.md)

***

[voisona-talk-api](../index.md) / replacePronunciation

# Function: replacePronunciation()

> **replacePronunciation**(`tsml`, `word`, `pronunciation`): `string`

Defined in: [utils.ts:9](https://github.com/WindSekirun/voisona-talk-api/blob/8614e0e278bdfaad9140c9aab795204d98eed8af/src/utils.ts#L9)

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
