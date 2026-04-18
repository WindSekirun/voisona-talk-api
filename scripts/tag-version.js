import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

try {
  const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));
  const version = pkg.version;
  const tag = `v${version}`;

  // Check if the tag already exists locally or on remote
  try {
    execSync(`git rev-parse ${tag}`, { stdio: 'ignore' });
    console.log(`Tag ${tag} already exists.`);
  } catch {
    console.log(`New version detected: ${version}. Creating tag ${tag}...`);
    execSync(`git tag ${tag}`);

    console.log(`Pushing tag ${tag} to origin...`);
    execSync(`git push origin ${tag}`);
    console.log(`Successfully pushed ${tag}. GitHub Actions will handle the deployment.`);
  }
} catch (error) {
  console.error('Error during automatic tagging:', error.message);
}
