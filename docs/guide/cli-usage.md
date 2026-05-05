# CLI Usage

VoiSona Talk API library includes a built-in CLI tool that allows you to interact with the API directly from your terminal.

## Installation

The CLI is included in the `voisona-talk-api` package. You can use it via `npx` without installation, or install it globally.

```bash
# Via npx
npx voisona status

# Global installation
pnpm add -g voisona-talk-api
voisona status
```

## Commands

### `status`
Check if the VoiSona Talk API service is running and reachable.

```bash
voisona status
```

### `list voices`
List all available voice libraries installed in your VoiSona Talk editor.

```bash
voisona list voices
```

### `voices info <name>`
Get detailed information about a specific voice, including its available styles and supported languages.

```bash
voisona voices info "Chis-A"
```

### `synthesis request <text>`
Synthesize text to speech and save it as a WAV file.

```bash
# 基本的な使い方
voisona synthesis request "こんにちは"

# 特定のボイスと出力パスを指定する場合
voisona synthesis request "こんにちは、世界！" --voice_name "Chis-A" --output "./hello.wav"
```

## Advanced synthesis options
The `synthesis request` command supports additional voice tuning and pronunciation control.

- `--speed <value>`: Speech speed multiplier (0.2-5).
- `--pitch <value>`: Pitch shift in cents (-600 to 600).
- `--intonation <value>`: Pitch contour intensity (0-2).
- `--volume <value>`: Volume offset in dB (-8 to 8).
- `--huskiness <value>`: Huskiness control (-20 to 20).
- `--alp <value>`: Age-like voice parameter (-1 to 1).
- `--styles <list>`: Style weight map for emotion control. Example: `Happy:0.8,Angry:0.2`.
- `--pron <list>`: Pronunciation corrections for specific words. Example: `焦る:アセル`.
- `--params <json>`: Raw JSON request parameters to merge with the synthesis request.

> `--styles` is best used with `--voice_name` so the CLI can resolve style names to the voice's style index order.

```bash
voisona synthesis request "本当に嬉しいです" --voice_name "小春六花" --styles "Happy:0.8,Angry:0.2"
voisona synthesis request "焦る必要はありません。" --voice_name "小春六花" --pron "焦る:アセル"
voisona synthesis request "これはテストです" --voice_name "小春六花" --params '{"can_overwrite_file": true}'
```

## Global Options

The following options are available for all commands:

- `--email <email>`: API user email (can also be set via `VOISONA_EMAIL` env var).
- `--password <pass>`: API user password (can also be set via `VOISONA_PASSWORD` env var).
- `--baseUrl <url>`: Base URL of the API (default: `http://localhost:32766/api/talk/v1`).
- `--env-file <path>`: Path to a `.env` file containing credentials.
- `--json`: Output result in JSON format.
- `--verbose, -v`: Enable verbose logging (shows selected voice and text being synthesized).
- `-h, --help`: Show help message.

## JSON Output

Use the `--json` flag to get machine-readable output. This is useful for integration with other tools or scripts.

```bash
voisona list voices --json
```

## Examples

### Using with a .env file
```bash
voisona synthesize "Testing" --env-file .env.production
```

### Getting specific voice styles via JSON
```bash
voisona voices info "Chis-A" --json
```
