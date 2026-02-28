'use strict';

// 过滤首页文章列表：只显示中文文章（排除 English 分类）
hexo.extend.filter.register('before_generate', function () {
  // 不做任何操作，使用 generator filter 方式
});

// 覆盖 index generator，过滤掉 English 分类的文章
hexo.extend.generator.register('index', function (locals) {
  const config = this.config;
  const posts = locals.posts.sort(config.index_generator.order_by || '-date')
    .filter(function (post) {
      // 排除 English 分类的文章
      const categories = post.categories.map(cat => cat.name);
      return !categories.includes('English');
    });

  const paginationDir = config.pagination_dir || 'page';
  const perPage = config.index_generator.per_page != null ? config.index_generator.per_page : config.per_page;
  const path = config.index_generator.path || '';

  const pages = perPage ? Math.ceil(posts.length / perPage) : 1;
  const result = [];

  for (let i = 0; i < pages; i++) {
    const start = i * (perPage || posts.length);
    const end = perPage ? start + perPage : posts.length;
    const pagePosts = posts.slice(start, end);

    result.push({
      path: i === 0 ? (path || 'index.html') : (path ? path + '/' : '') + paginationDir + '/' + (i + 1) + '/index.html',
      data: {
        base: path ? '/' + path + '/' : '/',
        total: pages,
        current: i + 1,
        current_url: i === 0 ? (path ? '/' + path + '/' : '/') : '/' + (path ? path + '/' : '') + paginationDir + '/' + (i + 1) + '/',
        posts: pagePosts,
        prev: i > 0 ? (i === 1 ? (path ? '/' + path + '/' : '/') : '/' + (path ? path + '/' : '') + paginationDir + '/' + i + '/') : 0,
        prev_link: i > 0 ? (i === 1 ? (path ? '/' + path + '/' : '/') : '/' + (path ? path + '/' : '') + paginationDir + '/' + i + '/') : '',
        next: i < pages - 1 ? '/' + (path ? path + '/' : '') + paginationDir + '/' + (i + 2) + '/' : 0,
        next_link: i < pages - 1 ? '/' + (path ? path + '/' : '') + paginationDir + '/' + (i + 2) + '/' : ''
      },
      layout: ['index', 'archive']
    });
  }

  return result;
});
