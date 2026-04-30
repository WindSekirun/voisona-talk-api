[**voisona-talk-api**](../index.md)

***

[voisona-talk-api](../index.md) / VoiceInformation

# Interface: VoiceInformation

Defined in: [types.ts:158](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L158)

Detailed information about a voice library, including styles.

## Extends

- [`VoiceBaseInformation`](VoiceBaseInformation.md)

## Properties

### default\_style\_weights

> **default\_style\_weights**: `number`[]

Defined in: [types.ts:160](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L160)

Default weights for each style.

***

### display\_names

> **display\_names**: `object`[]

Defined in: [types.ts:143](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L143)

Display names in different languages.

#### language

> **language**: `string`

#### name

> **name**: `string`

#### Inherited from

[`VoiceBaseInformation`](VoiceBaseInformation.md).[`display_names`](VoiceBaseInformation.md#display_names)

***

### languages

> **languages**: `string`[]

Defined in: [types.ts:148](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L148)

Supported languages.

#### Inherited from

[`VoiceBaseInformation`](VoiceBaseInformation.md).[`languages`](VoiceBaseInformation.md#languages)

***

### meta?

> `optional` **meta?**: [`MetaInformation`](MetaInformation.md)

Defined in: [types.ts:164](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L164)

Metadata information.

***

### style\_names

> **style\_names**: `string`[]

Defined in: [types.ts:162](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L162)

Names of the available styles.

***

### voice\_name

> **voice\_name**: `string`

Defined in: [types.ts:150](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L150)

Internal name of the voice library.

#### Inherited from

[`VoiceBaseInformation`](VoiceBaseInformation.md).[`voice_name`](VoiceBaseInformation.md#voice_name)

***

### voice\_version

> **voice\_version**: `string`

Defined in: [types.ts:152](https://github.com/WindSekirun/voisona-talk-api/blob/a78c2499101e00b00d8beedc8d8fc84c5548fedd/src/types.ts#L152)

Version string of the voice library.

#### Inherited from

[`VoiceBaseInformation`](VoiceBaseInformation.md).[`voice_version`](VoiceBaseInformation.md#voice_version)
