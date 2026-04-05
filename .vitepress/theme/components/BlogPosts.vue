<script setup>
import { data as posts } from '../../../blog/posts.data'

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="blog-posts">
    <article v-for="post of posts" :key="post.url" class="blog-post">
      <h2>
        <a :href="post.url">{{ post.frontmatter.title }}</a>
      </h2>
      <div class="blog-post-meta">
        <time>{{ formatDate(post.frontmatter.date) }}</time>
        <span v-if="post.frontmatter.author"> &middot; {{ post.frontmatter.author }}</span>
      </div>
      <p v-if="post.frontmatter.description" class="blog-post-desc">
        {{ post.frontmatter.description }}
      </p>
    </article>
  </div>
</template>

<style scoped>
.blog-posts {
  max-width: 640px;
}

.blog-post {
  padding: 24px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.blog-post:first-child {
  padding-top: 0;
}

.blog-post:last-child {
  border-bottom: none;
}

.blog-post h2 {
  margin: 0 0 8px;
  font-size: 1.25rem;
  font-weight: 600;
}

.blog-post h2 a {
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.blog-post h2 a:hover {
  color: var(--vp-c-brand-1);
}

.blog-post-meta {
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
  margin-bottom: 8px;
}

.blog-post-desc {
  margin: 0;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}
</style>
