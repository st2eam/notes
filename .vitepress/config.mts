import { defineConfig } from 'vitepress'
import sidebar from './sidebar'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Awesome Notes",
  description: "A VitePress Site for Notes",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
      { text: 'API', link: '/api-examples' }
    ],

    sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
