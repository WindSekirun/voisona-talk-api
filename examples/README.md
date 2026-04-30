# VoiSona Talk API Examples

This directory contains example scripts demonstrating how to use the `voisona-talk-api` library.

## Prerequisites

1.  **VoiSona Talk Editor**: Ensure the VoiSona Talk editor is installed and running on your machine. The API connects to the local server hosted by the editor (default: `http://localhost:32766`).
2.  **Voice Libraries**: Make sure you have at least one voice library installed in VoiSona Talk.

## Setup

1.  Install dependencies:
    ```bash
    pnpm install
    ```
2.  Configure environment variables:
    Create a `.env` file in the root of the project (or copy from `.env.example`):
    ```env
    VOISONA_EMAIL=your-email@example.com
    VOISONA_PASSWORD=your-password
    ```

## Running Examples

Since this library has **zero production dependencies**, we recommend using the native Node.js environment file support (available in Node.js 20.6+).

### Simple Synthesis

This example lists available voices and synthesizes a Japanese greeting into a `.wav` file.

```bash
pnpm tsx --env-file=.env examples/simple-synthesis.ts
```

### Memory Synthesis (New in v0.9.1)
This example demonstrates:
- **Direct WAV retrieval**: Using `synthesizeToBuffer` to get WAV data as a buffer without saving to a file.
- **Audio Device Info**: Retrieving information about the current output device.

```bash
pnpm tsx --env-file=.env examples/memory-synthesis.ts
```

### Phoneme Duration Control (New in v0.9.1)
This example demonstrates:
- **Phoneme Duration Control**: Specifying exact timing for individual phonemes using an array of durations.

```bash
pnpm tsx --env-file=.env examples/phoneme-durations.ts
```

### Advanced Options
This example demonstrates:
- **Emotion Control**: Using `getStyleWeights` to adjust voice styles by name.
- **Global Parameters**: Adjusting `pitch`, `speed`, `intonation`, and `volume`.
- **Bulk Synthesis**: Processing multiple messages concurrently.

```bash
pnpm tsx --env-file=.env examples/advanced-options.ts
```

### Custom Pronunciation
This example demonstrates how to fix misread words (like kanji with multiple readings) using the `synthesizeWithPronunciation` helper.

```bash
pnpm tsx --env-file=.env examples/custom-pronunciation.ts
```

### Queue Management

This example demonstrates how to check the queue status and clean up completed or failed requests.

```bash
pnpm tsx --env-file=.env examples/queue-management.ts
```

::: tip Older Node.js Versions
If you are using Node.js version < 20.6, you can set environment variables manually in your shell or use a tool like `dotenv-cli`:
```bash
npx dotenv-cli -- pnpm tsx examples/simple-synthesis.ts
```
:::

### Module Compatibility Tests

These sub-projects verify that the library works correctly in both ESM and CJS environments using local file referencing.

#### ESM Test

```bash
cd examples/esm-test
pnpm install
node index.js
```

#### CJS Test

```bash
cd examples/cjs-test
pnpm install
node index.js
```

The output files will be saved in the `output/` directory (created automatically in the project root) with names like `output_1713425256000_abcde.wav`.

## Library Usage in the Example

The example uses the `synthesizeAndWait` helper, which:

- Defaults to `file` output.
- Automatically creates the `output/` directory if it doesn't exist.
- Automatically generates a unique `.wav` filename in the `output/` directory if not provided.
- Polls the API until the synthesis is complete.
