import styles from "@/presentation/sections/HeroLinksSection.module.css";
import { SectionLink } from "@/presentation/components/SectionLink";
import { useLanguage } from "@/shared/i18n/LanguageContext";
import heroContent from "@/shared/content/hero.json";

export function HeroLinksSection() {
  const { locale } = useLanguage();
  const copy = heroContent[locale];

  return (
    <section aria-label="Hero links" className={styles.section}>
      <div className={styles.grid}>
        {copy.links.map((link) => (
          <SectionLink className={styles.actionButton} href={link.href} key={link.label}>
            {link.label}
          </SectionLink>
        ))}
      </div>
    </section>
  );
}
