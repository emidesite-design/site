import styles from "@/presentation/sections/LinksSection.module.css";
import { useLanguage } from "@/shared/i18n/LanguageContext";
import linksContent from "@/shared/content/links.json";

export function LinksSection() {
  const { locale } = useLanguage();
  const copy = linksContent[locale];

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {copy.items.map((item) => (
          <article className={styles.card} key={item.label}>
            <span className={styles.label}>{item.label}</span>
            <strong className={styles.value}>{item.value}</strong>
            <p className={styles.description}>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
