# Getting Started

Follow these steps to install the library and generate your first speech synthesis.

## 1. Installation

Install the library using your favorite package manager:

```bash
pnpm add voisona-talk-api
# or
npm install voisona-talk-api
```

## 2. Prerequisites

To use this library, you must have the **VoiSona Talk Editor** running on your local machine with the API server enabled.

- **VoiSona Talk Editor**: [Download here](https://voisona.com/talk/)
- **API Access**: Ensure API is enabled in `Preference > API` (Default port: `32766`).
- **Valid License**: You must own a license for the editor and the voice libraries you use.

## 3. Basic Configuration

We recommend using environment variables (e.g., via `dotenv`) to store your VoiSona credentials:

```bash
# .env
VOISONA_EMAIL=your_email@example.com
VOISONA_PASSWORD=your_password
```

## 4. Simple Usage

Initialize the client and generate your first speech file in just a few lines of code:

```typescript
import { VoisonaClient } from 'voisona-talk-api';
import 'dotenv/config';

const client = new VoisonaClient({
  email: process.env.VOISONA_EMAIL,
  password: process.env.VOISONA_PASSWORD,
});

// Check if the service is running
if (!(await client.isServiceRunning())) {
  console.error("VoiSona Talk is not running!");
  process.exit(1);
}

// Synthesize text (defaults to .wav output in 'output/' directory)
const result = await client.synthesizeAndWait({
  text: 'こんにちは。VoiSona Talkのテストです。',
  language: 'ja_JP',
});

console.log(`Audio successfully saved at: ${result.output_file_path}`);
```

Check out the [Examples](/examples/list-voices) for more details.
