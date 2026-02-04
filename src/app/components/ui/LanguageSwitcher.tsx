import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => i18n.changeLanguage("en")}
        className="px-2 py-1 border rounded"
      >
        EN
      </button>
      <button
        onClick={() => i18n.changeLanguage("hindi")}
        className="px-2 py-1 border rounded"
      >
        हिंदी
      </button>
    </div>
  );
}
