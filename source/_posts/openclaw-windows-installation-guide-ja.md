---
title: "Windows PC に OpenClaw をインストールする完全ガイド：ゼロから AI アシスタントを起動まで"
date: 2026-03-03 10:30:00
categories: [Japanese]
tags: [OpenClaw, AI, Windows, WSL2, チュートリアル, Japanese]
description: "Windows PC に OpenClaw AI アシスタントをインストールする方法を手取り足取り教えます。WSL2 設定、Node.js 環境準備、OpenClaw インストールと初回起動の完全な流れ。"
lang: ja
---

## OpenClaw とは？

OpenClaw は**セルフホスト型 AI アシスタントゲートウェイ**で、普段使っているチャットアプリ（WhatsApp、Telegram、Discord、iMessage など）と AI プログラミングアシスタントを接続できます。自分のマシンで実行し、データを完全にコントロール、ホスティングサービスに依存する必要はありません。

**核心特徴：**
- **セルフホスト**：あなたのハードウェアで実行、あなたのルール
- **マルチチャネルサポート**：1つのゲートウェイで複数のチャットプラットフォームに同時対応
- **AI エージェント向け**：ツール呼び出し、セッション管理、メモリーシステム、マルチエージェントルーティングをサポート
- **オープンソース**：MIT ライセンス、コミュニティ駆動

簡単に言えば、Node.js 22+、1つの API キー、5分の時間があれば、いつでも使える AI アシスタントを持てます。

<!-- more -->

## Windows ユーザーの推奨方案：WSL2

OpenClaw は Windows 上で**WSL2（Windows Subsystem for Linux）経由での実行を推奨**、特に Ubuntu ディストリビューションがおすすめです。

**なぜ WSL2？**
1. **ランタイムの一貫性**：WSL2 は完全な Linux 環境を提供、OpenClaw のランタイムが macOS/Linux 版と完全に一致することを保証
2. **ツール互換性が良い**：Node.js、pnpm、スキルスクリプトなどのツールは Linux 環境でより良く動作
3. **インストールが簡単**：`wsl --install` コマンド1つで WSL2 インストール完了

> **注**：ネイティブ Windows 版のコンパニオンアプリは計画中ですが、現在は WSL2 の使用を推奨します。

## 完全インストールフロー

### ステップ1：WSL2 と Ubuntu をインストール

1. **PowerShell を管理者モードで開く**

   - `Win + X` を押し、「Windows PowerShell（管理者）」または「Windows ターミナル（管理者）」を選択

2. **WSL2 をインストール**

   ```powershell
   wsl --install
   ```

   明確に Ubuntu 24.04 を指定したい場合：

   ```powershell
   # 利用可能なディストリビューションを確認
   wsl --list --online
   
   # Ubuntu 24.04 をインストール
   wsl --install -d Ubuntu-24.04
   ```

3. **PC を再起動**

   インストール完了後、Windows が再起動を促したら再起動してください。

4. **Ubuntu を初回起動**

   再起動後、「スタートメニュー」を開き、「Ubuntu」を検索して起動。初回起動時に以下を求められます：
   - Linux ユーザー名を設定（小文字推奨）
   - パスワードを設定（入力時は表示されません、これは正常です）

### ステップ2：systemd を有効化（必須）

OpenClaw の Gateway サービスは systemd サポートが必要です。

1. **Ubuntu ターミナルで以下のコマンドを実行**：

   ```bash
   sudo tee /etc/wsl.conf >/dev/null <<'EOF'
   [boot]
   systemd=true
   EOF
   ```

2. **WSL2 をシャットダウン**

   PowerShell（管理者）に戻り、実行：

   ```powershell
   wsl --shutdown
   ```

3. **Ubuntu を再度開く**

   スタートメニューから再び Ubuntu を起動。

4. **systemd が有効化されたか確認**

   ```bash
   systemctl --user status
   ```

   systemd の状態出力が見えれば（エラーでも問題なし、「command not found」でなければOK）、有効化成功です。

### ステップ3：Node.js 22+ をインストール

OpenClaw は Node.js 22 以降が必要です。

**推奨：nvm（Node Version Manager）を使用**

