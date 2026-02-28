/**
 * i18n 国际化脚本 — 小森ideas
 * 支持中英文自动/手动切换
 */
(function () {
  'use strict';

  // 翻译映射
  var translations = {
    'zh-CN': {
      // 菜单
      '首页': '首页',
      '归档': '归档',
      '标签': '标签',
      '分类': '分类',
      '关于': '关于',
      // 侧边栏
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
      // 作者卡片
      '签名': '未来已来，不问前程，顺势而为。',
      '公告内容': '欢迎来到我的博客！记录想法、技术与生活。',
      // footer
      'copyright_by': 'By 红齐',
      // 文章元信息
      '发表于': '发表于',
      // 语言切换按钮
      'lang_switch': '🌐 English',
      // 搜索
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
      '搜索': 'Search',
    }
  };

  var STORAGE_KEY = 'ideas-lang';

  // 获取当前语言
  function getLang() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored && translations[stored]) return stored;
    // 自动检测浏览器语言
    var browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (browserLang.startsWith('zh')) return 'zh-CN';
    return 'en';
  }

  // 设置语言
  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    applyLang(lang);
  }

  // 切换语言
  function toggleLang() {
    var current = getLang();
    var next = current === 'zh-CN' ? 'en' : 'zh-CN';
    setLang(next);
  }

  // 安全替换文本（保留子元素）
  function replaceText(el, newText) {
    // 找到第一个纯文本节点替换
    for (var i = 0; i < el.childNodes.length; i++) {
      var node = el.childNodes[i];
      if (node.nodeType === 3 && node.textContent.trim()) {
        node.textContent = newText;
        return true;
      }
    }
    return false;
  }

  // 应用语言
  function applyLang(lang) {
    var t = translations[lang];
    if (!t) return;

    document.documentElement.setAttribute('data-lang', lang);

    // 1. 菜单项（桌面 + 移动端侧边栏）
    var menuMap = {
      '首页': t['首页'], 'Home': t['首页'],
      '归档': t['归档'], 'Archives': t['归档'],
      '标签': t['标签'], 'Tags': t['标签'],
      '分类': t['分类'], 'Categories': t['分类'],
      '关于': t['关于'], 'About': t['关于'],
    };

    var menuLinks = document.querySelectorAll('.menus_item a span, #sidebar-menus .menus_item a span');
    menuLinks.forEach(function (span) {
      var text = span.textContent.trim();
      if (menuMap[text]) {
        span.textContent = ' ' + menuMap[text];
      }
    });

    // 2. 语言切换按钮
    var langBtns = document.querySelectorAll('[data-i18n-role="lang-switch"]');
    langBtns.forEach(function (btn) {
      var span = btn.querySelector('span');
      if (span) span.textContent = ' ' + t['lang_switch'];
    });

    // 3. 侧边栏标题
    var headlineMap = {
      '公告': t['公告'], 'Announcement': t['公告'],
      '最新文章': t['最新文章'], 'Recent Posts': t['最新文章'],
      '网站信息': t['网站信息'], 'Site Info': t['网站信息'],
    };
    var headlines = document.querySelectorAll('.item-headline span');
    headlines.forEach(function (span) {
      var text = span.textContent.trim();
      if (headlineMap[text]) {
        span.textContent = headlineMap[text];
      }
    });

    // 4. 作者描述
    var authorDesc = document.querySelector('.author-info-description');
    if (authorDesc) authorDesc.textContent = t['签名'];

    // 5. 公告内容
    var announcement = document.querySelector('.announcement_content');
    if (announcement) announcement.textContent = t['公告内容'];

    // 6. 站点统计标签（文章/标签/分类）
    var statHeadlines = document.querySelectorAll('.site-data .headline');
    var statMap = {
      '文章': t['文章'], 'Posts': t['文章'],
      '标签': t['标签_stat'], 'Tags': t['标签_stat'],
      '分类': t['分类_stat'], 'Categories': t['分类_stat'],
    };
    statHeadlines.forEach(function (el) {
      var text = el.textContent.trim();
      if (statMap[text]) el.textContent = statMap[text];
    });

    // 7. 网站信息项
    var webinfoItems = document.querySelectorAll('.webinfo-item .item-name');
    var webinfoMap = {
      '文章数目 :': t['文章数目'] + ' :',
      'Posts :': t['文章数目'] + ' :',
      '本站访客数 :': t['本站访客数'] + ' :',
      'Visitors :': t['本站访客数'] + ' :',
      '本站总浏览量 :': t['本站总浏览量'] + ' :',
      'Page Views :': t['本站总浏览量'] + ' :',
      '最后更新时间 :': t['最后更新时间'] + ' :',
      'Last Updated :': t['最后更新时间'] + ' :',
    };
    webinfoItems.forEach(function (el) {
      var text = el.textContent.trim();
      if (webinfoMap[text]) el.textContent = webinfoMap[text];
    });

    // 8. 文章元信息"发表于"
    var metaLabels = document.querySelectorAll('.article-meta-label');
    metaLabels.forEach(function (el) {
      var text = el.textContent.trim();
      if (text === '发表于' || text === 'Posted on') {
        el.textContent = t['发表于'];
      }
    });

    // 9. 分类标题（Butterfly 的分类/标签卡片标题）
    var cardTitles = document.querySelectorAll('.card-categories .item-headline span, .card-tag-cloud .item-headline span, .card-archives .item-headline span');
    var cardTitleMap = {
      '分类': t['分类'], 'Categories': t['分类'],
      '标签': t['标签'], 'Tags': t['标签'],
      '归档': t['归档'], 'Archives': t['归档'],
    };
    cardTitles.forEach(function (span) {
      var text = span.textContent.trim();
      if (cardTitleMap[text]) span.textContent = cardTitleMap[text];
    });
  }

  // 初始化
  function init() {
    var lang = getLang();

    // 给语言切换菜单项加标记
    var menuItems = document.querySelectorAll('.menus_item a');
    menuItems.forEach(function (a) {
      var text = a.textContent.trim();
      if (text.includes('English') || text.includes('中文')) {
        a.setAttribute('data-i18n-role', 'lang-switch');
        a.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          toggleLang();
        });
      }
    });

    applyLang(lang);
  }

  // DOM ready 后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Pjax 兼容（Butterfly 可能使用 pjax）
  document.addEventListener('pjax:complete', function () {
    setTimeout(init, 100);
  });

  // 暴露全局 API
  window.i18n = {
    getLang: getLang,
    setLang: setLang,
    toggleLang: toggleLang
  };
})();
