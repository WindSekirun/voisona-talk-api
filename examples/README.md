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

### Simple Synthesis

This example lists available voices and synthesizes a Japanese greeting into a `.wav` file.

```bash
pnpm tsx examples/simple-synthesis.ts
```

### Advanced Options

This example demonstrates:

- **Emotion Control**: Using `getStyleWeights` to adjust voice styles by name.
- **Global Parameters**: Adjusting `pitch`, `speed`, `intonation`, and `volume`.
- **Bulk Synthesis**: Processing multiple messages concurrently.

```bash
pnpm tsx examples/advanced-options.ts
```

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
