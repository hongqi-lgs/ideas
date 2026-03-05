// 语言切换器 - 完整版（切换+过滤+UI翻译）
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

  function isPostPage() {
    var path = window.location.pathname;
    if (path.indexOf('/about/') !== -1) return true;
    if (path.match(/\/(tags|categories|archives|page)\//)) return false;
    if (path === '/' || path === '/index.html') return false;
    if (path.match(/\/\d{4}\/\d{2}\/\d{2}\//)) return true;
    return false;
  }

  function getTranslatedPath(targetLang) {
    var path = window.location.pathname;
    var cleanPath = path.replace(/\/+$/, '').replace(/\.html$/, '');
    
    if (cleanPath.indexOf('/about') !== -1) {
      if (targetLang === 'ja') return cleanPath.match(/index-ja/) ? null : '/about/index-ja.html';
      if (targetLang === 'en') return cleanPath.match(/index-en/) ? null : '/about/index-en.html';
      return cleanPath.match(/index-(en|ja)/) ? '/about/' : null;
    }

    var currentIsJa = cleanPath.match(/-ja$/);
    var currentIsEn = cleanPath.match(/-en$/);
    var basePath = cleanPath.replace(/-(en|ja)$/, '');

    if (targetLang === 'ja') {
      if (currentIsJa) return null;
      return {primary: basePath + '-ja/', fallback: basePath + '-en/'};
    } else if (targetLang === 'en') {
      if (currentIsEn) return null;
      return {primary: basePath + '-en/', fallback: null};
    } else {
      return (currentIsJa || currentIsEn) ? {primary: basePath + '/', fallback: null} : null;
    }
  }

  function checkUrlExists(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', url, true);
    xhr.timeout = 2000;
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) callback(xhr.status === 200);
    };
    xhr.onerror = function() { callback(false); };
    xhr.ontimeout = function() { callback(false); };
    xhr.send();
  }

  function switchLang(lang) {
    console.log('[Lang] Switching to:', lang);
    localStorage.setItem(STORAGE_KEY, lang);
    
    if (isPostPage()) {
      var pathResult = getTranslatedPath(lang);
      if (pathResult) {
        var targetPath = pathResult.primary || pathResult;
        var fallbackPath = pathResult.fallback;
        
        checkUrlExists(targetPath, function(exists) {
          if (exists) {
            console.log('[Lang] Jumping to:', targetPath);
            window.location.href = targetPath;
          } else if (fallbackPath) {
            checkUrlExists(fallbackPath, function(fallbackExists) {
              if (fallbackExists) {
                console.log('[Lang] Fallback to:', fallbackPath);
                window.location.href = fallbackPath;
              } else {
                window.location.reload();
              }
            });
          } else {
            window.location.reload();
          }
        });
        return;
      }
    }
    
    window.location.reload();
  }

  // 首页文章过滤
  function filterHomePosts() {
    var currentLang = getLang();
    var posts = document.querySelectorAll('.recent-post-item');
    var count = 0;
    
    posts.forEach(function(post) {
      var categoryLink = post.querySelector('.article-meta__categories');
      if (!categoryLink) return;
      
      var href = categoryLink.getAttribute('href') || '';
      var isEnglish = href.indexOf('/English') !== -1;
      var isJapanese = href.indexOf('/Japanese') !== -1;
      
      var shouldShow = false;
      if (currentLang === 'zh-CN') {
        shouldShow = !isEnglish && !isJapanese;
      } else if (currentLang === 'en') {
        shouldShow = isEnglish;
      } else if (currentLang === 'ja') {
        shouldShow = isJapanese || isEnglish;
      }
      
      post.style.display = shouldShow ? '' : 'none';
      if (shouldShow) count++;
    });
    
    console.log('[Lang] Filtered posts:', count);
  }

  // 创建选择器
  function createSelector() {
    var links = document.querySelectorAll('a');
    
    links.forEach(function(link) {
      if (link.getAttribute('data-lang-bound')) return;
      
      if (link.textContent.includes('语言') || link.href.includes('javascript:void')) {
        link.setAttribute('data-lang-bound', '1');
        
        var select = document.createElement('select');
        select.style.cssText = 'padding: 6px 12px; border: 1px solid rgba(255,255,255,0.3); border-radius: 4px; background: rgba(255,255,255,0.15); color: #fff; cursor: pointer; font-size: 14px;';
        
        var currentLang = getLang();
        [
          {value: 'zh-CN', label: '🇨🇳 中文'},
          {value: 'en', label: '🇺🇸 EN'},
          {value: 'ja', label: '🇯🇵 日本語'}
        ].forEach(function(opt) {
          var option = document.createElement('option');
          option.value = opt.value;
          option.textContent = opt.label;
          option.style.cssText = 'background: #fff; color: #333;';
          if (opt.value === currentLang) option.selected = true;
          select.appendChild(option);
        });
        
        select.addEventListener('change', function() {
          switchLang(this.value);
        });
        
        link.parentNode.replaceChild(select, link);
        console.log('[Lang] Selector created');
      }
    });
  }

  // 主初始化
  function init() {
    createSelector();
    
    // 如果是首页，执行过滤
    if (window.location.pathname === '/' || window.location.pathname.match(/^\/page\/\d+\//)) {
      filterHomePosts();
    }
    
    // 触发 i18n.js 的翻译（如果存在）
    if (window.i18n && window.i18n.apply) {
      console.log('[Lang] Triggering i18n translation');
      window.i18n.apply();
    }
  }

  // 多次尝试初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  setTimeout(init, 500);
  setTimeout(init, 1500);
})();
