/**
 * i18n.js — 森哥 Ideas 多语言支持
 * 职责：UI翻译 + 文章过滤
 * 语言检测：localStorage > 浏览器语言 > en
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'ideas-lang';

  // ─── 翻译字典 ───────────────────────────────────────────────
  var T = {
    menu: {
      '首页':    { 'zh-CN': '首页',    'en': 'Home',       'ja': 'ホーム' },
      '归档':    { 'zh-CN': '归档',    'en': 'Archives',   'ja': 'アーカイブ' },
      '标签':    { 'zh-CN': '标签',    'en': 'Tags',       'ja': 'タグ' },
      '分类':    { 'zh-CN': '分类',    'en': 'Categories', 'ja': 'カテゴリー' },
      '关于':    { 'zh-CN': '关于',    'en': 'About',      'ja': 'について' },
      'Home':         { 'zh-CN': '首页',    'en': 'Home',       'ja': 'ホーム' },
      'Archives':     { 'zh-CN': '归档',    'en': 'Archives',   'ja': 'アーカイブ' },
      'Tags':         { 'zh-CN': '标签',    'en': 'Tags',       'ja': 'タグ' },
      'Categories':   { 'zh-CN': '分类',    'en': 'Categories', 'ja': 'カテゴリー' },
      'About':        { 'zh-CN': '关于',    'en': 'About',      'ja': 'について' },
      'ホーム':       { 'zh-CN': '首页',    'en': 'Home',       'ja': 'ホーム' },
      'アーカイブ':   { 'zh-CN': '归档',    'en': 'Archives',   'ja': 'アーカイブ' },
      'タグ':         { 'zh-CN': '标签',    'en': 'Tags',       'ja': 'タグ' },
      'カテゴリー':   { 'zh-CN': '分类',    'en': 'Categories', 'ja': 'カテゴリー' },
      'カテゴリ':     { 'zh-CN': '分类',    'en': 'Categories', 'ja': 'カテゴリー' },
      'について':     { 'zh-CN': '关于',    'en': 'About',      'ja': 'について' },
    },
    sidebar: {
      '公告':         { 'zh-CN': '公告',    'en': 'Announcement', 'ja': 'お知らせ' },
      '最新文章':     { 'zh-CN': '最新文章','en': 'Recent Posts', 'ja': '最新記事' },
      '网站信息':     { 'zh-CN': '网站信息','en': 'Site Info',    'ja': 'サイト情報' },
      '目录':         { 'zh-CN': '目录',    'en': 'TOC',          'ja': '目次' },
      '邮件订阅':     { 'zh-CN': '邮件订阅','en': 'Email Subscribe','ja': 'メール購読' },
      '分类':         { 'zh-CN': '分类',    'en': 'Categories',   'ja': 'カテゴリー' },
      '标签':         { 'zh-CN': '标签',    'en': 'Tags',         'ja': 'タグ' },
      '归档':         { 'zh-CN': '归档',    'en': 'Archives',     'ja': 'アーカイブ' },
      'Announcement': { 'zh-CN': '公告',    'en': 'Announcement', 'ja': 'お知らせ' },
      'Recent Posts': { 'zh-CN': '最新文章','en': 'Recent Posts', 'ja': '最新記事' },
      'Site Info':    { 'zh-CN': '网站信息','en': 'Site Info',    'ja': 'サイト情報' },
      'TOC':          { 'zh-CN': '目录',    'en': 'TOC',          'ja': '目次' },
      'Email Subscribe': { 'zh-CN': '邮件订阅','en': 'Email Subscribe','ja': 'メール購読' },
      'Categories':   { 'zh-CN': '分类',    'en': 'Categories',   'ja': 'カテゴリー' },
      'Tags':         { 'zh-CN': '标签',    'en': 'Tags',         'ja': 'タグ' },
      'Archives':     { 'zh-CN': '归档',    'en': 'Archives',     'ja': 'アーカイブ' },
      'お知らせ':     { 'zh-CN': '公告',    'en': 'Announcement', 'ja': 'お知らせ' },
      '最新記事':     { 'zh-CN': '最新文章','en': 'Recent Posts', 'ja': '最新記事' },
      'サイト情報':   { 'zh-CN': '网站信息','en': 'Site Info',    'ja': 'サイト情報' },
      '目次':         { 'zh-CN': '目录',    'en': 'TOC',          'ja': '目次' },
      'メール購読':   { 'zh-CN': '邮件订阅','en': 'Email Subscribe','ja': 'メール購読' },
      'カテゴリー':   { 'zh-CN': '分类',    'en': 'Categories',   'ja': 'カテゴリー' },
      'カテゴリ':     { 'zh-CN': '分类',    'en': 'Categories',   'ja': 'カテゴリー' },
      'タグ':         { 'zh-CN': '标签',    'en': 'Tags',         'ja': 'タグ' },
      'アーカイブ':   { 'zh-CN': '归档',    'en': 'Archives',     'ja': 'アーカイブ' },
    },
    stats: {
      '文章':     { 'zh-CN': '文章', 'en': 'Posts',      'ja': '記事' },
      '标签':     { 'zh-CN': '标签', 'en': 'Tags',       'ja': 'タグ' },
      '分类':     { 'zh-CN': '分类', 'en': 'Categories', 'ja': 'カテゴリー' },
      'Posts':    { 'zh-CN': '文章', 'en': 'Posts',      'ja': '記事' },
      'Articles': { 'zh-CN': '文章', 'en': 'Posts',      'ja': '記事' },
      'Tags':     { 'zh-CN': '标签', 'en': 'Tags',       'ja': 'タグ' },
      'Categories':{ 'zh-CN': '分类','en': 'Categories', 'ja': 'カテゴリー' },
      '記事':     { 'zh-CN': '文章', 'en': 'Posts',      'ja': '記事' },
      'タグ':     { 'zh-CN': '标签', 'en': 'Tags',       'ja': 'タグ' },
      'カテゴリー':{ 'zh-CN': '分类','en': 'Categories', 'ja': 'カテゴリー' },
    },
    meta: {
      '发表于':   { 'zh-CN': '发表于', 'en': 'Posted on', 'ja': '投稿日' },
      'Posted on':{ 'zh-CN': '发表于', 'en': 'Posted on', 'ja': '投稿日' },
      '投稿日':   { 'zh-CN': '发表于', 'en': 'Posted on', 'ja': '投稿日' },
    },
    pagination: {
      '上一篇':   { 'zh-CN': '上一篇', 'en': 'Previous', 'ja': '前の記事' },
      '下一篇':   { 'zh-CN': '下一篇', 'en': 'Next',     'ja': '次の記事' },
      'Previous': { 'zh-CN': '上一篇', 'en': 'Previous', 'ja': '前の記事' },
      'Next':     { 'zh-CN': '下一篇', 'en': 'Next',     'ja': '次の記事' },
      '前の記事': { 'zh-CN': '上一篇', 'en': 'Previous', 'ja': '前の記事' },
      '次の記事': { 'zh-CN': '下一篇', 'en': 'Next',     'ja': '次の記事' },
    },
    related: {
      '相关推荐':    { 'zh-CN': '相关推荐', 'en': 'Related Posts', 'ja': '関連記事' },
      'Related Posts':{ 'zh-CN': '相关推荐', 'en': 'Related Posts', 'ja': '関連記事' },
      '関連記事':   { 'zh-CN': '相关推荐', 'en': 'Related Posts', 'ja': '関連記事' },
    },
    sign: {
      'zh-CN': '未来已来，不问前程，顺势而为。',
      'en': 'The future is here. No looking back. Go with the flow.',
      'ja': '未来は来た、前を見ず、流れに従う。',
    },
    announce: {
      'zh-CN': '欢迎来到森哥 Ideas！未来已来，不问前程，顺势而为。',
      'en': 'Welcome to my blog! Recording ideas, tech & life.',
      'ja': 'ブログへようこそ！アイデア、技術、生活を記録します。',
    },
    reward: {
      'zh-CN': '觉得有帮助？请我喝杯咖啡 ☕',
      'en': 'Found it helpful? Buy me a coffee ☕',
      'ja': '役に立ちましたか？コーヒーをおごってください ☕',
    },
    wechat:  { 'zh-CN': '微信',  'en': 'WeChat', 'ja': 'WeChat' },
    alipay:  { 'zh-CN': '支付宝','en': 'Alipay', 'ja': 'Alipay' },
    copyright: {
      by: { 'zh-CN': 'By 森哥', 'en': 'By bob', 'ja': 'By 森哥' },
      content: {
        'zh-CN': '本博客所有文章除特别声明外，均采用 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">CC BY-NC-SA 4.0</a> 许可协议。转载请注明来源 <a href="https://hongqi-lgs.github.io/ideas" target="_blank">森哥 Ideas</a>！',
        'en': 'All articles on this blog are licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">CC BY-NC-SA 4.0</a> unless otherwise stated. Please credit <a href="https://hongqi-lgs.github.io/ideas" target="_blank">bob Ideas</a>!',
        'ja': 'このブログのすべての記事は、特に明記されていない限り、<a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">CC BY-NC-SA 4.0</a>ライセンスの下で提供されます。出典を明記してください <a href="https://hongqi-lgs.github.io/ideas" target="_blank">森哥 Ideas</a>！',
      },
      author: { 'zh-CN': '文章作者: ', 'en': 'Author: ',    'ja': '著者: ' },
      link:   { 'zh-CN': '文章链接: ', 'en': 'Post Link: ', 'ja': '記事リンク: ' },
      notice: { 'zh-CN': '版权声明: ', 'en': 'Copyright: ', 'ja': '著作権: ' },
    },
  };

  // ─── 语言检测 ────────────────────────────────────────────────
  function getLang() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored && ['zh-CN', 'en', 'ja'].indexOf(stored) !== -1) return stored;
    var bl = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (bl.startsWith('zh')) return 'zh-CN';
    if (bl.startsWith('ja')) return 'ja';
    return 'en';
  }

  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
  }

  // ─── URL 判断文章语言 ─────────────────────────────────────────
  function postLangFromHref(href) {
    if (!href) return 'zh-CN';
    if (/-en[\/\?#]/.test(href) || /-en$/.test(href)) return 'en';
    if (/-ja[\/\?#]/.test(href) || /-ja$/.test(href)) return 'ja';
    return 'zh-CN';
  }

  // ─── 翻译辅助 ────────────────────────────────────────────────
  function tr(dict, text, lang) {
    return (dict[text] && dict[text][lang]) || null;
  }

  function translateEl(dict, el, lang) {
    var text = el.textContent.trim();
    var result = tr(dict, text, lang);
    if (result) el.textContent = result;
  }

  // ─── 应用 UI 翻译 ─────────────────────────────────────────────
  function applyTranslations(lang) {
    // 菜单
    document.querySelectorAll('.menus_item a.site-page span, #sidebar-menus .menus_item a span').forEach(function(el) {
      translateEl(T.menu, el, lang);
    });

    // 侧边栏标题
    document.querySelectorAll('.item-headline span').forEach(function(el) {
      translateEl(T.sidebar, el, lang);
    });

    // 站点统计
    document.querySelectorAll('.site-data a .headline').forEach(function(el) {
      translateEl(T.stats, el, lang);
    });

    // 文章元信息
    document.querySelectorAll('.article-meta-label').forEach(function(el) {
      translateEl(T.meta, el, lang);
    });

    // 上一篇/下一篇
    document.querySelectorAll('.pagination-post .info-item-1').forEach(function(el) {
      translateEl(T.pagination, el, lang);
    });

    // 相关推荐标题
    var relEl = document.querySelector('.relatedPosts .headline span');
    if (relEl) translateEl(T.related, relEl, lang);

    // 作者名/描述/签名
    document.querySelectorAll('.author-info-name').forEach(function(el) {
      el.textContent = lang === 'en' ? 'bob' : '森哥';
    });
    document.querySelectorAll('.site-name').forEach(function(el) {
      el.textContent = lang === 'en' ? 'bob Ideas' : '森哥 Ideas';
    });
    var desc = document.querySelector('.author-info-description');
    if (desc) desc.textContent = T.sign[lang];

    // 公告
    var ann = document.querySelector('.announcement_content');
    if (ann) ann.textContent = T.announce[lang];

    // Footer
    var foot = document.querySelector('#footer .copyright');
    if (foot) foot.innerHTML = '&copy;&nbsp;2026 ' + T.copyright.by[lang];

    // 打赏
    var rewardBtn = document.querySelector('.reward-button');
    if (rewardBtn) {
      var icon = rewardBtn.querySelector('i');
      rewardBtn.innerHTML = (icon ? icon.outerHTML : '') + T.reward[lang];
    }
    document.querySelectorAll('.post-qr-code-desc').forEach(function(el) {
      var t = el.textContent.trim();
      if (t === '微信' || t === 'WeChat') el.textContent = T.wechat[lang];
      if (t === '支付宝' || t === 'Alipay') el.textContent = T.alipay[lang];
    });

    // 版权
    document.querySelectorAll('.post-copyright-meta').forEach(function(el) {
      var t = el.textContent.trim();
      var icon = el.querySelector('i');
      var iconHtml = icon ? icon.outerHTML : '';
      if (t.includes('文章作者') || t.includes('Author') || t.includes('著者'))
        el.innerHTML = iconHtml + T.copyright.author[lang];
      else if (t.includes('文章链接') || t.includes('Post Link') || t.includes('記事リンク'))
        el.innerHTML = iconHtml + T.copyright.link[lang];
      else if (t.includes('版权') || t.includes('Copyright') || t.includes('著作権'))
        el.innerHTML = iconHtml + T.copyright.notice[lang];
    });
    var copyrightInfo = document.querySelector('.post-copyright__notice .post-copyright-info');
    if (copyrightInfo) copyrightInfo.innerHTML = T.copyright.content[lang];
  }

  // ─── 文章过滤 ─────────────────────────────────────────────────
  function filterPosts(lang) {
    // 首页卡片（用分类 URL 判断）
    document.querySelectorAll('.recent-post-item').forEach(function(item) {
      var catLink = item.querySelector('.article-meta__categories');
      var catHref = catLink ? (catLink.getAttribute('href') || '') : '';
      var isEn = catHref.indexOf('/English') !== -1;
      var isJa = catHref.indexOf('/Japanese') !== -1;
      var show = (lang === 'en' && isEn) ||
                 (lang === 'ja' && isJa) ||
                 (lang === 'zh-CN' && !isEn && !isJa);
      item.style.display = show ? '' : 'none';
    });

    // 归档/标签/分类页面列表（用文章 URL 判断）
    document.querySelectorAll('.article-sort-item').forEach(function(item) {
      if (item.classList.contains('year')) return;
      var link = item.querySelector('.article-sort-item-title');
      if (!link) return;
      var pl = postLangFromHref(link.getAttribute('href'));
      item.style.display = (pl === lang) ? '' : 'none';
    });

    // 侧边栏最新文章
    document.querySelectorAll('.card-recent-post .aside-list-item').forEach(function(item) {
      var link = item.querySelector('a.title');
      if (!link) return;
      var pl = postLangFromHref(link.getAttribute('href'));
      item.style.display = (pl === lang) ? '' : 'none';
    });

    // 相关推荐
    document.querySelectorAll('.relatedPosts .relatedPost-item').forEach(function(item) {
      var link = item.querySelector('a');
      if (!link) return;
      var pl = postLangFromHref(link.getAttribute('href'));
      item.style.display = (pl === lang) ? '' : 'none';
    });
  }

  // ─── 统一入口 ─────────────────────────────────────────────────
  function apply() {
    var lang = getLang();
    applyTranslations(lang);
    filterPosts(lang);
  }

  // ─── 暴露 API ─────────────────────────────────────────────────
  window.i18n = {
    getLang: getLang,
    setLang: function(lang) {
      setLang(lang);
      apply();
    },
    apply: apply,
  };

  // ─── 初始化：等 DOM ready 后执行一次 ──────────────────────────
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(apply);

  // 监听 PJAX 完成（Butterfly 主题）
  document.addEventListener('pjax:complete', apply);

})();
