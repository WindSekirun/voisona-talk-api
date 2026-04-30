# VoiSona Talk API TypeScript Library

[English](README.md) | [日本語](README_jp.md)

VoiSona Talk API (v0.9.0) のための TypeScript ベースのライブラリです。型安全で直感的な方法で音声合成とテキスト解析機能を統合できます。

## 'VoiSona Talk' とは？

[VoiSona Talk](https://voisona.com/talk/) は、ディープラーニング技術を使用して高品質で自然な人間の声を生成する AI 音声合成ソフトウェアです。感情や発話パラメータを細かく制御し、表現力豊かなナレーションや対話を作成できます。

このライブラリを使用すると、VoiSona Talk エディタのローカル API と通信し、TypeScript/JavaScript アプリケーションから音声生成を自動化できます。

### 利用に関する重要事項

- **ライセンス**: このライブラリを使用するには、VoiSona Talk エディタおよび使用する各ボイスライブラリの有効なライセンスが必要です。
- **キャラクターガイドライン**: 各ボイスライブラリのキャラクターには独自の利用規約があります（例：[小春六花 利用規約](https://voisona.com/static/pdf/ja/koharu-rikka_guidelines.pdf)）。利用者は各キャラクターのガイドラインを確認し、遵守する責任があります。

## 主な機能

- **型安全性**: すべての OpenAPI スキーマに対する完全な TypeScript サポート。
- **簡単な合成**: `synthesizeAndWait` がキュー登録とポーリングを自動的に処理。
- **デフォルト WAV 出力**: 合成結果はデフォルトで `output/` ディレクトリに `.wav` ファイルとして保存されます。
- **感情制御**: 名前を使用して直感的にスタイル/感情の重みを管理できる `getStyleWeights` ヘルパー。
- **一括処理**: 同時実行制御が可能な複数リクエスト処理のための `bulkSynthesize`。
- **環境設定**: `.env` ファイルによる簡単な設定。

## インストール

```bash
pnpm add voisona-talk-api
```

## クイックスタート

ライブラリを使用する前に、VoiSona Talk エディタが正しく設定されていることを確認してください。ステップバイステップの案内は [接続ガイド (英語)](docs/CONNECT_WITH_VOISONA.md) を参照してください。

```typescript
import { VoisonaClient } from 'voisona-talk-api';

const client = new VoisonaClient({
  email: process.env.VOISONA_EMAIL,
  password: process.env.VOISONA_PASSWORD,
});

// 簡単な合成（デフォルトで output/ ディレクトリに .wav ファイルとして保存）
const result = await client.synthesizeAndWait({
  text: 'こんにちは。VoiSona Talkのテストです。',
  language: 'ja_JP',
});

console.log(`オーディオ保存先: ${result.output_file_path}`);
```

## 高度な使い方

### 感情・スタイル制御

インデックス配列の代わりに名前を使用してボイススタイル（感情）を管理します。

```typescript
const voiceInfo = await client.getVoiceInformation('voice_name', '1.0.0');

const styleWeights = client.getStyleWeights(voiceInfo, {
  Happy: 0.8,
  Angry: 0.2,
});

await client.synthesizeAndWait({
  text: 'わーい！',
  language: 'ja_JP',
  global_parameters: { style_weights: styleWeights },
});
```

### グローバルパラメータ

さまざまなパラメータで出力を微調整します。

```typescript
await client.synthesizeAndWait({
  text: 'もっと速く！',
  language: 'ja_JP',
  global_parameters: {
    speed: 1.5, // 0.2 〜 5.0
    pitch: 100, // セント単位 (-600 〜 600)
    intonation: 1.2, // 抑揚の範囲
  },
});
```

### 一括合成 (Bulk Synthesis)

複数のメッセージを効率的に処理します。

```typescript
const results = await client.bulkSynthesize(
  [
    { text: 'Message one', language: 'ja_JP' },
    { text: 'Message two', language: 'ja_JP' },
  ],
  { concurrency: 2 },
);
```

### ユーザー定義の読み（カスタム発音）

単語の読みが正しくない場合、正しいカタカナ読みを指定できます。

```typescript
await client.synthesizeWithPronunciation(
  {
    language: 'ja_JP',
    text: '焦る必要はありません。',
  },
  {
    焦る: 'アセル', // "Kogeru" を "Aseru" に修正
  },
);
```

## 開発

### 前提条件

- Node.js v18+ (Node.js 20.6+ 以上のネイティブ `.env` サポートを推奨)
- pnpm
- **VoiSona Talk エディタ** (ローカルで実行中)

### 環境設定

VoiSona の認証情報を環境変数または `.env` ファイルに設定します：

```env
VOISONA_EMAIL=your_email@example.com
VOISONA_PASSWORD=your_password
```

### スクリプト

- `pnpm run build`: CJS および ESM ビルド。
- `pnpm test`: ユニットテストの実行。
- `pnpm run test:coverage`: カバレッジレポートの生成。

### 例題の実行

Node.js 20.6+ で `.env` ファイルを使用して例題を実行する場合：

```bash
pnpm tsx --env-file=.env examples/simple-synthesis.ts
```

20.6 未満の Node.js バージョンの場合、環境変数を手動で設定するか、`dotenv-cli` などを利用してください。

## ライセンス

MIT
