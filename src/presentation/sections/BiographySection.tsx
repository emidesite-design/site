import styles from "@/presentation/sections/BiographySection.module.css";
import { LanguageSwitcher } from "@/presentation/components/LanguageSwitcher";
import { SectionHeading } from "@/presentation/components/SectionHeading";
import { useLanguage } from "@/shared/i18n/LanguageContext";
import biographyContent from "@/shared/content/biography.json";

export function BiographySection() {
  const { locale } = useLanguage();
  const copy = biographyContent[locale];
  const [lead, ...paragraphs] = copy.body.split("\n\n").filter(Boolean);

  return (
    <section className={styles.section} id="biography">
      <SectionHeading
        action={<LanguageSwitcher />}
        title={copy.title}
      />

      <article className={styles.card}>
        <div aria-hidden="true" className={styles.texture} />
        <div className={styles.content}>
          <p className={styles.lead}>{lead}</p>
          {paragraphs.map((paragraph) => (
            <p className={styles.paragraph} key={paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </section>
  );
}
