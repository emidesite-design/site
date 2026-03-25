import styles from "@/presentation/sections/SoundCloudSection.module.css";
import { SectionHeading } from "@/presentation/components/SectionHeading";
import { useLanguage } from "@/shared/i18n/LanguageContext";
import soundcloudContent from "@/shared/content/soundcloud.json";

export function SoundCloudSection() {
  const { locale } = useLanguage();
  const copy = soundcloudContent[locale];

  return (
    <section className={styles.section} id="soundcloud">
      <SectionHeading
        iconAlt={copy.title}
        iconSrc="/assets/logo-icone.ico"
        title={copy.title}
      />

      <div className={styles.meta}>
        <span>{copy.platformLabel}</span>
      </div>

      <div className={styles.grid}>
        {copy.tracks.map((track) => (
          <article className={styles.card} key={track.title}>
            <h3 className={styles.cardTitle}>{track.title}</h3>
            <iframe
              allow="autoplay"
              className={styles.embed}
              loading="lazy"
              src={track.embedUrl}
              title={track.iframeTitle}
            />
          </article>
        ))}
      </div>

      <div className={styles.actionWrap}>
        <a
          className={styles.link}
          href={copy.profileUrl}
          rel="noreferrer"
          target="_blank"
        >
          {copy.linkLabel}
        </a>
      </div>
    </section>
  );
}
