# Project Guide

GitHubで公開している各プロジェクトについて、**一般ユーザーがダウンロード・使い方・エラー対処・設定用語を1か所で確認するための案内サイト**です。

開発者向けの技術仕様書ではなく、人が実際に使うときに迷わないことを目的にしています。

## 主な役割

- 最新版のSetup.exeを分かりやすくダウンロードする
- GitHub Releasesで複数Assetがある場合に、一般ユーザー向けの推奨ファイルを明示する
- エラーID・英語メッセージ・症状から対処方法を探す
- 英語の設定名や専門用語を日本語で説明する
- FAQ、更新情報、既知の問題をまとめる

## 初期対象

- `osu! Hub / osu Setup Launcher`

GitHub Releases APIから最新ReleaseとSetup.exeを取得するため、新Version公開ごとにガイド側のVersion番号を手作業で直す必要はありません。API取得に失敗した場合はGitHub Releasesへの導線を残します。

## Project Profile

```text
STATIC + PUBLIC-CONTENT
```

Electronアプリの案内情報を扱いますが、このサイト自体は静的Webサイトです。

## 構成

```text
index.html
styles.css
app.js
data/projects.json
404.html
.nojekyll
PROJECT_LEARNINGS.md
```

## 情報追加

人間向け情報の正本は `data/projects.json` です。

プロジェクトごとに以下を登録できます。

- 概要
- 対応環境
- GitHub Repository
- Release取得設定
- 初回利用手順
- 更新手順
- エラー対処
- 設定・用語
- FAQ
- 更新情報

## 公開

GitHub PagesのBranch公開を前提に、すべて相対Pathで構成しています。

GitHubで `Settings → Pages → Deploy from a branch → main / (root)` を選択すると公開できます。

## 文章ルール

- 技術的な原因より先に「ユーザーが何をすればよいか」を分かるようにする
- エラーは `エラーID → 状態 → 最初に試すこと → 主な原因 → 注意` の順
- 設定は `画面表記 → 日本語 → 意味 → 目安` の順
- ダウンロードは一般ユーザー向けの推奨ファイルを明示する
- 未確認事項を確認済みのように書かない
