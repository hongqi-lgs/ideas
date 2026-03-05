// 语言切换器 - 事件驱动版
(function() {
  var STORAGE_KEY = 'ideas-lang';

  function getLang() {
    var lang = localStorage.getItem(STORAGE_KEY);
    if (lang && ['zh-CN', 'en', 'ja'].includes(lang)) return lang;
    var browserLang = (navigator.language || '').toLowerCase();
    if (browserLang.startsWith('zh')) return 'zh-CN';
    if (browserLang.startsWith('ja')) return 'ja';
    return 'en';
  }

  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    // 触发自定义事件通知 i18n.js
    var event = new CustomEvent('langchange', { detail: { lang: lang } });
    window.dispatchEvent(event);
  }

  function isPostPage() {
    var path = window.location.pathname;
    if (path.indexOf('/about/') !== -1) return true;
    if (path.match(/\/(tags|categories|archives|page)\//)) return false;
    if (path === '/' || path === '/index.html') return false;
    return path.match(/\/\d{4}\/\d{2}\/\d{2}\//);
  }

  function getTranslatedPath(targetLang) {
    var path = window.location.pathname.replace(/\/+$/, '').replace(/\.html$/, '');
    
    if (path.indexOf('/about') !== -1) {
      if (targetLang === 'ja') return {primary: '/about/index-ja.html', fallback: '/about/index-en.html'};
      if (targetLang === 'en') return {primary: '/about/index-en.html', fallback: null};
      return {primary: '/about/', fallback: null};
    }

    var isJa = path.match(/-ja$/);
    var isEn = path.match(/-en$/);
    var base = path.replace(/-(en|ja)$/, '');

    if (targetLang === 'ja') {
      return isJa ? null : {primary: base + '-ja/', fallback: base + '-en/'};
    } else if (targetLang === 'en') {
      return isEn ? null : {primary: base + '-en/', fallback: null};
    } else {
      return (isJa || isEn) ? {primary: base + '/', fallback: null} : null;
    }
  }

  function checkUrl(url, callback) {
    fetch(url, {method: 'HEAD'})
      .then(function(res) { callback(res.ok); })
      .catch(function() { callback(false); });
  }

  function switchLang(lang) {
    console.log('[Lang] Switching to:', lang);
    localStorage.setItem(STORAGE_KEY, lang);
    
    if (isPostPage()) {
      var paths = getTranslatedPath(lang);
      if (!paths) {
        window.location.reload();
        return;
      }
      
      var target = paths.primary || paths;
      var fallback = paths.fallback;
      
      checkUrl(target, function(ok) {
        if (ok) {
          window.location.href = target;
        } else if (fallback) {
          console.log('[Lang] Fallback to:', fallback);
          checkUrl(fallback, function(ok2) {
            window.location.href = ok2 ? fallback : target;
          });
        } else {
          window.location.reload();
        }
      });
    } else {
      window.location.reload();
    }
  }

  function filterPosts() {
    var lang = getLang();
    var posts = document.querySelectorAll('.recent-post-item');
    var visible = 0;
    
    posts.forEach(function(post) {
      var cat = post.querySelector('.article-meta__categories');
      if (!cat) return;
      
      var href = cat.getAttribute('href') || '';
      var isEn = href.indexOf('/English') > -1;
      var isJa = href.indexOf('/Japanese') > -1;
      
      var show = (lang === 'zh-CN' && !isEn && !isJa) ||
                 (lang === 'en' && isEn) ||
                 (lang === 'ja' && (isJa || isEn));
      
      post.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    
    console.log('[Lang] Visible posts:', visible);
  }

  function createSelector() {
    var links = document.querySelectorAll('a');
    
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      if (link.getAttribute('data-lang-sel')) continue;
      
      var text = link.textContent.trim();
      if (!text.includes('语言') && !link.href.includes('javascript:void')) continue;
      
      link.setAttribute('data-lang-sel', '1');
      
      var sel = document.createElement('select');
      sel.style.cssText = 'padding:6px 12px;border:1px solid rgba(255,255,255,0.3);border-radius:4px;background:rgba(255,255,255,0.15);color:#fff;cursor:pointer;font-size:14px';
      
      var lang = getLang();
      var opts = [
        {v:'zh-CN',l:'🇨🇳 中文'},
        {v:'en',l:'🇺🇸 EN'},
        {v:'ja',l:'🇯🇵 日本語'}
      ];
      
      for (var j = 0; j < opts.length; j++) {
        var opt = document.createElement('option');
        opt.value = opts[j].v;
        opt.textContent = opts[j].l;
        opt.style.cssText = 'background:#fff;color:#333';
        if (opts[j].v === lang) opt.selected = true;
        sel.appendChild(opt);
      }
      
      sel.onchange = function() { switchLang(this.value); };
      link.parentNode.replaceChild(sel, link);
      console.log('[Lang] Selector created');
      break;
    }
  }

  function init() {
    console.log('[Lang] Current:', getLang());
    createSelector();
    
    var isHome = window.location.pathname === '/' || 
                 window.location.pathname.match(/^\/page\/\d+\//);
    if (isHome) filterPosts();
    
    // 通知 i18n.js 当前语言
    setLang(getLang());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
