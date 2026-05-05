import { VoisonaClient } from '../index';
import { parseJsonObject, parseKeyValueString, outputResult } from './helpers';

export async function handleSynthesis(
  client: VoisonaClient,
  command: string,
  arg: string,
  values: any,
) {
  switch (command) {
    case 'list': {
      const reqs = await client.listSpeechSynthesisRequests();
      if (values.json) {
        console.log(JSON.stringify(reqs, null, 2));
      } else {
        console.log(`Speech synthesis requests (${reqs.length}):`);
        reqs.forEach((r) => console.log(`- ${r.uuid}: [${r.state}] ${r.text.substring(0, 30)}...`));
      }
      break;
    }
    case 'get': {
      if (!arg) throw new Error('UUID is required. Usage: voisona synthesis get <uuid>');
      const req = await client.getSpeechSynthesisRequest(arg);
      outputResult(req, JSON.stringify(req, null, 2), !!values.json);
      break;
    }
    case 'delete': {
      if (!arg) throw new Error('UUID is required. Usage: voisona synthesis delete <uuid>');
      await client.deleteSpeechSynthesisRequest(arg);
      outputResult({ success: true }, `Deleted synthesis request: ${arg}`, !!values.json);
      break;
    }
    case 'clear': {
      await client.clearSpeechSynthesisRequests();
      outputResult({ success: true }, 'Cleared completed synthesis requests.', !!values.json);
      break;
    }
    case 'request': {
      const text = arg || (values.text as string);
      if (!text) throw new Error('Text is required. Usage: voisona synthesis request <text>');

      const voices = await client.listVoices();
      let targetVoice = null;
      if (values.voice_name) {
        targetVoice = voices.find(
          (v) =>
            v.voice_name === values.voice_name ||
            v.display_names.some((d) => d.name === values.voice_name),
        );
        if (!targetVoice) {
          console.error(`Error: Voice "${values.voice_name}" not found.`);
          console.log('Available voices:');
          voices.forEach((v) => console.log(`- ${v.voice_name} (${v.display_names[0]?.name})`));
          process.exit(1);
        }
      }

      if (!values.json) {
        const voiceDisplay = targetVoice
          ? `${targetVoice.display_names.find((d) => d.language === 'ja_JP')?.name || targetVoice.display_names[0]?.name} (${targetVoice.voice_name})`
          : 'Default voice';

        if (values.verbose) {
          console.log(`Using voice: ${voiceDisplay}`);
          console.log(
            `Synthesizing text: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`,
          );
        }
      }

      const rawParams = parseJsonObject(values.params as string | undefined);
      const params: any = {
        language: values.language,
        ...rawParams,
        text,
      };

      if (targetVoice) {
        params.voice_name = targetVoice.voice_name;
        params.voice_version = (values.voice_version as string) || targetVoice.voice_version;
      }
      if (values.output) params.output_file_path = values.output as string;

      const globalParameters: any = {
        ...(typeof params.global_parameters === 'object' && params.global_parameters !== null
          ? params.global_parameters
          : {}),
      };

      const addNumericOption = (key: string, rawValue: string | undefined) => {
        if (rawValue == null) return;
        const parsed = Number.parseFloat(rawValue);
        if (Number.isNaN(parsed)) {
          throw new Error(`Invalid numeric value for --${key}: ${rawValue}`);
        }
        globalParameters[key] = parsed;
      };

      addNumericOption('speed', values.speed as string | undefined);
      addNumericOption('pitch', values.pitch as string | undefined);
      addNumericOption('intonation', values.intonation as string | undefined);
      addNumericOption('volume', values.volume as string | undefined);
      addNumericOption('huskiness', values.huskiness as string | undefined);
      addNumericOption('alp', values.alp as string | undefined);

      if (values.styles) {
        if (!targetVoice) {
          throw new Error('--styles requires an explicit --voice_name to resolve style indexes.');
        }

        const styleWeightsMap = parseKeyValueString(values.styles as string);
        const voiceInfo = await client.getVoiceInformation(
          targetVoice.voice_name,
          params.voice_version,
        );
        const weights: number[] = client.getStyleWeights(
          voiceInfo,
          Object.fromEntries(
            Object.entries(styleWeightsMap).map(([name, rawWeight]) => {
              let weight = Number.parseFloat(rawWeight);
              if (Number.isNaN(weight)) {
                throw new Error(`Invalid weight for style '${name}': ${rawWeight}`);
              }
              if (weight > 1 && weight <= 100) {
                weight = weight / 100;
              }
              return [name, weight];
            }),
          ),
        );
        globalParameters.style_weights = weights;
      }

      if (Object.keys(globalParameters).length > 0) {
        params.global_parameters = globalParameters;
      }

      let lastProgress = -1;
      const pollOptions = {
        pollInterval: 200,
        onProgress: (p: number) => {
          if (!values.json && p !== lastProgress) {
            console.log(`Progress: ${p}%`);
            lastProgress = p;
          }
        },
      };

      const result = values.pron
        ? await client.synthesizeWithPronunciation(
            params,
            parseKeyValueString(values.pron as string),
            pollOptions,
          )
        : await client.synthesizeAndWait(params, pollOptions);

      if (values.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(`\nSuccess! Output saved to: ${result.output_file_path}`);
      }
      break;
    }
    default:
      throw new Error('Usage: voisona synthesis <command> [options]');
  }
}
