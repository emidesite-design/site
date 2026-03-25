import styles from "@/presentation/sections/HeroSection.module.css";
import { useLanguage } from "@/shared/i18n/LanguageContext";
import heroContent from "@/shared/content/hero.json";

export function HeroSection() {
  const { locale } = useLanguage();
  const copy = heroContent[locale];

  return (
    <section className={styles.section} id="hero">
      <div className={styles.copy}>
        <span className={styles.kicker}>{copy.kicker}</span>
        <h1 className={styles.title}>
          <img
            alt={copy.title}
            className={styles.titleLogo}
            decoding="async"
            fetchPriority="high"
            height={1080}
            src="/assets/logo.svg"
            width={1080}
          />
        </h1>
        <p className={styles.description}>{copy.description}</p>

      </div>

      <div className={styles.visualShell}>
        <div className={styles.visualGlow} />
        <div className={styles.heroImageFrame}>
          <img
            alt={copy.imageAlt}
            className={styles.heroImage}
            decoding="async"
            fetchPriority="high"
            height={1400}
            src={copy.imageSrc}
            width={1000}
          />
        </div>
        <div className={styles.mobileTitle}>
          <img
            alt={copy.title}
            className={styles.mobileTitleLogo}
            decoding="async"
            fetchPriority="high"
            height={1080}
            src="/assets/logo.svg"
            width={1080}
          />
        </div>
      </div>
    </section>
  );
}
