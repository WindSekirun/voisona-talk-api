const fs = require('fs');
const { execSync } = require('child_process');

function log(msg) {
  process.stderr.write(`[prettier-hook]: ${msg}\n`);
}

async function main() {
  let inputData = '';
  process.stdin.on('data', (chunk) => {
    inputData += chunk;
  });

  process.stdin.on('end', () => {
    try {
      if (!inputData) {
        process.stdout.write(JSON.stringify({ decision: 'allow' }));
        return;
      }

      const input = JSON.parse(inputData);
      const toolName = input.tool_name;
      const toolInput = input.tool_input;
      const toolResponse = input.tool_response;

      // Skip if the tool failed or no file path provided
      if (toolResponse && toolResponse.error) {
        process.stdout.write(JSON.stringify({ decision: 'allow' }));
        return;
      }

      const filePath = toolInput ? toolInput.file_path : null;

      if (filePath && (toolName === 'write_file' || toolName === 'replace')) {
        log(`Running prettier for ${filePath}...`);
        try {
          // Use pnpm exec prettier --write
          execSync(`pnpm exec prettier --write "${filePath}"`, { stdio: 'inherit' });
          log(`Successfully formatted ${filePath}`);
        } catch (err) {
          log(`Error running prettier: ${err.message}`);
          // We don't block the agent even if prettier fails
        }
      }

      process.stdout.write(JSON.stringify({ decision: 'allow' }));
    } catch (err) {
      log(`Hook error: ${err.message}`);
      process.stdout.write(JSON.stringify({ decision: 'allow' }));
    }
  });
}

main();
