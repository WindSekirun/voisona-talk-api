import { VoisonaClient } from 'voisona-talk-api';

const client = new VoisonaClient({
  email: 'test@example.com',
  password: 'password',
});

console.log('ESM Client initialized successfully!');
console.log('Client base URL:', client.baseUrl);
// (Actual synthesis requires running editor and valid credentials)
