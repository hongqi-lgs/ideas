/**
 * 生成文章中英文映射 JSON
 * 输出到 public/post-map.json
 * 供前端 i18n.js 使用
 * 
 * 包含：
 * 1. 中英文文章双向映射（路径+标题）
 * 2. 每篇文章在同语言文章中的 prev/next
 */

'use strict';

hexo.extend.generator.register('post-map', function (locals) {
  const posts = locals.posts.toArray();

  // 按 slug 分组：xxx 和 xxx-en 是一对
  const slugGroups = {};
  const allPosts = [];

  posts.forEach(function (post) {
    const slug = post.slug;
    const path = '/' + hexo.config.root.replace(/^\/|\/$/g, '') + '/' + post.path;
    const title = post.title;
    const isEnglish = slug.endsWith('-en') || 
      (post.categories && post.categories.toArray().some(c => c.name === 'English'));
    const lang = isEnglish ? 'en' : 'zh-CN';
    const date = post.date ? post.date.valueOf() : 0;
    // 提取摘要（纯文本，前200字符）
    const rawContent = (post.excerpt || post.content || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const excerpt = rawContent.substring(0, 200);

    const info = { path, title, lang, date, slug, excerpt };
    allPosts.push(info);

    // 提取 base slug（去掉 -en 后缀）
    const baseSlug = slug.replace(/-en$/, '');
    if (!slugGroups[baseSlug]) {
      slugGroups[baseSlug] = {};
    }
    slugGroups[baseSlug][lang] = info;
  });

  // 按语言分组并按日期排序（新→旧）
  const zhPosts = allPosts.filter(p => p.lang === 'zh-CN').sort((a, b) => b.date - a.date);
  const enPosts = allPosts.filter(p => p.lang === 'en').sort((a, b) => b.date - a.date);

  // 为每个语言组计算 prev/next（同语言内的上下篇，含摘要）
  function buildPrevNext(sortedPosts) {
    const result = {};
    for (let i = 0; i < sortedPosts.length; i++) {
      const current = sortedPosts[i];
      result[current.path] = {
        prev: i > 0 ? { path: sortedPosts[i - 1].path, title: sortedPosts[i - 1].title, excerpt: sortedPosts[i - 1].excerpt } : null,
        next: i < sortedPosts.length - 1 ? { path: sortedPosts[i + 1].path, title: sortedPosts[i + 1].title, excerpt: sortedPosts[i + 1].excerpt } : null
      };
    }
    return result;
  }

  const zhPrevNext = buildPrevNext(zhPosts);
  const enPrevNext = buildPrevNext(enPosts);

  // 构建最终映射
  const map = {};

  allPosts.forEach(function (post) {
    const baseSlug = post.slug.replace(/-en$/, '');
    const group = slugGroups[baseSlug];
    const entry = {};

    // 双向翻译映射
    if (post.lang === 'zh-CN' && group.en) {
      entry.en_path = group.en.path;
      entry.en_title = group.en.title;
      entry.en_excerpt = group.en.excerpt || '';
    } else if (post.lang === 'en' && group['zh-CN']) {
      entry['zh-CN_path'] = group['zh-CN'].path;
      entry['zh-CN_title'] = group['zh-CN'].title;
      entry['zh-CN_excerpt'] = group['zh-CN'].excerpt || '';
    }

    // 同语言 prev/next
    const pn = post.lang === 'zh-CN' ? zhPrevNext[post.path] : enPrevNext[post.path];
    if (pn) {
      entry.prev = pn.prev;
      entry.next = pn.next;
    }

    // 对应语言的 prev/next（用于切换语言后显示）
    if (post.lang === 'zh-CN' && group.en) {
      const enPn = enPrevNext[group.en.path];
      if (enPn) {
        entry.en_prev = enPn.prev;
        entry.en_next = enPn.next;
      }
    } else if (post.lang === 'en' && group['zh-CN']) {
      const zhPn = zhPrevNext[group['zh-CN'].path];
      if (zhPn) {
        entry['zh-CN_prev'] = zhPn.prev;
        entry['zh-CN_next'] = zhPn.next;
      }
    }

    map[post.path] = entry;
  });

  return {
    path: 'post-map.json',
    data: JSON.stringify(map)
  };
});




