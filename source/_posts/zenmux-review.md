---
title: 我是怎么把十几个 AI 账号合并成一个的
date: 2026-03-18 16:00:00
tags:
  - AI工具
  - 开发效率
  - 大模型
  - Claude Code
  - Cline
categories:
  - 技术
description: 注册了一堆 AI 平台、充了一堆钱、管了一堆 Key——直到我找到了 ZenMux。附 Claude Code / Cline 完整配置方法。
---

去年我的桌面上有一个文件夹，里面存着七八个 AI 平台的账号密码。

OpenAI 一个、Anthropic 一个、Google 一个、DeepSeek 一个……每次要用不同的模型，就得切换账号、切换 API Key、切换充值余额。有时候某个平台突然限流，项目就卡在那里等着。

这种状态持续了很久，直到我开始用 [ZenMux](https://zenmux.ai)。

---

## 它做了什么

ZenMux 把所有主流 AI 模型聚合到一个平台：GPT-4o、Claude 3.7、Gemini 2.0、DeepSeek V3……一个 API Key 全部搞定。

不需要在多个平台注册，不需要管多个账户余额，账单统一在一个后台看清楚。

但我真正觉得有意思的，是它解决了几个更深层的问题。

**稳定性。** 大模型平台偶尔会限流或宕机，在生产环境里这是真实风险。ZenMux 给每个关键模型配了多个提供商渠道，某个渠道出问题时自动切换，不需要你手动处理。

**质量透明。** 他们定期跑 HLE（Human Last Exam）测试，覆盖平台上所有模型的所有渠道，结果开源在 GitHub，谁好谁差都能看到。这在同类平台里少见。

**模型保险。** 这是让我最意外的功能——如果模型输出质量差或延迟过高，平台每日自动检测，触发后次日赔付到账。逻辑是通的，不是噱头。

---

## 配置到 Claude Code

Claude Code 原生支持自定义 API 地址，ZenMux 完整兼容 Anthropic 协议，接入方式非常干净。

在终端设置环境变量：

```bash
export ANTHROPIC_BASE_URL=https://api.zenmux.ai
export ANTHROPIC_API_KEY=你的ZenMux_API_Key
```

然后直接启动 Claude Code：

```bash
claude
```

就这两步，Claude Code 会自动走 ZenMux 的渠道，模型选择、路由、故障切换全部在后端处理，前端体验和直连 Anthropic 没有区别。

如果不想每次都 export，可以写进 `~/.zshrc` 或 `~/.bashrc`：

```bash
# ~/.zshrc
export ANTHROPIC_BASE_URL=https://api.zenmux.ai
export ANTHROPIC_API_KEY=你的ZenMux_API_Key
```

---

## 配置到 Cline

Cline 是 VS Code 里最好用的 AI 编程助手之一，配置 ZenMux 也很简单。

打开 VS Code，进入 Cline 的设置面板：

1. API Provider 选择 **OpenAI Compatible**（ZenMux 同时兼容 OpenAI 协议）
2. Base URL 填：`https://api.zenmux.ai/v1`
3. API Key 填你的 ZenMux Key
4. Model 填你想用的模型，比如 `claude-3-7-sonnet-20250219`

或者如果你更习惯 Anthropic 协议，Provider 选 **Anthropic**，Base URL 同样填 `https://api.zenmux.ai`，Key 填 ZenMux Key，模型照常选。

配置完成后，Cline 的所有模型调用都会走 ZenMux，同时享受自动故障切换和质量监控。

---

## 充值和费用

目前 ZenMux 是**按用量付费**，没有月费订阅，充值即可用。

支持支付宝和 Stripe 信用卡，对国内用户比较友好。

现在有一个 **充值 20% 额外赠送**的活动，也就是充 100 到账 120，比直接去原平台充要划算一些，尤其是 Claude 这种定价较贵的模型。

费率上 ZenMux 走的是转发模式，基本和官方价格持平，不会有明显溢价。具体可以在平台的 Pricing 页面查看各模型的实时报价。

---

## 一点实话

好的地方说完了，也说一个需要自己判断的点：**ZenMux 是中间层**，请求会多经过一跳。大多数场景下这个延迟差异感知不到，但如果你的业务对延迟极度敏感，建议自己测一下再决定是否迁移。

整体来说，对于日常开发、多模型混用、或者把 AI 用在小型生产项目里的开发者，ZenMux 是目前我见过把"聚合+稳定性+质量"三件事同时做得还不错的平台。

注册后有免费额度可以直接体验，不需要先充值。

我的邀请链接：[https://zenmux.ai/invite/4H1O34](https://zenmux.ai/invite/4H1O34)

---

*ZenMux 官网：[https://zenmux.ai](https://zenmux.ai)*
