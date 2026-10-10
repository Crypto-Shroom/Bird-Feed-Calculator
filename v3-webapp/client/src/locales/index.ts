import { en, type TranslationKeys } from "./en";
import { de } from "./de";
import { nl } from "./nl";

export type SupportedLanguage = "en" | "de" | "nl";

export const LANGUAGE_OPTIONS: { code: SupportedLanguage; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱" },
];

export const translations: Record<SupportedLanguage, TranslationKeys> = {
  en,
  de,
  nl,
};

export function getNestedTranslation(obj: Record<string, any>, path: string): string | undefined {
  const parts = path.split(".");
  let current: any = obj;
  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  return typeof current === "string" ? current : undefined;
}

export function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    return params[key] !== undefined ? String(params[key]) : `{${key}}`;
  });
}
