/**
 * 生成文章中英文映射 JSON
 * 输出到 public/post-map.json
 * 供前端 i18n.js 使用
 */

'use strict';

hexo.extend.generator.register('post-map', function (locals) {
  const posts = locals.posts.toArray();
  const map = {};

  // 按 slug 分组：xxx 和 xxx-en 是一对
  const slugGroups = {};

  posts.forEach(function (post) {
    const slug = post.slug;
    const path = '/' + hexo.config.root.replace(/^\/|\/$/g, '') + '/' + post.path;
    const title = post.title;
    const lang = post.lang || (post.categories && post.categories.toArray().some(c => c.name === 'English') ? 'en' : 'zh-CN');

    // 提取 base slug（去掉 -en 后缀）
    const baseSlug = slug.replace(/-en$/, '');
    if (!slugGroups[baseSlug]) {
      slugGroups[baseSlug] = {};
    }

    if (slug.endsWith('-en')) {
      slugGroups[baseSlug].en = { path: path, title: title };
    } else {
      slugGroups[baseSlug]['zh-CN'] = { path: path, title: title };
    }
  });

  // 构建双向映射
  Object.keys(slugGroups).forEach(function (baseSlug) {
    const group = slugGroups[baseSlug];
    if (group['zh-CN'] && group.en) {
      map[group['zh-CN'].path] = {
        en_path: group.en.path,
        en_title: group.en.title
      };
      map[group.en.path] = {
        'zh-CN_path': group['zh-CN'].path,
        'zh-CN_title': group['zh-CN'].title
      };
    }
  });

  return {
    path: 'post-map.json',
    data: JSON.stringify(map)
  };
});

