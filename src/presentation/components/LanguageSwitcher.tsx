import styles from "@/presentation/components/LanguageSwitcher.module.css";
import { useLanguage } from "@/shared/i18n/LanguageContext";
import appContent from "@/shared/content/app.json";

type LanguageSwitcherTone = "solid" | "ghost";

interface LanguageSwitcherProps {
  tone?: LanguageSwitcherTone;
}

export function LanguageSwitcher({
  tone = "solid",
}: LanguageSwitcherProps) {
  const { locale, setLocale } = useLanguage();
  const copy = appContent[locale];

  return (
    <div
      aria-label={copy.localeSwitcherLabel}
      className={`${styles.switcher} ${tone === "ghost" ? styles.ghost : styles.solid}`}
    >
      <button
        className={locale === "pt" ? `${styles.button} ${styles.active}` : styles.button}
        onClick={() => setLocale("pt")}
        type="button"
      >
        {copy.locales.pt}
      </button>
      <button
        className={locale === "en" ? `${styles.button} ${styles.active}` : styles.button}
        onClick={() => setLocale("en")}
        type="button"
      >
        {copy.locales.en}
      </button>
    </div>
  );
}
