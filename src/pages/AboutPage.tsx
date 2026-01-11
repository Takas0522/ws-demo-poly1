import React from 'react';
import { useI18n } from '../i18n/I18nContext';

/**
 * About page component
 */
const AboutPage: React.FC = () => {
  const { language } = useI18n();

  return (
    <div style={{ padding: '20px' }}>
      <h1>{language === 'ja' ? 'このアプリについて' : 'About This Application'}</h1>
      <div style={{ marginTop: '20px', lineHeight: '1.8' }}>
        {language === 'ja' ? (
          <>
            <p>
              このアプリケーションは、TypeScriptとモダンツールを使用したReactベースのフロントエンドアプリケーションの基盤です。
            </p>
            <h2 style={{ marginTop: '30px' }}>主な機能</h2>
            <ul style={{ lineHeight: '2' }}>
              <li>React 18+とTypeScriptによる型安全な開発</li>
              <li>Viteによる高速なビルドと開発体験</li>
              <li>React Routerによるクライアントサイドルーティング</li>
              <li>Zustandによるシンプルで強力な状態管理</li>
              <li>Axiosによるインターセプター付きAPIクライアント</li>
              <li>認証コンテキストとトークン管理</li>
              <li>ボタンレベルの権限制御</li>
              <li>日本語・英語の国際化対応</li>
            </ul>
            <h2 style={{ marginTop: '30px' }}>技術スタック</h2>
            <ul style={{ lineHeight: '2' }}>
              <li><strong>フロントエンド:</strong> React 18+, TypeScript</li>
              <li><strong>ビルドツール:</strong> Vite</li>
              <li><strong>ルーティング:</strong> React Router</li>
              <li><strong>状態管理:</strong> Zustand</li>
              <li><strong>HTTPクライアント:</strong> Axios</li>
            </ul>
          </>
        ) : (
          <>
            <p>
              This application is a foundation for a React-based frontend application using TypeScript and modern tools.
            </p>
            <h2 style={{ marginTop: '30px' }}>Key Features</h2>
            <ul style={{ lineHeight: '2' }}>
              <li>Type-safe development with React 18+ and TypeScript</li>
              <li>Fast build and development experience with Vite</li>
              <li>Client-side routing with React Router</li>
              <li>Simple and powerful state management with Zustand</li>
              <li>API client with interceptors using Axios</li>
              <li>Authentication context and token management</li>
              <li>Button-level authorization control</li>
              <li>Internationalization support for Japanese and English</li>
            </ul>
            <h2 style={{ marginTop: '30px' }}>Tech Stack</h2>
            <ul style={{ lineHeight: '2' }}>
              <li><strong>Frontend:</strong> React 18+, TypeScript</li>
              <li><strong>Build Tool:</strong> Vite</li>
              <li><strong>Routing:</strong> React Router</li>
              <li><strong>State Management:</strong> Zustand</li>
              <li><strong>HTTP Client:</strong> Axios</li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default AboutPage;
