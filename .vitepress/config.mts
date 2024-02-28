import { defineConfig } from 'vitepress'
import sidebar from './sidebar'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/notebook/',
  title: "My Awesome Notes",
  description: "A VitePress Site for Notes",
  ignoreDeadLinks: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
      { text: 'API', link: '/api-examples' }
    ],

    search: {
      provider: 'local'
    },

    sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/st2eam' }
    ]
  }
})
