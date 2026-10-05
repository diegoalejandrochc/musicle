import { useState, useCallback } from "react";
import { languages, defaultLanguage } from "../i18n/index.js";

export function useLanguage() {
  const [lang, setLang] = useState(defaultLanguage);

  const t = useCallback(
    (key, ...args) => {
      const value = languages[lang]?.[key] ?? languages[defaultLanguage]?.[key] ?? key;
      return typeof value === "function" ? value(...args) : value;
    },
    [lang]
  );

  const toggleLanguage = useCallback(() => {
    setLang((prev) => (prev === "en" ? "es" : "en"));
  }, []);

  return { lang, t, toggleLanguage };
}