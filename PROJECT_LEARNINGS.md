# PROJECT_LEARNINGS

## 2026-08-31

- このサイトの主目的は、特定アプリのユーザーサポートではなく、所有者自身がGitHubを使うための個人用リファレンス。
- GitHub機能は「用語順」だけでなく「何をしたいか」から逆引きできる入口を優先する。
- Releases / Actions / Pages / Branch / PR / Issues / Settings / 英語表記 / エラー対処を主要カテゴリにする。
- 自作サイトの運用方法も有用だが、GitHub一般ガイドを主役にして補助ページとして分離する。
- 特定Repository固有のVersion、設定、エラー情報をこのガイドへ大量複製せず、各RepositoryのREADME / Spec / `PROJECT_LEARNINGS.md` を正本とする。
- エラー説明は技術原因だけでなく「まずどの画面・ログを見るか」を先に示す。
- 英語表記は原文を残し、日本語イメージと実際の用途を対応させる。
- GitHub UIは将来変わり得るため、クリック手順だけでなく機能の役割も併記する。
- GitHubはSettings内に機能が分散しており、Secret / Variable / Environment / Workflow permissions / Rulesets / Danger Zone等は初心者には場所が推測しづらい。専用の「あれどこ？」逆引き辞典を持つ価値が高い。
- 場所辞典は「分類 → 場所 → 何がある → 覚えておく → 画像 → 公式Docs」の順にすると、説明を読まずに目的の画面へ到達しやすい。
- 画像は可能な範囲で付ける。ただしGitHub公式UIの完全再現画像を大量に自前保存すると更新追従コストが高いため、長期利用する案内はタブ・サイドバーの関係だけを示す簡潔なSVG案内図を使う。
- GitHub公式スクリーンショットを使える場所では出典リンクを残し、自作案内図とは区別する。
- Actionsの失敗調査は `Actions → Workflow → Run → Job → Step`、過去のProject固有失敗は各Repoの `PROJECT_LEARNINGS.md → Failure` と役割を分ける。
