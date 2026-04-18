# Custom Pronunciation

VoiSona Talk uses **TSML (Text Synthesis Markup Language)** internally to manage how words are read. Sometimes, the AI might misread specific words (especially Kanji or proper nouns). 

This library provides a high-level helper `synthesizeWithPronunciation` to fix these readings without manually dealing with XML-like TSML tags.

## Deep Dive: What is TSML?

TSML is a specialized XML-based format that VoiSona Talk uses to represent linguistic and prosodic information. When you "analyze" text, the engine breaks it down into this structure.

### Anatomy of a TSML Tag
The most important tag for pronunciation is the `<word>` tag. Here is an example of how "こんにちは" (Hello) is represented:

```xml
<tsml>
  <acoustic_phrase>
    <word 
      chain="0" 
      hl="lhhhh" 
      original="こんにちは" 
      phoneme="k,o|N|n,i|ch,i|w,a" 
      pos="感動詞" 
      pronunciation="コンニチワ"
    >
      こんにちは
    </word>
  </acoustic_phrase>
</tsml>
```

### Key Attributes
- **`original`**: The original text as it appeared in your input.
- **`pronunciation`**: **(Most Critical)** The Katakana representation of how the word should be read. This is what we modify to fix misreadings.
- **`phoneme`**: The raw phonetic sounds (e.g., `k,o`). The engine derives this from the pronunciation.
- **`pos`**: Part of speech (e.g., "感動詞" for interjection, "名詞" for noun).
- **`hl`**: High/Low pitch accent patterns.

## How the Library Fixes Pronunciation

Instead of making you write XML, `synthesizeWithPronunciation` automates the process:

1.  **Analyze**: It calls `POST /text-analyses` to get the full TSML from the engine.
2.  **Match**: It finds all `<word>` tags where the inner text (e.g., `こんにちは`) matches your key.
3.  **Replace**: It replaces the `pronunciation="..."` attribute with your provided Katakana.
4.  **Synthesize**: It sends the modified TSML string to `POST /speech-syntheses` using the `analyzed_text` property.

## Example Usage

```typescript
import { VoisonaClient } from 'voisona-talk-api';

const client = new VoisonaClient({ /* config */ });

// "焦る" (to be in a hurry) is often misread as "Kogeru" by default AI.
// We want to ensure it's read correctly as "アセル" (Aseru).
const result = await client.synthesizeWithPronunciation(
  {
    language: 'ja_JP',
    text: 'そんなに焦る必要はありません。',
  },
  {
    '焦る': 'アセル' // Map: Original Word -> Target Katakana
  }
);
```

## Advanced: Manual TSML Manipulation
If you are generating your own TSML or need precise control over specific tags, you can use the `replacePronunciation` utility.

```typescript
import { replacePronunciation } from 'voisona-talk-api';

const rawTsml = '<word original="田中" pronunciation="タナカ">田中</word>';
const fixedTsml = replacePronunciation(rawTsml, '田中', 'デンチュウ');
```

::: warning Katakana Only
The `pronunciation` attribute **must** be written in **Full-width Katakana** (e.g., `アセル` not `あせる` or `aseru`).
:::
