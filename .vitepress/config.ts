import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Ideas',
  description: '红齐的个人博客 — 记录想法、技术与生活',
  base: '/ideas/',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/ideas/favicon.svg' }]
  ],
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/' },
      { text: '关于', link: '/about' },
      { text: 'GitHub', link: 'https://github.com/hongqi-lgs' }
    ],
    sidebar: {
      '/posts/': [
        {
          text: '2026',
          items: [
            { text: '开篇：为什么要写博客', link: '/posts/hello-world' },
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/hongqi-lgs' }
    ],
    footer: {
      message: 'Powered by VitePress',
      copyright: '© 2026 红齐'
    },
    search: {
      provider: 'local'
    },
    outline: {
      level: [2, 3],
      label: '目录'
    }
  }
})


