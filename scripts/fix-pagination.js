/**
 * 后处理 HTML：修复上下篇和相关推荐的语言混乱问题
 * 直接在 HTML 生成后替换链接
 */

'use strict';

// 语言检测函数（与 lang-filter.js 保持一致）
function detectPostLang(post) {
  if (!post) return 'zh-CN';
  if (post.lang) return post.lang;
  if (post.categories) {
    const cats = post.categories.toArray();
    if (cats.some(c => c.name === 'English')) return 'en';
  }
  if (post.slug && post.slug.endsWith('-en')) return 'en';
  return 'zh-CN';
}

// 在 after_render:html filter 中修复分页链接和相关推荐
hexo.extend.filter.register('after_render:html', function(html, data) {
  // 只处理文章页面
  if (!data.page || data.page.layout !== 'post') return html;
  
  const currentLang = detectPostLang(data.page);
  const posts = hexo.locals.get('posts');
  const allPosts = posts.toArray();
  
  // 按语言分组并排序
  const sameLangPosts = allPosts
    .filter(post => detectPostLang(post) === currentLang)
    .sort((a, b) => (b.date || 0) - (a.date || 0));
  
  // 找到当前文章的索引
  const currentIndex = sameLangPosts.findIndex(post => post._id === data.page._id);
  
  if (currentIndex === -1) return html;
  
  const prevPost = currentIndex > 0 ? sameLangPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < sameLangPosts.length - 1 ? sameLangPosts[currentIndex + 1] : null;
  
  // 修复上下篇导航
  const paginationRegex = /<nav class="pagination-post"[^>]*>([\s\S]*?)<\/nav>/;
  const paginationMatch = html.match(paginationRegex);
  
  if (paginationMatch) {
    let newPagination = '<nav class="pagination-post" id="pagination">';
    
    if (prevPost) {
      const prevExcerpt = (prevPost.excerpt || '').replace(/<[^>]+>/g, '').substring(0, 200);
      const prevCover = prevPost.cover || 'var(--default-bg-color)';
      const prevCoverType = prevPost.cover_type;
      const hasDesc = prevExcerpt ? '' : ' no-desc';
      const fullWidth = nextPost ? '' : ' full-width';
      
      newPagination += `<a class="pagination-related${hasDesc}${fullWidth}" href="/${prevPost.path}" title="${escapeHtml(prevPost.title)}">`;
      if (prevCoverType === 'img') {
        newPagination += `<img class="cover" src="${prevCover}" alt="cover">`;
      } else {
        newPagination += `<div class="cover" style="background: ${prevCover}"></div>`;
      }
      newPagination += `<div class="info"><div class="info-1">`;
      newPagination += `<div class="info-item-1">上一篇</div>`;
      newPagination += `<div class="info-item-2">${escapeHtml(prevPost.title)}</div></div>`;
      if (prevExcerpt) {
        newPagination += `<div class="info-2"><div class="info-item-1">${escapeHtml(prevExcerpt)}</div></div>`;
      }
      newPagination += `</div></a>`;
    }
    
    if (nextPost) {
      const nextExcerpt = (nextPost.excerpt || '').replace(/<[^>]+>/g, '').substring(0, 200);
      const nextCover = nextPost.cover || 'var(--default-bg-color)';
      const nextCoverType = nextPost.cover_type;
      const hasDesc = nextExcerpt ? '' : ' no-desc';
      const fullWidth = prevPost ? '' : ' full-width';
      
      newPagination += `<a class="pagination-related${hasDesc}${fullWidth}" href="/${nextPost.path}" title="${escapeHtml(nextPost.title)}">`;
      if (nextCoverType === 'img') {
        newPagination += `<img class="cover" src="${nextCover}" alt="cover">`;
      } else {
        newPagination += `<div class="cover" style="background: ${nextCover}"></div>`;
      }
      newPagination += `<div class="info text-right"><div class="info-1">`;
      newPagination += `<div class="info-item-1">下一篇</div>`;
      newPagination += `<div class="info-item-2">${escapeHtml(nextPost.title)}</div></div>`;
      if (nextExcerpt) {
        newPagination += `<div class="info-2"><div class="info-item-1">${escapeHtml(nextExcerpt)}</div></div>`;
      }
      newPagination += `</div></a>`;
    }
    
    newPagination += '</nav>';
    html = html.replace(paginationRegex, newPagination);
  }
  
  // 修复相关推荐：完全删除 relatedPosts 区域，稍后重新生成
  const relatedRegex = /<div class="relatedPosts">[\s\S]*?<\/div><\/div>/;
  html = html.replace(relatedRegex, function() {
    // 生成同语言的相关推荐（基于标签）
    const currentTags = data.page.tags ? data.page.tags.toArray().map(t => t.name) : [];
    if (currentTags.length === 0) return ''; // 没有标签，不显示相关推荐
    
    // 找到同语言且有共同标签的文章
    const relatedPosts = sameLangPosts
      .filter(post => post._id !== data.page._id) // 排除当前文章
      .map(post => {
        const postTags = post.tags ? post.tags.toArray().map(t => t.name) : [];
        const commonTags = currentTags.filter(tag => postTags.includes(tag));
        return {
          post,
          score: commonTags.length
        };
      })
      .filter(item => item.score > 0) // 至少有一个共同标签
      .sort((a, b) => b.score - a.score || (b.post.date || 0) - (a.post.date || 0)) // 按共同标签数排序，再按日期
      .slice(0, 6); // 最多6个
    
    if (relatedPosts.length === 0) return ''; // 没有相关文章
    
    let relatedHTML = '<div class="relatedPosts"><div class="headline"><i class="fas fa-thumbs-up fa-fw"></i><span>相关推荐</span></div><div class="relatedPosts-list">';
    
    relatedPosts.forEach(function(item) {
      const post = item.post;
      const excerpt = (post.excerpt || post.content || '').replace(/<[^>]+>/g, '').substring(0, 200);
      const cover = post.cover || 'var(--default-bg-color)';
      const coverType = post.cover_type;
      const dateStr = post.date ? post.date.format('YYYY-MM-DD') : '';
      
      relatedHTML += `<a class="pagination-related" href="/${post.path}" title="${escapeHtml(post.title)}">`;
      if (coverType === 'img') {
        relatedHTML += `<img class="cover" src="${cover}" alt="cover">`;
      } else {
        relatedHTML += `<div class="cover" style="background: ${cover}"></div>`;
      }
      relatedHTML += `<div class="info text-center"><div class="info-1">`;
      relatedHTML += `<div class="info-item-1"><i class="far fa-calendar-alt fa-fw"></i> ${dateStr}</div>`;
      relatedHTML += `<div class="info-item-2">${escapeHtml(post.title)}</div></div>`;
      relatedHTML += `<div class="info-2"><div class="info-item-1">${escapeHtml(excerpt)}</div></div>`;
      relatedHTML += `</div></a>`;
    });
    
    relatedHTML += '</div></div>';
    return relatedHTML;
  });
  
  return html;
});

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
