import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import './style.css'
import './embed.css'

import type { Theme } from 'vitepress'

export default {
  extends: DefaultTheme,
  Layout,
} satisfies Theme
