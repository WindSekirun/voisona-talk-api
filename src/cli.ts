#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { readFileSync, existsSync } from 'node:fs';
import { VoisonaClient } from './index';
import { handleAnalysis } from './cli/analysis';
import { handleSynthesis } from './cli/synthesis';
import { handleVoices } from './cli/voices';
import { outputResult } from './cli/helpers';

async function main() {
  const { values, positionals } = parseArgs({
    options: {
      email: { type: 'string' },
      password: { type: 'string' },
      baseUrl: { type: 'string' },
      'env-file': { type: 'string' },
      text: { type: 'string' },
      language: { type: 'string', default: 'ja_JP' },
      voice_name: { type: 'string' },
      voice_version: { type: 'string' },
      output: { type: 'string' },
      json: { type: 'boolean' },
      verbose: { type: 'boolean', short: 'v' },
      // Global parameters
      speed: { type: 'string' },
      pitch: { type: 'string' },
      intonation: { type: 'string' },
      volume: { type: 'string' },
      huskiness: { type: 'string' },
      alp: { type: 'string' },
      // Styles and Pronunciation
      styles: { type: 'string' },
      pron: { type: 'string' },
      params: { type: 'string' },
      help: { type: 'boolean', short: 'h' },
    },
    allowPositionals: true,
  });

  const category = positionals[0] || '';
  const command = positionals[1] || '';
  const arg = positionals[2] || '';

  if (values.help || positionals.length === 0) {
    printHelp(category);
    return;
  }

  // Load .env file
  const envFile = (values['env-file'] as string) || (existsSync('.env') ? '.env' : null);
  if (envFile && existsSync(envFile)) {
    try {
      const content = readFileSync(envFile, 'utf8');
      content.split(/\r?\n/).forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts
            .join('=')
            .trim()
            .replace(/^["']|["']$/g, '');
          process.env[key.trim()] = value;
        }
      });
    } catch {
      if (values.verbose) console.warn(`Warning: Failed to read env file ${envFile}`);
    }
  }

  const client = new VoisonaClient({
    email: (values.email as string) || process.env.VOISONA_EMAIL || '',
    password: (values.password as string) || process.env.VOISONA_PASSWORD || '',
    baseUrl: (values.baseUrl as string) || process.env.VOISONA_BASE_URL || undefined,
  });

  try {
    switch (category) {
      case 'status': {
        const running = await client.isServiceRunning();
        outputResult(
          { running },
          `VoiSona Talk API status: ${running ? 'Running' : 'Not reachable'}`,
          !!values.json,
        );
        process.exit(running ? 0 : 1);
        break;
      }

      case 'queue': {
        const status = await client.getQueueStatus();
        outputResult(
          status,
          `Queue Status:\n- Synthesis: ${JSON.stringify(status.synthesis)}\n- Analysis: ${JSON.stringify(status.analysis)}`,
          !!values.json,
        );
        break;
      }

      case 'voices':
        await handleVoices(client, command, arg, values);
        break;

      case 'synthesis':
        await handleSynthesis(client, command, arg, values);
        break;

      case 'analysis':
        await handleAnalysis(client, command, arg, values);
        break;

      default:
        console.error(`Unknown category: ${category}`);
        printHelp();
        process.exit(1);
    }
  } catch (error: any) {
    console.error('Error:', error.message || error);
    process.exit(1);
  }
}

function printHelp(category?: string) {
  const globalOptions = `
Global Options:
  --email <email>         API user email
  --password <pass>       API user password
  --baseUrl <url>         Base URL of the API
  --env-file <path>       Path to .env file
  --json                  Output in JSON format
  --verbose, -v           Enable verbose logging
  -h, --help              Show this help message`;

  if (!category) {
    console.log(`
Usage: voisona <category> [command] [options]

Categories:
  status                 Check service status
  queue                  Show request queue status summary
  voices                 Voice library management
  synthesis              Speech synthesis management
  analysis               Text analysis management

Examples:
  voisona status
  voisona voices list
  voisona synthesis request "こんにちは"
${globalOptions}
`);
  } else if (category === 'voices') {
    console.log(`
Usage: voisona voices <command> [options]

Commands:
  list                   List available voice libraries
  info <name>            Get detailed information about a voice
${globalOptions}
`);
  } else if (category === 'synthesis') {
    console.log(`
Usage: voisona synthesis <command> [options]

Commands:
  request <text>         Synthesize text to speech
  list                   List synthesis requests
  get <uuid>             Get detailed request info
  delete <uuid>          Delete a specific request
  clear                  Clear all completed requests

Options for request:
  --voice_name <name>    Specific voice name or display name
  --voice_version <ver>  Specific voice version
  --output <path>        Output WAV file path
  --speed <value>        Speech speed multiplier (0.2-5)
  --pitch <value>        Pitch shift in cents (-600 to 600)
  --intonation <value>   Pitch contour intensity (0-2)
  --volume <value>       Volume offset in dB (-8 to 8)
  --huskiness <value>    Huskiness control (-20 to 20)
  --alp <value>          Age-like voice parameter (-1 to 1)
  --styles <list>        Style weights (e.g. Happy:0.8,Angry:0.2)
  --pron <list>          Pronunciation corrections (e.g. 焦る:アセル)
  --params <json>        Raw JSON request parameters to merge
${globalOptions}
`);
  } else if (category === 'analysis') {
    console.log(`
Usage: voisona analysis <command> [options]

Commands:
  request <text>         Analyze text for prosody (TSML)
  list                   List analysis requests
  get <uuid>             Get detailed request info
  delete <uuid>          Delete a specific request
  clear                  Clear all completed requests
${globalOptions}
`);
  }
}

main();
