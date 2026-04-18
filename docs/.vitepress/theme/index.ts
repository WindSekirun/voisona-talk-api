import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';
import '@catppuccin/vitepress/theme/mocha/mauve.css';

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {});
  },
};
