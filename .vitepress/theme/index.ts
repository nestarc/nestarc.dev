// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import BlogPosts from './components/BlogPosts.vue'
import ArticleTrust from './components/ArticleTrust.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(ArticleTrust),
    })
  },
  enhanceApp({ app }) {
    app.component('BlogPosts', BlogPosts)
  }
} satisfies Theme
