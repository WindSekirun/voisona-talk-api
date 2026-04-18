# Advanced Style Control

VoiSona Talk allows you to fine-tune the generated speech using various global parameters and style weights (emotions).

## Global Parameters

You can adjust the following parameters in the `global_parameters` object:

| Parameter | Description | Range | Default |
| :--- | :--- | :--- | :--- |
| `alp` | Age-like parameter (frequency warping). | -1.0 to 1.0 | 0.0 |
| `huskiness` | Control the huskiness of the voice. | -20.0 to 20.0 | 0.0 |
| `intonation` | Scale factor for pitch contour variation. | 0.0 to 2.0 | 1.0 |
| `pitch` | Pitch shift in cents (1 cent = 0.01 semitones). | -600 to 600 | 0.0 |
| `speed` | Speech rate (speed multiplier). | 0.2 to 5.0 | 1.0 |
| `volume` | Amplitude multiplier in decibels (dB). | -8.0 to 8.0 | 0.0 |
| `style_weights` | Array of style weight coefficients. | Sum typically 1.0 | Voice default |

## Managing Styles (Emotions)

Instead of manually managing the `style_weights` array (which depends on the internal order of the voice library), you can use the `getStyleWeights` helper.

### 1. Fetch Voice Information
Styles differ between voice libraries. First, retrieve the detailed information for your chosen voice.

```typescript
const voiceInfo = await client.getVoiceInformation('voice_name', '1.0.0');
console.log(voiceInfo.style_names); // e.g., ["Normal", "Happy", "Sad", "Angry"]
```

### 2. Map Styles by Name
Use `getStyleWeights` to create the weight array using intuitive names.

```typescript
const styleWeights = client.getStyleWeights(voiceInfo, {
  Happy: 0.8,
  Normal: 0.2,
});
```

## Complete Example

```typescript
import { VoisonaClient } from 'voisona-talk-api';

const client = new VoisonaClient({ /* config */ });

async function run() {
  // 1. Get voice details
  const voiceInfo = await client.getVoiceInformation('tanaka-san_ja_JP', '2.0.1');

  // 2. Configure styles and parameters
  const result = await client.synthesizeAndWait({
    text: 'わーい！今日はとてもいい天気ですね！',
    language: 'ja_JP',
    voice_name: 'tanaka-san_ja_JP',
    global_parameters: {
      style_weights: client.getStyleWeights(voiceInfo, { Happy: 1.0 }),
      speed: 1.2,      // Slightly faster
      pitch: 100,      // Higher pitch
      intonation: 1.5, // More expressive
    },
  });

  console.log(`Audio saved at: ${result.output_file_path}`);
}
```

::: tip Parameter Validation
This library automatically validates these parameters locally before sending the request to VoiSona Talk, providing clear error messages if values are out of range.
:::
