import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getNestedTranslation,
  interpolate,
  LANGUAGE_OPTIONS,
  SupportedLanguage,
  translations,
} from "@/locales";

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const STORAGE_KEY = "language";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "de" || stored === "nl") {
        return stored;
      }
      if (typeof navigator !== "undefined" && navigator.language) {
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith("de")) return "de";
        if (browserLang.startsWith("nl")) return "nl";
      }
    } catch {
      // Fall back to default language if localStorage access fails
    }
    return "en";
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Storage access blocked or unavailable
    }
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const langDict = translations[language] || translations.en;
    let template = getNestedTranslation(langDict, key);
    if (!template && language !== "en") {
      template = getNestedTranslation(translations.en, key);
    }
    if (!template) {
      return key;
    }
    return interpolate(template, params);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export function LanguageSwitcher({ className }: { className?: string }) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className={`inline-flex items-center gap-1.5 ${className || ""}`}>
      <span className="sr-only">{t("nav.language")}</span>
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value as SupportedLanguage)}
        aria-label={t("nav.language")}
        className="h-9 rounded-md border border-input bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {LANGUAGE_OPTIONS.map((opt) => (
          <option key={opt.code} value={opt.code}>
            {opt.flag} {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
