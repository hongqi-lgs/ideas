/**
 * lang-switcher.js — 语言选择器 + 文章页跳转
 * 职责：渲染语言下拉框，切换时跳转或重载
 * 注意：文章过滤由 i18n.js 统一负责，本文件不做过滤
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'ideas-lang';

  function getLang() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored && ['zh-CN', 'en', 'ja'].indexOf(stored) !== -1) return stored;
    var bl = (navigator.language || '').toLowerCase();
    if (bl.startsWith('zh')) return 'zh-CN';
    if (bl.startsWith('ja')) return 'ja';
    return 'en';
  }

  // 判断是否文章/关于页（需要跳转到对应语言版本）
  function isPostPage() {
    var path = window.location.pathname;
    if (path.indexOf('/about') !== -1) return true;
    if (/\/(tags|categories|archives|page)\//.test(path)) return false;
    if (path === '/' || path === '/index.html') return false;
    return /\/\d{4}\/\d{2}\/\d{2}\//.test(path);
  }

  function getTargetPath(targetLang) {
    var path = window.location.pathname.replace(/\/+$/, '').replace(/\.html$/, '');

    // 关于页
    if (path.indexOf('/about') !== -1) {
      if (targetLang === 'ja') return '/about/index-ja.html';
      if (targetLang === 'en') return '/about/index-en.html';
      return '/about/';
    }

    // 文章页
    var base = path.replace(/-(en|ja)$/, '');
    if (targetLang === 'ja') return base + '-ja/';
    if (targetLang === 'en') return base + '-en/';
    return base + '/';
  }

  function switchLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);

    if (isPostPage()) {
      var target = getTargetPath(lang);
      // 检测目标页面是否存在，不存在则降级到首页
      fetch(target, { method: 'HEAD' })
        .then(function(r) {
          window.location.href = r.ok ? target : '/';
        })
        .catch(function() {
          window.location.href = target;
        });
    } else {
      // 非文章页：让 i18n.js 直接重新应用（无需刷新）
      if (window.i18n) window.i18n.setLang(lang);
    }
  }

  // 创建语言选择下拉框（只创建一次，用标记防重复）
  function createSelector() {
    var langLink = document.querySelector('a.site-page[href="javascript:void(0)"], .menus_item a.site-page[href^="javascript"]');
    if (!langLink || langLink.getAttribute('data-lang-sel')) return;
    langLink.setAttribute('data-lang-sel', '1');

    var lang = getLang();
    var sel = document.createElement('select');
    sel.style.cssText = 'padding:4px 10px;border:1px solid rgba(255,255,255,0.3);border-radius:4px;background:rgba(255,255,255,0.15);color:#fff;cursor:pointer;font-size:14px;outline:none;';

    [
      { v: 'zh-CN', l: '🇨🇳 中文' },
      { v: 'en',    l: '🇺🇸 EN' },
      { v: 'ja',    l: '🇯🇵 日本語' },
    ].forEach(function(o) {
      var opt = document.createElement('option');
      opt.value = o.v;
      opt.textContent = o.l;
      opt.style.cssText = 'background:#333;color:#fff;';
      if (o.v === lang) opt.selected = true;
      sel.appendChild(opt);
    });

    sel.addEventListener('change', function() {
      switchLang(this.value);
    });

    langLink.parentNode.replaceChild(sel, langLink);
  }

  // 拦截关于页链接
  function interceptAbout() {
    document.querySelectorAll('.menus_item a.site-page[href*="/about"]').forEach(function(link) {
      if (link.getAttribute('data-about-intercept')) return;
      link.setAttribute('data-about-intercept', '1');
      link.addEventListener('click', function(e) {
        e.preventDefault();
        var lang = getLang();
        var url = lang === 'en' ? '/about/index-en.html' : lang === 'ja' ? '/about/index-ja.html' : '/about/';
        window.location.href = url;
      });
    });
  }

  function init() {
    createSelector();
    interceptAbout();
  }

  // DOM ready 后执行一次
  if (document.readyState !== 'loading') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }

  // PJAX 后重新初始化
  document.addEventListener('pjax:complete', init);

})();
