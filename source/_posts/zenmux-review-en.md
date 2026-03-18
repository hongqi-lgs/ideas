---
title: How I Merged a Dozen AI Accounts Into One
date: 2026-03-18 16:00:00
tags:
  - AI Tools
  - Developer Productivity
  - LLM
  - Claude Code
  - Cline
  - English
categories:
  - English
lang: en
description: Too many AI platforms, too many API keys, too many wallets to top up — until I found ZenMux. Includes full setup guides for Claude Code and Cline.
---

I used to keep a folder on my desktop with passwords for eight different AI platforms.

OpenAI, Anthropic, Google, DeepSeek — switching accounts depending on which model I needed, juggling API keys, watching multiple balances. When one platform hit rate limits, my project just sat there waiting.

That went on for a while. Then I started using [ZenMux](https://zenmux.ai).

---

## What It Does

ZenMux aggregates all the major AI models into one platform: GPT-4o, Claude 3.7, Gemini 2.0, DeepSeek V3, and more. One API key covers everything.

No more registering on multiple platforms. No more managing separate balances. Everything in one dashboard.

But the parts I actually found interesting go a bit deeper.

**Reliability.** Large model platforms occasionally rate-limit or go down — real risks in production. ZenMux backs critical models with multiple provider channels and handles automatic failover when one channel has issues. No manual intervention needed.

**Quality transparency.** They run regular HLE (Human Last Exam) benchmark tests across all model channels on the platform, and publish the results openly on GitHub. Rare to see this level of transparency from an aggregator.

**Model insurance.** The most unexpected feature: if output quality is poor or latency is too high, automated daily checks trigger compensation credited to your account the next day. The mechanism is sound — it's not a gimmick.

---

## Setting Up Claude Code

Claude Code supports custom API endpoints natively, and ZenMux is fully Anthropic-protocol compatible. The setup is two lines:

```bash
export ANTHROPIC_BASE_URL=https://api.zenmux.ai
export ANTHROPIC_API_KEY=your_zenmux_api_key
```

Then just start Claude Code:

```bash
claude
```

That's it. Claude Code routes through ZenMux, and all the model selection, routing, and failover happens on the backend. The experience is identical to connecting directly to Anthropic.

To make this permanent, add those two lines to your `~/.zshrc` or `~/.bashrc`:

```bash
# ~/.zshrc
export ANTHROPIC_BASE_URL=https://api.zenmux.ai
export ANTHROPIC_API_KEY=your_zenmux_api_key
```

---

## Setting Up Cline

Cline is one of the best AI coding assistants available for VS Code. Connecting it to ZenMux takes about a minute.

Open VS Code, go to the Cline settings panel, and:

1. Set **API Provider** to **OpenAI Compatible** (ZenMux supports both OpenAI and Anthropic protocols)
2. Set **Base URL** to `https://api.zenmux.ai/v1`
3. Enter your ZenMux API key
4. Set the model name, e.g. `claude-3-7-sonnet-20250219`

If you prefer the Anthropic protocol, select **Anthropic** as the provider, use `https://api.zenmux.ai` as the base URL, and proceed the same way.

After that, all of Cline's model calls go through ZenMux — automatic failover and quality monitoring included.

---

## Pricing

ZenMux is **pay-as-you-go** — no monthly subscription, just top up and use.

Payments via Alipay or Stripe. There's currently a **20% top-up bonus** (deposit $100, get $120 in credits), which makes it noticeably cheaper than charging the original platforms directly, especially for models like Claude that carry higher base pricing.

Rates are aligned with official provider pricing — no significant markup. The real savings come from the top-up bonus and not having to split budget across multiple platforms.

---

## One Honest Note

Worth mentioning: ZenMux is a **middle layer**, so requests make one extra network hop. In most development scenarios this is imperceptible. But if your use case is extremely latency-sensitive, benchmark it yourself before fully committing.

For everyday development, multi-model workflows, or running AI in small production projects — ZenMux is the most complete "aggregation + reliability + quality" package I've found so far.

There's free credit available after signup, no upfront payment needed.

My invite link: [https://zenmux.ai/invite/4H1O34](https://zenmux.ai/invite/4H1O34)

---

*ZenMux: [https://zenmux.ai](https://zenmux.ai)*
