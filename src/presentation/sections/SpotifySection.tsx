import styles from "@/presentation/sections/SpotifySection.module.css";
import { SectionHeading } from "@/presentation/components/SectionHeading";
import { useLanguage } from "@/shared/i18n/LanguageContext";
import spotifyContent from "@/shared/content/spotify.json";

export function SpotifySection() {
  const { locale } = useLanguage();
  const copy = spotifyContent[locale];

  return (
    <section className={styles.section} id="spotify">
      <SectionHeading
        iconAlt={copy.title}
        iconSrc="/assets/logo-icone.ico"
        title={copy.title}
      />

      <div className={styles.container}>
        {copy.tracks.map((track, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.meta}>
              <span>{track.title}</span>
              <a
                className={styles.link}
                href={track.profileUrl}
                rel="noreferrer"
                target="_blank"
              >
                {copy.linkLabel}
              </a>
            </div>

            <div className={styles.embedFrame}>
              <iframe
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                className={styles.embed}
                loading="lazy"
                src={track.embedUrl}
                title={track.iframeTitle}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
