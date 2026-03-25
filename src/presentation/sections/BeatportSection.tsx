import styles from "@/presentation/sections/BeatportSection.module.css";
import { SectionHeading } from "@/presentation/components/SectionHeading";
import { useLanguage } from "@/shared/i18n/LanguageContext";
import beatportContent from "@/shared/content/beatport.json";

export function BeatportSection() {
  const { locale } = useLanguage();
  const copy = beatportContent[locale];

  return (
    <section className={styles.section} id="beatport">
      <SectionHeading
        iconAlt={copy.title}
        iconSrc="/assets/logo-icone.ico"
        title={copy.title}
      />

      <div className={styles.card}>
        <div className={styles.previewPanel}>
          <div className={styles.previewChrome}>
            <span />
            <span />
            <span />
          </div>

          <div className={styles.previewBody}>
            <span className={styles.platformLabel}>{copy.platformLabel}</span>
            <img
              alt={copy.logoAlt}
              className={styles.logo}
              decoding="async"
              height={1080}
              src="/assets/logo.svg"
              width={1080}
            />
            <p className={styles.previewDescription}>{copy.previewDescription}</p>

            <div className={styles.pillGrid}>
              {copy.pills.map((pill) => (
                <span className={styles.pill} key={pill}>
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.copy}>
          <span className={styles.kicker}>{copy.kicker}</span>
          <h3 className={styles.headline}>{copy.headline}</h3>
          <p className={styles.description}>{copy.description}</p>

          <div className={styles.actions}>
            <a
              className={styles.ctaPrimary}
              href={copy.profileUrl}
              rel="noreferrer"
              target="_blank"
            >
              {copy.linkLabel}
            </a>

            <a
              className={styles.ctaSecondary}
              href={copy.profileUrl}
              rel="noreferrer"
              target="_blank"
            >
              {copy.secondaryLinkLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
