[**voisona-talk-api**](../index.md)

***

[voisona-talk-api](../index.md) / replacePronunciation

# Function: replacePronunciation()

> **replacePronunciation**(`tsml`, `word`, `pronunciation`): `string`

Defined in: [utils.ts:9](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/utils.ts#L9)

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
