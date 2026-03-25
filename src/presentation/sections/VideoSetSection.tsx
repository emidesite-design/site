import { useEffect, useState } from "react";
import styles from "@/presentation/sections/VideoSetSection.module.css";
import { SectionHeading } from "@/presentation/components/SectionHeading";
import { useShortsVideos } from "@/presentation/hooks/useShortsVideos";
import { useLanguage } from "@/shared/i18n/LanguageContext";
import videoSetContent from "@/shared/content/videoSet.json";

export function VideoSetSection() {
  const { locale } = useLanguage();
  const copy = videoSetContent[locale];
  const { items, loading } = useShortsVideos();
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const gallery = items.length > 0 ? items : copy.items;

  useEffect(() => {
    if (!activeVideoId) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveVideoId(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeVideoId]);

  const activeVideo = gallery.find((item) => item.id === activeVideoId) ?? null;

  return (
    <>
      <section className={styles.section} id="videos">
        <SectionHeading subtitle={copy.subtitle} title={copy.title} />

        <div className={styles.grid}>
          {gallery.map((item) => (
            <article className={styles.card} key={item.id}>
              <button
                aria-label={`${copy.playLabel}: ${item.title}`}
                className={styles.thumbnailButton}
                onClick={() => setActiveVideoId(item.id)}
                type="button"
              >
                <img
                  alt={item.thumbnailAlt}
                  className={styles.thumbnail}
                  decoding="async"
                  height={700}
                  loading="lazy"
                  src={item.thumbnailSrc}
                  width={1200}
                />
                <span className={styles.playButton}>
                  <span className={styles.playIcon} />
                </span>
              </button>
            </article>
          ))}
        </div>

        {!loading && items.length === 0 ? (
          <p className={styles.emptyState}>{copy.emptyLabel}</p>
        ) : null}

        {copy.ctaHref ? (
          <div className={styles.actionWrap}>
            <a
              className={styles.cta}
              href={copy.ctaHref}
              rel="noreferrer"
              target="_blank"
            >
              {copy.ctaLabel}
            </a>
          </div>
        ) : null}
      </section>

      {activeVideo ? (
        <div
          aria-modal="true"
          className={styles.modalOverlay}
          onClick={() => setActiveVideoId(null)}
          role="dialog"
        >
          <div className={styles.modalCard} onClick={(event) => event.stopPropagation()}>
            <button
              aria-label={copy.closeLabel}
              className={styles.closeButton}
              onClick={() => setActiveVideoId(null)}
              type="button"
            >
              {copy.closeLabel}
            </button>
            <div className={styles.videoFrame}>
              <iframe
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                src={activeVideo.embedUrl}
                title={activeVideo.title}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
