const { VoisonaClient } = require('voisona-talk-api');

const client = new VoisonaClient({
  email: 'test@example.com',
  password: 'password',
});

console.log('CJS Client initialized successfully!');
console.log('Client base URL:', client.baseUrl);
