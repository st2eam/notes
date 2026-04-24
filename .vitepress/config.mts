import { defineConfig } from 'vitepress'
import sidebar from './sidebar'

export default defineConfig({
  base: '/notes/',
  title: "Steam's Notes",
  outDir: 'docs',
  description: 'A personal knowledge base',
  ignoreDeadLinks: true,
  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        href: 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Playfair+Display:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap',
        rel: 'stylesheet',
      },
    ],
    [
      'script',
      {},
      `(function(){try{var e=new URLSearchParams(window.location.search).get('embed')==='true';var f=window.self!==window.top;if(e||f){document.documentElement.classList.add('embed-mode')}}catch(x){}})()`,
    ],
  ],
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
    ],
    logo: '/logo.svg',
    search: {
      provider: 'local',
    },
    sidebar,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/st2eam' },
    ],
    outline: {
      label: '目录',
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
    lastUpdated: {
      text: '最后更新',
    },
    returnToTopLabel: '返回顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
  },
})