1. **nvm をインストール**

   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
   ```

2. **ターミナルを再起動またはシェル設定を再読込**

   ```bash
   source ~/.bashrc
   # または、zsh を使用している場合
   source ~/.zshrc
   ```

3. **Node.js 22 をインストール**

   ```bash
   nvm install 22
   nvm use 22
   nvm alias default 22
   ```

4. **インストール確認**

   ```bash
   node --version  # v22.x.x が表示されるはず
   npm --version
   ```

### ステップ4：OpenClaw をインストール

1. **OpenClaw CLI をグローバルインストール**

   ```bash
   npm install -g @openclaw/cli
   ```

2. **インストール確認**

   ```bash
   openclaw --version
   ```

   バージョン番号が表示されれば成功です。

### ステップ5：OpenClaw Gateway を初期化

1. **Gateway を初期化**

   ```bash
   openclaw gateway init
   ```

   プロンプトが表示されます：
   - **Agent ID を入力**（例：`main`、デフォルトでOK）
   - **Model provider を選択**（例：`anthropic`、`openai`、`zenmux` など）
   - **API キーを入力**（あなたの AI provider の API キー）

2. **設定ファイルを確認**

   初期化後、設定ファイルは `~/.openclaw/openclaw.json` に生成されます。

   ```bash
   cat ~/.openclaw/openclaw.json
   ```

### ステップ6：Gateway を起動

1. **Gateway を起動**

   ```bash
   openclaw gateway start
   ```

2. **起動状態を確認**

   ```bash
   openclaw gateway status
   ```

   `active (running)` と表示されれば成功です。

3. **ログを確認**

   ```bash
   openclaw gateway logs
   ```

   リアルタイムでログを確認できます（Ctrl+C で終了）。

### ステップ7：WebChat で試す

OpenClaw には組み込みの WebChat インターフェースがあります。

1. **ブラウザを開く**

   アドレスバーに以下を入力：

   ```
   http://localhost:17550
   ```

   （デフォルトポート。設定で変更している場合は対応するポートを使用）

2. **AI とチャット開始**

   WebChat インターフェースで、あなたの AI アシスタントと直接会話できます！

## トラブルシューティング

### Node.js バージョンが古い

**問題**：`node --version` が v22 未満を表示

**解決**：
```bash
nvm install 22
nvm use 22
nvm alias default 22
```

### systemd が有効化されていない

**問題**：Gateway 起動時に systemd エラー

**解決**：
1. `/etc/wsl.conf` を確認
2. WSL をシャットダウン（PowerShell で `wsl --shutdown`）
3. Ubuntu を再起動

### ポート競合

**問題**：`Port 17550 is already in use`

**解決方法1**：他のプログラムを停止
```bash
# どのプログラムがポートを使用しているか確認
sudo lsof -i :17550
# 対応するプロセスを停止
```

**解決方法2**：ポートを変更
`~/.openclaw/openclaw.json` を編集、`port` フィールドを変更。

### API キーエラー

**問題**：`Invalid API key` または `Authentication failed`

**解決**：
1. API キーが正しいか確認
2. API キーに十分なクレジットがあるか確認
3. 設定ファイルを再編集：
   ```bash
   openclaw gateway config.patch
   ```

## 次のステップ

Gateway が正常に動作したら、以下を試せます：

1. **チャネルを追加**：Telegram、Discord、WeChat などを接続
2. **Skills を探索**：OpenClaw のスキルシステムを使用して AI の能力を拡張
3. **カスタマイズ**：`~/.openclaw/openclaw.json` を編集して動作を調整
4. **コミュニティに参加**：Discord、GitHub で他のユーザーと交流

## 参考リンク

- **公式ドキュメント**：https://docs.openclaw.ai
- **GitHub リポジトリ**：https://github.com/openclaw/openclaw
- **Discord コミュニティ**：https://discord.com/invite/clawd
- **スキルハブ**：https://clawhub.com

---

**おめでとうございます！** あなたは今、自分の AI アシスタントを持っています。

何か問題があれば、公式ドキュメントを確認するか、コミュニティで質問してください。

楽しんでください！🎉

---

**関連読書**：
- [《AI時代の新しい会社モデル》](/2026/02/28/ai-company-model/)
- [《普通の人がAIを使いこなす30日間計画》](/2026/03/04/how-to-master-ai/)
