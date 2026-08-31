# GitHub Guide

自分がGitHubを使うときに、**どこを押せばいいか・英語表記が何を意味するか・エラー時にどこを見るか**をすぐ確認するための個人用ガイドサイトです。

特定アプリのマニュアルではなく、GitHubそのものの使い方を中心にまとめます。

## 主な内容

- 「あれどこ？」場所辞典 — 普通は見つけにくいGitHub機能を場所から逆引き
- Repository / Code / README / Commits
- Releases / Assets / Setup.exe配布
- GitHub Actions / Workflow / Job / Step / Artifact / Cache
- GitHub Pages / Deployments / Environments
- Branch / Pull Request / Merge / Conflict / Rulesets
- Issues
- Settings / Actions permissions / Secrets / Variables / Webhooks
- Security / Dependabot / Secret scanning / Code scanning
- GitHub画面の英語・用語辞典
- よくあるエラーと確認場所
- 自作サイトをGitHubで運用するときの補助メモ

## 「あれどこ？」場所辞典

GitHubで機能名は分かっていても場所が分かりにくいものを集中的にまとめます。

例:

- Repository Secret / Variable
- Environment / Environment Secret
- Workflow permissions / Actions permissions
- Rulesets / Branch protection / Default branch
- Collaborators / Webhooks / Danger Zone
- Workflow Run / Step log / Artifact / Cache
- Branch一覧 / Branch削除 / Restore branch
- PRのChecks / Files changed / Mergeできない理由
- Release Asset / 最新Release
- Pages URL / Pages公開元 / Custom domain
- Deployments / View logs
- Dependabot / Secret scanning / Code scanning

`data/locations.json` を正本として、項目は「分類 / 場所 / 何がある / 覚えておく / 画像 / 公式Docs」の順で表示します。

## 画像方針

可能な項目は画像付きにします。

- GitHub公式の現在のスクリーンショットが安定して使える場所 → 公式画像を利用
- UI変更でリンク切れしやすい場所 → `assets/guide/` の案内図を利用
- 案内図はGitHub画面を完全再現せず、どのタブ・左メニューへ進むかを示す
- GitHub UIが更新された場合は、文章の役割説明を正本にして画像を更新する

## 自作サイト運用ページについて

GitHub一般機能とは別に、実際に自分のサイトを更新するときによく使う流れも少しだけまとめます。

例:

- サイト更新後に `Code → Actions → Pages → 公開URL` の順で確認する
- GitHub PagesのURLを確認する
- サイトからGitHub ReleasesのSetup.exeへつなぐ
- 公開サイトが更新されていないときの切り分け
- ChatGPT等からGitHubへ修正した後に何を確認するか
- 個別Projectに `PROJECT_LEARNINGS.md` がある場合、過去の高コスト失敗を確認する

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
data/locations.json
data/osu-hub.json
assets/guide/*.svg
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
- `data/projects.json` / `data/locations.json` / `data/osu-hub.json` / `project-meta.json` のJSON形式
- 場所辞典が最低30項目あり、各項目にtitle / path / summaryがあること
- 場所案内SVGの存在
- 公開に必要な主要ファイルの存在
- Template用の仮GitHub URLが公開データへ残っていないこと

## 方針

- GitHubの専門用語をそのまま並べるだけでなく、自分が何に使うかを書く
- 「普通は場所が分からない機能」を優先して追加する
- エラーは原因候補より先に「どこを見るか」を書く
- GitHub UIの表記が変わる可能性があるため、画面名と役割の両方を書く
- 可能な範囲で画像・案内図を付ける
- 特定Repository固有の仕様は、そのRepositoryのREADME / Spec / PROJECT_LEARNINGSを正本とする
- 古いZIPや過去の説明より、現在のGitHub上の状態を優先する
