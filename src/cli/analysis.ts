import { VoisonaClient } from '../index';
import { outputResult } from './helpers';

export async function handleAnalysis(
  client: VoisonaClient,
  command: string,
  arg: string,
  values: any,
) {
  switch (command) {
    case 'list': {
      const reqs = await client.listTextAnalysisRequests();
      if (values.json) {
        console.log(JSON.stringify(reqs, null, 2));
      } else {
        console.log(`Text analysis requests (${reqs.length}):`);
        reqs.forEach((r) => console.log(`- ${r.uuid}: [${r.state}] ${r.text.substring(0, 30)}...`));
      }
      break;
    }
    case 'get': {
      if (!arg) throw new Error('UUID is required. Usage: voisona analysis get <uuid>');
      const req = await client.getTextAnalysisRequest(arg);
      outputResult(req, JSON.stringify(req, null, 2), !!values.json);
      break;
    }
    case 'delete': {
      if (!arg) throw new Error('UUID is required. Usage: voisona analysis delete <uuid>');
      await client.deleteTextAnalysisRequest(arg);
      outputResult({ success: true }, `Deleted analysis request: ${arg}`, !!values.json);
      break;
    }
    case 'clear': {
      await client.clearTextAnalysisRequests();
      outputResult({ success: true }, 'Cleared completed analysis requests.', !!values.json);
      break;
    }
    case 'request': {
      const text = arg || (values.text as string);
      if (!text) throw new Error('Text is required. Usage: voisona analysis request <text>');

      if (values.verbose && !values.json) {
        console.log(`Analyzing text: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
      }

      let lastProgress = -1;
      const result = await client.analyzeAndWait(
        { text, language: values.language },
        {
          pollInterval: 200,
          onProgress: (p) => {
            if (!values.json && p !== lastProgress) {
              console.log(`Progress: ${p}%`);
              lastProgress = p;
            }
          },
        },
      );

      if (values.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(`\nAnalysis Success! Result: ${result.analyzed_text}`);
      }
      break;
    }
    default:
      throw new Error('Usage: voisona analysis <command> [options]');
  }
}
