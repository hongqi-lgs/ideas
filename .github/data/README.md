# Newsletter 数据目录

## subscribers.json

订阅者列表，格式：
```json
[
  {
    "email": "user@example.com",
    "name": "User Name",
    "subscribed_at": "2026-03-04"
  }
]
```

## send-history.json

发送历史记录（自动生成），格式：
```json
[
  {
    "article_url": "https://...",
    "article_title": "文章标题",
    "sent_at": "2026-03-04T12:00:00.000Z",
    "recipient_count": 10
  }
]
```

## 手动添加订阅者

编辑 `subscribers.json`，添加新的订阅者对象。

## 发送 Newsletter

通过 GitHub Actions 手动触发工作流：
1. 进入 Actions → Send Newsletter
2. 点击 "Run workflow"
3. 可选参数：
   - `article_url`: 指定文章 URL（留空则发送最新文章）
   - `subject`: 自定义邮件主题（留空则自动生成）
   - `test_mode`: 测试模式（只发送给第一个订阅者）

## 配置 Resend API Key

在仓库 Settings → Secrets → Actions 中添加：
- Name: `RESEND_API_KEY`
- Value: 你的 Resend API 密钥

获取 API 密钥：https://resend.com/api-keys
