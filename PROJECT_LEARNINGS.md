# PROJECT_LEARNINGS

## 2026-08-31

- 一般ユーザー向け情報と開発者向けREADME / 技術仕様を分離する。
- GitHub ReleasesでAssetが複数ある場合、一般ユーザー向けのSetup.exeを1つ明示する。
- Release VersionやSetup.exe名は可能な範囲でGitHub Releases APIから自動取得し、ガイド側の手作業更新を減らす。
- Release API取得失敗時もGitHub ReleasesへのFallback導線を残す。
- エラー説明は技術原因だけでなく「まず何をするか」を先に見つけられる構造にする。
- 英語設定や専門用語は原文を消さず、日本語の意味・影響・目安と対応させる。
- 未署名InstallerはSmartScreen警告の可能性と、配布元確認の必要性を明示する。
