import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locals/en/translation.json";
import hindi from "./locals/hindi/translation.json";

// ✅ Safe function (prevents TS + runtime errors)
const getSavedLanguage = () => {
  if (typeof window === "undefined") return "en";
  return localStorage.getItem("lang") || "en";
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hindi: { translation: hindi }
    },
    lng: getSavedLanguage(),
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

// ✅ Listen AFTER init, browser-only
if (typeof window !== "undefined") {
  i18n.on("languageChanged", (lang) => {
    localStorage.setItem("lang", lang);
  });
}

export default i18n;
