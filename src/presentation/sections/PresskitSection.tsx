import styles from "@/presentation/sections/PresskitSection.module.css";
import { SectionHeading } from "@/presentation/components/SectionHeading";
import { usePresskitImages } from "@/presentation/hooks/usePresskitImages";
import { useLanguage } from "@/shared/i18n/LanguageContext";
import presskitContent from "@/shared/content/presskit.json";

export function PresskitSection() {
  const { locale } = useLanguage();
  const copy = presskitContent[locale];
  const { images, loading } = usePresskitImages();
  const gallery = images.length > 0 ? images : copy.images;

  return (
    <section className={styles.section} id="presskit">
      <SectionHeading subtitle={copy.subtitle} title={copy.title} />

      <div className={styles.grid}>
        {gallery.map((image) => (
          <article
            className={styles.card}
            key={"id" in image ? image.id : image.alt}
          >
            <img
              alt={"alt" in image ? image.alt : image.id}
              className={styles.image}
              decoding="async"
              height={"height" in image ? image.height : 960}
              loading="lazy"
              src={"url" in image ? image.url : image.src}
              width={"width" in image ? image.width : 720}
            />
          </article>
        ))}
      </div>

      {!loading && images.length === 0 ? (
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
  );
}
