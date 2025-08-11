"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "ko" | "ja";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const translations = {
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
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const getDefaultLanguage = (): Language => {
    if (typeof window !== "undefined") {
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith("ko")) return "ko";
      if (browserLang.startsWith("ja")) return "ja";
    }
    return "en";
  };

  const [language, setLanguageState] = useState<Language>(getDefaultLanguage());

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && ["en", "ko", "ja"].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  const t = (key: string): string => {
    return (
      translations[language][key as keyof (typeof translations)[Language]] ||
      key
    );
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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

