[**voisona-talk-api**](../index.md)

***

[voisona-talk-api](../index.md) / VoiceInformation

# Interface: VoiceInformation

Defined in: [types.ts:150](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L150)

Detailed information about a voice library, including styles.

## Extends

- [`VoiceBaseInformation`](VoiceBaseInformation.md)

## Properties

### default\_style\_weights

> **default\_style\_weights**: `number`[]

Defined in: [types.ts:152](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L152)

Default weights for each style.

***

### display\_names

> **display\_names**: `object`[]

Defined in: [types.ts:135](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L135)

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

Defined in: [types.ts:140](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L140)

Supported languages.

#### Inherited from

[`VoiceBaseInformation`](VoiceBaseInformation.md).[`languages`](VoiceBaseInformation.md#languages)

***

### meta?

> `optional` **meta?**: [`MetaInformation`](MetaInformation.md)

Defined in: [types.ts:156](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L156)

Metadata information.

***

### style\_names

> **style\_names**: `string`[]

Defined in: [types.ts:154](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L154)

Names of the available styles.

***

### voice\_name

> **voice\_name**: `string`

Defined in: [types.ts:142](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L142)

Internal name of the voice library.

#### Inherited from

[`VoiceBaseInformation`](VoiceBaseInformation.md).[`voice_name`](VoiceBaseInformation.md#voice_name)

***

### voice\_version

> **voice\_version**: `string`

Defined in: [types.ts:144](https://github.com/WindSekirun/voisona-talk-api/blob/07899eba61ee79d2e2b22e42354284901bb76561/src/types.ts#L144)

Version string of the voice library.

#### Inherited from

[`VoiceBaseInformation`](VoiceBaseInformation.md).[`voice_version`](VoiceBaseInformation.md#voice_version)
