/**
 * i18n 国际化脚本 — 红齐ideas
 * 支持中英文自动/手动切换
 * 根据浏览器语言自动检测，支持手动切换，localStorage 持久化
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'ideas-lang';

  // 翻译映射
  var translations = {
    'zh-CN': {
      '首页': '首页',
      '归档': '归档',
      '标签': '标签',
      '分类': '分类',
      '关于': '关于',
      '公告': '公告',
      '最新文章': '最新文章',
      '网站信息': '网站信息',
      '文章数目': '文章数目',
      '本站访客数': '本站访客数',
      '本站总浏览量': '本站总浏览量',
      '最后更新时间': '最后更新时间',
      '文章': '文章',
      '标签_stat': '标签',
      '分类_stat': '分类',
      '签名': '未来已来，不问前程，顺势而为。',
      '公告内容': '欢迎来到我的博客！记录想法、技术与生活。',
      'copyright_by': 'By 红齐',
      '发表于': '发表于',
      'lang_switch': '🌐 English',
      '目录': '目录',
      '搜索': '搜索',
    },
    'en': {
      '首页': 'Home',
      '归档': 'Archives',
      '标签': 'Tags',
      '分类': 'Categories',
      '关于': 'About',
      '公告': 'Announcement',
      '最新文章': 'Recent Posts',
      '网站信息': 'Site Info',
      '文章数目': 'Posts',
      '本站访客数': 'Visitors',
      '本站总浏览量': 'Page Views',
      '最后更新时间': 'Last Updated',
      '文章': 'Posts',
      '标签_stat': 'Tags',
      '分类_stat': 'Categories',
      '签名': 'The future is here. No looking back. Go with the flow.',
      '公告内容': 'Welcome to my blog! Recording ideas, tech & life.',
      'copyright_by': 'By Hongqi',
      '发表于': 'Posted on',
      'lang_switch': '🌐 中文',
      '目录': 'TOC',
      '搜索': 'Search',
    }
  };

  // 双向查找表：任意文本 → 翻译 key
  var textToKey = {};
  Object.keys(translations).forEach(function (lang) {
    var t = translations[lang];
    Object.keys(t).forEach(function (key) {
      textToKey[t[key]] = key;
    });
  });

  function getLang() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored && translations[stored]) return stored;
    var browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (browserLang.startsWith('zh')) return 'zh-CN';
    return 'en';
  }

  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    applyLang(lang);
  }

  function toggleLang() {
    var current = getLang();
    var next = current === 'zh-CN' ? 'en' : 'zh-CN';
    setLang(next);
  }

  // 核心：应用语言到所有 UI 元素
  function applyLang(lang) {
    var t = translations[lang];
    if (!t) return;

    document.documentElement.setAttribute('data-lang', lang);

    // --- 菜单项 ---
    var menuSelectors = '.menus_item a span, #sidebar-menus .menus_item a span';
    var menuMap = {
      '首页': true, 'Home': true,
      '归档': true, 'Archives': true,
      '标签': true, 'Tags': true,
      '分类': true, 'Categories': true,
      '关于': true, 'About': true,
    };
    document.querySelectorAll(menuSelectors).forEach(function (span) {
      var text = span.textContent.trim();
      var key = textToKey[text];
      if (key && menuMap[translations['zh-CN'][key]]) {
        span.textContent = ' ' + t[key];
      }
    });

    // --- 语言切换按钮 ---
    document.querySelectorAll('[data-i18n-role="lang-switch"]').forEach(function (btn) {
      var span = btn.querySelector('span');
      if (span) span.textContent = ' ' + t['lang_switch'];
    });

    // --- 侧边栏标题 ---
    var headlineKeys = { '公告': true, '最新文章': true, '网站信息': true, '目录': true,
      'Announcement': true, 'Recent Posts': true, 'Site Info': true, 'TOC': true };
    document.querySelectorAll('.item-headline span').forEach(function (span) {
      var text = span.textContent.trim();
      if (headlineKeys[text]) {
        var key = textToKey[text];
        if (key && t[key]) span.textContent = t[key];
      }
    });

    // --- 分类/标签/归档 卡片标题 ---
    var cardKeys = { '分类': true, '标签': true, '归档': true,
      'Categories': true, 'Tags': true, 'Archives': true };
    document.querySelectorAll('.card-categories .item-headline span, .card-tag-cloud .item-headline span, .card-archives .item-headline span').forEach(function (span) {
      var text = span.textContent.trim();
      if (cardKeys[text]) {
        var key = textToKey[text];
        if (key && t[key]) span.textContent = t[key];
      }
    });

    // --- 作者描述 ---
    var authorDesc = document.querySelector('.author-info-description');
    if (authorDesc) authorDesc.textContent = t['签名'];

    // --- 公告内容 ---
    var announcement = document.querySelector('.announcement_content');
    if (announcement) announcement.textContent = t['公告内容'];

    // --- 站点统计 (文章/标签/分类) ---
    var statOrder = ['文章', '标签_stat', '分类_stat'];
    var statEls = document.querySelectorAll('.site-data .headline');
    statEls.forEach(function (el, i) {
      if (statOrder[i] && t[statOrder[i]]) {
        el.textContent = t[statOrder[i]];
      }
    });

    // --- 网站信息项 ---
    var webinfoOrder = ['文章数目', '本站访客数', '本站总浏览量', '最后更新时间'];
    var webinfoEls = document.querySelectorAll('.webinfo-item .item-name');
    webinfoEls.forEach(function (el, i) {
      if (webinfoOrder[i] && t[webinfoOrder[i]]) {
        el.textContent = t[webinfoOrder[i]] + ' :';
      }
    });

    // --- 文章元信息 "发表于" ---
    document.querySelectorAll('.article-meta-label').forEach(function (el) {
      var text = el.textContent.trim();
      if (text === '发表于' || text === 'Posted on') {
        el.textContent = t['发表于'];
      }
    });

    // --- Footer ---
    var copyright = document.querySelector('#footer .copyright');
    if (copyright) {
      copyright.innerHTML = '&copy;&nbsp;2026 ' + t['copyright_by'];
    }

    // --- 首页文章列表语言过滤 ---
    filterPostsByLang(lang);
  }

  // 根据语言过滤首页文章卡片和侧边栏最新文章
  function filterPostsByLang(lang) {
    // 首页文章卡片
    var postItems = document.querySelectorAll('.recent-post-item');
    postItems.forEach(function (item) {
      var catLink = item.querySelector('.article-meta__categories');
      var isEnglish = false;
      if (catLink) {
        isEnglish = catLink.getAttribute('href').indexOf('/English') !== -1 ||
                    catLink.textContent.trim() === 'English';
      }
      if (lang === 'en') {
        item.style.display = isEnglish ? '' : 'none';
      } else if (lang === 'zh-CN') {
        item.style.display = isEnglish ? 'none' : '';
      } else {
        // 非中文非英文，默认显示英文
        item.style.display = isEnglish ? '' : 'none';
      }
    });

    // 侧边栏最新文章
    var asideItems = document.querySelectorAll('.card-recent-post .aside-list-item');
    asideItems.forEach(function (item) {
      var link = item.querySelector('a.title');
      if (!link) return;
      var href = link.getAttribute('href') || '';
      var title = link.textContent.trim();
      // 判断是否英文文章：URL 包含 -en/ 或标题全英文
      var isEnglish = /-en\/?$/.test(href) || /^[A-Za-z0-9\s\?\!\.\,\-\:\'\"]+$/.test(title);
      if (lang === 'en') {
        item.style.display = isEnglish ? '' : 'none';
      } else if (lang === 'zh-CN') {
        item.style.display = isEnglish ? 'none' : '';
      } else {
        item.style.display = isEnglish ? '' : 'none';
      }
    });
  }

  // 绑定语言切换按钮事件
  function bindLangSwitch() {
    document.querySelectorAll('.menus_item a, #sidebar-menus .menus_item a').forEach(function (a) {
      // 已经绑定过的跳过
      if (a.getAttribute('data-i18n-bound')) return;

      var text = a.textContent.trim();
      var href = a.getAttribute('href') || '';
      if (text.includes('English') || text.includes('中文') || a.querySelector('.fa-language')) {
        a.setAttribute('data-i18n-role', 'lang-switch');
        a.setAttribute('data-i18n-bound', '1');
        a.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          toggleLang();
          // 关闭移动端侧边栏（如果打开了）
          var mask = document.getElementById('menu-mask');
          if (mask) mask.click();
        });
      }
    });
  }

  // 完整初始化
  function fullInit() {
    bindLangSwitch();
    applyLang(getLang());
  }

  // 多次执行确保覆盖 Butterfly 的异步渲染
  function robustInit() {
    fullInit();
    // Butterfly 的 main.js 可能有异步操作，延迟再执行一次
    setTimeout(fullInit, 300);
    setTimeout(fullInit, 800);
    setTimeout(fullInit, 1500);
  }

  // DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', robustInit);
  } else {
    robustInit();
  }

  // window.onload 兜底（等所有资源加载完）
  window.addEventListener('load', function () {
    setTimeout(fullInit, 200);
  });

  // Pjax 兼容
  document.addEventListener('pjax:complete', function () {
    setTimeout(robustInit, 100);
  });

  // MutationObserver：监听 DOM 变化，自动重新应用
  // 只监听侧边栏和菜单区域的变化
  var observerTimer = null;
  var observer = new MutationObserver(function () {
    // 防抖：DOM 频繁变化时不要每次都执行
    if (observerTimer) clearTimeout(observerTimer);
    observerTimer = setTimeout(function () {
      bindLangSwitch();
      applyLang(getLang());
    }, 200);
  });

  // 开始观察
  function startObserver() {
    var targets = [
      document.getElementById('nav'),
      document.getElementById('aside-content'),
      document.getElementById('sidebar'),
      document.getElementById('footer')
    ];
    targets.forEach(function (target) {
      if (target) {
        observer.observe(target, { childList: true, subtree: true, characterData: true });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserver);
  } else {
    startObserver();
  }

  // 暴露全局 API
  window.i18n = {
    getLang: getLang,
    setLang: setLang,
    toggleLang: toggleLang,
    apply: function () { applyLang(getLang()); }
  };
})();







