import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'VoiSona Talk API',
  description: 'A TypeScript library for the VoiSona Talk API',
  base: '/voisona-talk-api/',
  ignoreDeadLinks: true,
  lastUpdated: true,
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Examples', link: '/examples/simple-synthesis' },
      { text: 'API Reference', link: '/api/' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Connection Guide', link: '/CONNECT_WITH_VOISONA' },
          { text: 'Voice Selection Rules', link: '/guide/voice-selection' },
          { text: 'Custom Pronunciation', link: '/guide/custom-pronunciation' },
          { text: 'Advanced Style Control', link: '/guide/advanced-control' },
          { text: 'Phoneme Data & Timing', link: '/guide/phoneme-data' },
          { text: 'Queue Management', link: '/guide/queue-management' },
        ],
      },
      {
        text: 'Examples',
        items: [
          { text: 'List Available Voices', link: '/examples/list-voices' },
          { text: 'Simple Synthesis', link: '/examples/simple-synthesis' },
          { text: 'Bulk Synthesis', link: '/examples/bulk-synthesis' },
        ],
      },
      {
        text: 'API Reference',
        collapsed: false,
        items: [{ text: 'Overview', link: '/api/' }],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/WindSekirun/voisona-talk-api' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/voisona-talk-api' },
    ],
  },
});
