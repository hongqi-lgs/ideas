'use strict';

/**
 * Cache Busting 脚本
 * 在 hexo generate 时自动给自定义 CSS/JS 引用加上构建时间戳
 * 确保每次部署后浏览器加载最新资源
 */

const timestamp = Date.now();

hexo.extend.filter.register('after_render:html', function (str) {
  // 给 custom.css 加时间戳
  str = str.replace(
    /href="([^"]*\/css\/custom\.css)(\?[^"]*)?"/g,
    `href="$1?v=${timestamp}"`
  );

  // 给 i18n.js 加时间戳
  str = str.replace(
    /src="([^"]*\/js\/i18n\.js)(\?[^"]*)?"/g,
    `src="$1?v=${timestamp}"`
  );

  // 在 <head> 中加入 cache-control meta 标签（帮助浏览器不缓存 HTML）
  if (str.includes('<head>') && !str.includes('http-equiv="Cache-Control"')) {
    str = str.replace(
      '<head>',
      '<head>\n<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">\n<meta http-equiv="Pragma" content="no-cache">\n<meta http-equiv="Expires" content="0">'
    );
  }

  return str;
});


