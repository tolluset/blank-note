"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "ko" | "ja";

type Translations = {
  notes: string;
  list: string;
  trash: string;
  logout: string;
  login: string;
  user: string;
  language: string;
  english: string;
  korean: string;
  japanese: string;
  // Login related
  loginFailed: string;
  googleLoginFailed: string;
  loginToStart: string;
  loginWithGoogle: string;
  loggingIn: string;
  continueWithGoogle: string;
  // Notes related
  noNotes: string;
  startWithEmptyPages: string;
  startWith100Pages: string;
  previous: string;
  next: string;
  previousSpread: string;
  nextSpread: string;
  expandTo100Question: string;
  expandTo100: string;
  tearPage: string;
  notePage: string;
  writeHereDirectly: string;
  page: string;
  discard: string;
  freeFloatingPage: string;
  dragToMove: string;
  // Trash related
  restoreToList: string;
  deleteForever: string;
  pages: string;
  // Server messages
  alreadyHaveMaxNotes: string;
  newNotesCreated: string;
  // 404 page
  pageNotFound: string;
  pageNotFoundDescription: string;
  goHome: string;
  goBack: string;
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof Translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const translations: Record<Language, Translations> = {
  en: {
    notes: "Notes",
    list: "List",
    trash: "Trash",
    logout: "Logout",
    login: "Login",
    user: "User",
    language: "Language",
    english: "English",
    korean: "Korean",
    japanese: "Japanese",
    // Login related
    loginFailed: "Login failed.",
    googleLoginFailed: "Google login failed.",
    loginToStart: "Login to get started",
    loginWithGoogle: "Sign in with Google account.",
    loggingIn: "Logging in...",
    continueWithGoogle: "Continue with Google",
    // Notes related
    noNotes: "No notes available",
    startWithEmptyPages: "Start with 100 empty pages",
    startWith100Pages: "Start with 100 pages",
    previous: "← Previous",
    next: "Next →",
    previousSpread: "Previous spread",
    nextSpread: "Next spread",
    expandTo100Question: "Expand to 100 pages?",
    expandTo100: "Expand to 100",
    tearPage: "Tear Page",
    notePage: "Note Page",
    writeHereDirectly: "Write directly here...",
    page: "Page",
    discard: "Discard",
    freeFloatingPage: "Free floating page",
    dragToMove: "Drag to move",
    // Trash related
    restoreToList: "Restore to list",
    deleteForever: "Delete Forever",
    pages: "pages",
    // Server messages
    alreadyHaveMaxNotes: "Already have 100 notes.",
    newNotesCreated: "new notes created.",
    // 404 page
    pageNotFound: "Page Not Found",
    pageNotFoundDescription: "The page you are looking for does not exist.",
    goHome: "Go Home",
    goBack: "Go Back",
  },
  ko: {
    notes: "노트",
    list: "리스트",
    trash: "휴지통",
    logout: "로그아웃",
    login: "로그인",
    user: "사용자",
    language: "언어 설정",
    english: "English",
    korean: "한국어",
    japanese: "日本語",
    // Login related
    loginFailed: "로그인에 실패했습니다.",
    googleLoginFailed: "구글 로그인에 실패했습니다.",
    loginToStart: "로그인하여 시작하세요",
    loginWithGoogle: "Google 계정으로 로그인하세요.",
    loggingIn: "로그인 중...",
    continueWithGoogle: "Google로 계속하기",
    // Notes related
    noNotes: "노트가 없습니다",
    startWithEmptyPages: "100개의 빈 페이지로 시작하세요",
    startWith100Pages: "100페이지로 시작하기",
    previous: "← 이전",
    next: "다음 →",
    previousSpread: "이전 펼침면",
    nextSpread: "다음 펼침면",
    expandTo100Question: "페이지를 100개까지 늘릴까요?",
    expandTo100: "100개로 채우기",
    tearPage: "페이지 찢기",
    notePage: "노트 페이지",
    writeHereDirectly: "여기에 직접 입력하세요...",
    page: "페이지",
    discard: "버리기",
    freeFloatingPage: "자유 배치 페이지",
    dragToMove: "드래그로 이동",
    // Trash related
    restoreToList: "리스트로 복원",
    deleteForever: "완전삭제",
    pages: "장",
    // Server messages
    alreadyHaveMaxNotes: "이미 100개의 노트가 있습니다.",
    newNotesCreated: "개의 새 노트가 생성되었습니다.",
    // 404 page
    pageNotFound: "페이지를 찾을 수 없습니다",
    pageNotFoundDescription: "요청하신 페이지가 존재하지 않습니다.",
    goHome: "홈으로",
    goBack: "뒤로가기",
  },
  ja: {
    notes: "ノート",
    list: "リスト",
    trash: "ゴミ箱",
    logout: "ログアウト",
    login: "ログイン",
    user: "ユーザー",
    language: "言語設定",
    english: "English",
    korean: "한국어",
    japanese: "日本語",
    // Login related
    loginFailed: "ログインに失敗しました。",
    googleLoginFailed: "Googleログインに失敗しました。",
    loginToStart: "ログインして開始",
    loginWithGoogle: "Googleアカウントでログインしてください。",
    loggingIn: "ログイン中...",
    continueWithGoogle: "Googleで続行",
    // Notes related
    noNotes: "ノートがありません",
    startWithEmptyPages: "100個の空白ページで開始",
    startWith100Pages: "100ページで開始",
    previous: "← 前へ",
    next: "次へ →",
    previousSpread: "前の見開き",
    nextSpread: "次の見開き",
    expandTo100Question: "100ページまで拡張しますか？",
    expandTo100: "100個に拡張",
    tearPage: "ページを破る",
    notePage: "ノートページ",
    writeHereDirectly: "ここに直接入力してください...",
    page: "ページ",
    discard: "破棄",
    freeFloatingPage: "フリーフローティングページ",
    dragToMove: "ドラッグで移動",
    // Trash related
    restoreToList: "リストに復元",
    deleteForever: "完全削除",
    pages: "ページ",
    // Server messages
    alreadyHaveMaxNotes: "すでに100個のノートがあります。",
    newNotesCreated: "個の新しいノートが作成されました。",
    // 404 page
    pageNotFound: "ページが見つかりません",
    pageNotFoundDescription: "お探しのページは存在しません。",
    goHome: "ホームへ",
    goBack: "戻る",
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const getDefaultLanguage = (): Language => {
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith("ko")) return "ko";
      if (browserLang.startsWith("ja")) return "ja";
      return "en";
    };

    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && ["en", "ko", "ja"].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    } else {
      const detectedLanguage = getDefaultLanguage();
      setLanguageState(detectedLanguage);
      localStorage.setItem("language", detectedLanguage);
    }
    setIsLoaded(true);
  }, []);

  if (!isLoaded || language === null) {
    return null;
  }

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  const t = (key: keyof Translations): string => {
    return translations[language!][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language: language!, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
