import { VoisonaClient } from '../index';
import { outputResult } from './helpers';

export async function handleVoices(
  client: VoisonaClient,
  command: string,
  arg: string,
  values: any,
) {
  switch (command) {
    case 'list': {
      const voices = await client.listVoices();
      if (values.json) {
        console.log(JSON.stringify(voices, null, 2));
      } else {
        console.log(`Available voices (${voices.length}):`);
        voices.forEach((v) => {
          const displayName =
            v.display_names.find((d) => d.language === 'ja_JP')?.name || v.display_names[0]?.name;
          console.log(`- ${displayName} (${v.voice_name}) [v${v.voice_version}]`);
        });
      }
      break;
    }
    case 'info': {
      const voiceName = arg || (values.voice_name as string);
      if (!voiceName) throw new Error('voice_name is required. Usage: voisona voices info <name>');
      const voices = await client.listVoices();
      const target = voices.find(
        (v) => v.voice_name === voiceName || v.display_names.some((d) => d.name === voiceName),
      );
      if (!target) throw new Error(`Voice "${voiceName}" not found.`);
      const info = await client.getVoiceInformation(target.voice_name, target.voice_version);
      outputResult(
        info,
        `Voice Information: ${info.voice_name}\nVersion: ${info.voice_version}\nStyles: ${info.style_names.join(', ')}\nLanguages: ${info.languages.join(', ')}`,
        !!values.json,
      );
      break;
    }
    default:
      throw new Error('Usage: voisona voices <command> [options]');
  }
}
