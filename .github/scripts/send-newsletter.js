/**
 * Newsletter 发送脚本
 * 使用 Resend API 发送邮件通知
 */

const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');

// 配置
const RSS_URL = 'https://hongqi-lgs.github.io/ideas/atom.xml';
const BLOG_URL = 'https://hongqi-lgs.github.io/ideas';
const FROM_EMAIL = 'newsletter@hongqi-lgs.github.io'; // 如果有自定义域名，改成你的域名
const RESEND_API_KEY = process.env.RESEND_API_KEY;

// 发送记录文件
const SEND_HISTORY_PATH = path.join(__dirname, '../data/send-history.json');

// 邮件模板
function generateEmailHTML(article) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 30px 0; border-bottom: 2px solid #667eea; }
    .header h1 { margin: 0; color: #667eea; font-size: 28px; }
    .content { padding: 30px 0; }
    .article-title { font-size: 24px; color: #333; margin-bottom: 10px; }
    .article-meta { color: #999; font-size: 14px; margin-bottom: 20px; }
    .article-excerpt { font-size: 16px; line-height: 1.8; color: #555; margin-bottom: 30px; }
    .read-more { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 6px; font-weight: 600; }
    .read-more:hover { opacity: 0.9; }
    .footer { border-top: 1px solid #eee; padding-top: 20px; margin-top: 40px; text-align: center; color: #999; font-size: 14px; }
    .footer a { color: #667eea; text-decoration: none; }
  </style>
</head>
<body>
  <div class="header">
    <h1>红齐 Ideas</h1>
    <p style="color: #666; margin: 10px 0 0 0;">技术·产品·思考</p>
  </div>
  
  <div class="content">
    <h2 class="article-title">${article.title}</h2>
    <div class="article-meta">
      📅 ${new Date(article.pubDate).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
    </div>
    <div class="article-excerpt">
      ${article.excerpt}
    </div>
    <a href="${article.link}" class="read-more">阅读全文 →</a>
  </div>
  
  <div class="footer">
    <p>
      💬 回复这封邮件与我交流<br>
      🐦 Twitter: <a href="https://twitter.com/xiaosen_lu">@xiaosen_lu</a><br>
      ☕ <a href="https://ko-fi.com/xiaosen">请我喝杯咖啡</a>
    </p>
    <p style="margin-top: 20px;">
      <a href="{{unsubscribe_url}}">取消订阅</a> · <a href="${BLOG_URL}">访问博客</a>
    </p>
  </div>
</body>
</html>
  `.trim();
}

// 纯文本版本
function generateEmailText(article) {
  return `
${article.title}

${article.excerpt}

阅读全文：${article.link}

---

💬 回复这封邮件与我交流
🐦 Twitter: @xiaosen_lu
☕ 请我喝杯咖啡：https://ko-fi.com/xiaosen

取消订阅：{{unsubscribe_url}}
访问博客：${BLOG_URL}
  `.trim();
}

// 发送邮件
async function sendEmail(to, subject, html, text) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: `红齐 Ideas <${FROM_EMAIL}>`,
      to: [to],
      subject: subject,
      html: html,
      text: text
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to send email: ${error}`);
  }

  return await response.json();
}

// 读取发送记录
function loadSendHistory() {
  if (!fs.existsSync(SEND_HISTORY_PATH)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(SEND_HISTORY_PATH, 'utf8'));
}

// 保存发送记录
function saveSendHistory(history) {
  fs.writeFileSync(SEND_HISTORY_PATH, JSON.stringify(history, null, 2));
}

// 检查文章是否已发送
function isArticleSent(articleUrl) {
  const history = loadSendHistory();
  return history.some(record => record.article_url === articleUrl);
}

// 记录发送
function recordSend(article, recipientCount) {
  const history = loadSendHistory();
  history.push({
    article_url: article.link,
    article_title: article.title,
    sent_at: new Date().toISOString(),
    recipient_count: recipientCount
  });
  saveSendHistory(history);
}

// 主函数
async function main() {
  console.log('🚀 Starting newsletter send...');

  // 检查 API Key
  if (!RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY not found in environment');
    process.exit(1);
  }

  // 读取订阅者列表
  const subscribersPath = path.join(__dirname, '../data/subscribers.json');
  if (!fs.existsSync(subscribersPath)) {
    console.error('❌ Subscribers file not found:', subscribersPath);
    process.exit(1);
  }

  const subscribers = JSON.parse(fs.readFileSync(subscribersPath, 'utf8'));
  console.log(`📧 Found ${subscribers.length} subscribers`);

  // 测试模式：只发送给第一个订阅者（应该是你自己）
  const testMode = process.env.TEST_MODE === 'true';
  const recipients = testMode ? subscribers.slice(0, 1) : subscribers;
  
  if (testMode) {
    console.log('🧪 TEST MODE: Only sending to first subscriber');
  }

  // 获取文章信息
  let article;
  const manualUrl = process.env.ARTICLE_URL;

  if (manualUrl) {
    // 手动指定文章 URL
    console.log('📝 Using manually specified article URL');
    article = {
      title: process.env.SUBJECT || '新文章更新',
      link: manualUrl,
      excerpt: '点击阅读全文查看完整内容。',
      pubDate: new Date().toISOString()
    };
  } else {
    // 从 RSS 获取最新文章
    console.log('📡 Fetching latest article from RSS...');
    const parser = new Parser();
    const feed = await parser.parseURL(RSS_URL);
    
    if (!feed.items || feed.items.length === 0) {
      console.error('❌ No articles found in RSS feed');
      process.exit(1);
    }

    article = feed.items[0];
    console.log(`📰 Latest article: ${article.title}`);

    // 检查是否已发送
    if (isArticleSent(article.link)) {
      console.log('⚠️  This article has already been sent!');
      console.log('   To resend, specify the article URL manually.');
      process.exit(0);
    }

    // 提取摘要（去除 HTML 标签）
    if (article.contentSnippet) {
      article.excerpt = article.contentSnippet.substring(0, 300) + '...';
    } else if (article.content) {
      article.excerpt = article.content.replace(/<[^>]*>/g, '').substring(0, 300) + '...';
    } else {
      article.excerpt = '点击阅读全文查看完整内容。';
    }
  }

  // 生成邮件内容
  const subject = process.env.SUBJECT || `新文章：${article.title}`;
  const html = generateEmailHTML(article);
  const text = generateEmailText(article);

  // 发送邮件
  console.log(`\n📤 Sending emails to ${recipients.length} recipients...`);
  let successCount = 0;
  let failCount = 0;

  for (const subscriber of recipients) {
    try {
      await sendEmail(subscriber.email, subject, html, text);
      console.log(`✅ Sent to: ${subscriber.email}`);
      successCount++;
      
      // 避免触发速率限制，每封邮件间隔 1 秒
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Failed to send to ${subscriber.email}:`, error.message);
      failCount++;
    }
  }

  console.log(`\n✨ Newsletter send complete!`);
  console.log(`   Success: ${successCount}`);
  console.log(`   Failed: ${failCount}`);

  // 记录发送（只在非测试模式下记录）
  if (!testMode && successCount > 0) {
    recordSend(article, successCount);
    console.log(`\n📝 Send recorded in history`);
  }
}

// 执行
main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
