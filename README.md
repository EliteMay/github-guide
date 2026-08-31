# GitHub Guide

自分がGitHubを使うときに、**どこを押せばいいか・英語表記が何を意味するか・エラー時にどこを見るか**をすぐ確認するための個人用ガイドサイトです。

特定アプリのマニュアルではなく、GitHubそのものの使い方を中心にまとめます。

## 主な内容

- Repository / Code / README / Commits
- Releases / Assets / Setup.exe配布
- GitHub Actions / Workflow / Job / Step / Artifact
- GitHub Pages
- Branch / Pull Request / Merge / Conflict
- Issues
- Settings / Actions permissions / Secrets
- GitHub画面の英語・用語辞典
- よくあるエラーと確認場所
- 自作サイトをGitHubで運用するときの補助メモ

## 自作サイト運用ページについて

GitHub一般機能とは別に、実際に自分のサイトを更新するときによく使う流れも少しだけまとめます。

例:

- サイト更新後に `Code → Actions → Pages → 公開URL` の順で確認する
- GitHub PagesのURLを確認する
- サイトからGitHub ReleasesのSetup.exeへつなぐ
- 公開サイトが更新されていないときの切り分け
- ChatGPT等からGitHubへ修正した後に何を確認するか

特定の1サイト専用情報はここへ大量に持ち込まず、個別仕様は各Repository側を正本とします。

## Project Profile

```text
STATIC + PUBLIC-CONTENT
```

## 構成

```text
index.html
styles.css
app.js
data/projects.json
404.html
.nojekyll
project-meta.json
PROJECT_LEARNINGS.md
.github/workflows/validate.yml
```

`data/projects.json` というファイル名は初版から引き継いでいますが、現在は個別ProjectデータではなくGitHubガイド本文のデータを保持しています。将来整理する場合は、参照箇所を同時に更新してからRenameします。

## 公開

GitHub Pagesで公開します。

```text
https://elitemay.github.io/project-guide/
```

相対Pathで構成し、Repository名を含むGitHub Pagesのサブパスでも動くようにします。

## Validation

`.github/workflows/validate.yml` でpush / pull request時に以下を確認します。

- `app.js` のJavaScript構文
- `data/projects.json` / `project-meta.json` のJSON形式
- 必須ファイルの存在
- Template用の仮GitHub URLが公開データへ残っていないこと

## 方針

- GitHubの専門用語をそのまま並べるだけでなく、自分が何に使うかを書く
- エラーは原因候補より先に「どこを見るか」を書く
- GitHub UIの表記が変わる可能性があるため、画面名と役割の両方を書く
- 特定Repository固有の仕様は、そのRepositoryのREADME / Specを正本とする
- 古いZIPや過去の説明より、現在のGitHub上の状態を優先する
