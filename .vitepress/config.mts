import { defineConfig } from 'vitepress'
import sidebar from './sidebar'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/notes/',
  title: "My Awesome Notes",
  outDir:'docs',
  description: "A VitePress Site for Notes",
  ignoreDeadLinks: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
      { text: 'API', link: '/api-examples' }
    ],
    logo: '/logo.svg',
    search: {
      provider: 'local'
    },

    sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/st2eam' }
    ]
  }
})
