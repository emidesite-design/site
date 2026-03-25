import styles from "@/presentation/sections/FooterSection.module.css";
import { useLanguage } from "@/shared/i18n/LanguageContext";
import footerContent from "@/shared/content/footer.json";

const icons = {
  whatsapp: (
    <path d="M19.05 4.94A9.9 9.9 0 0 0 3.47 16.88L2 22l5.25-1.38a9.9 9.9 0 0 0 4.73 1.2h.01c5.46 0 9.9-4.44 9.9-9.9a9.8 9.8 0 0 0-2.84-6.98ZM12 20.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.84-3.04-.2-.31a8.19 8.19 0 0 1-1.27-4.37c0-4.52 3.7-8.2 8.25-8.2 2.2 0 4.27.85 5.82 2.4a8.14 8.14 0 0 1 2.4 5.8c0 4.53-3.69 8.23-8.23 8.23Zm4.5-6.13c-.25-.13-1.48-.73-1.71-.81-.23-.09-.4-.13-.56.12-.17.25-.65.8-.8.96-.15.17-.29.19-.54.07-.25-.13-1.05-.39-2-1.24a7.48 7.48 0 0 1-1.38-1.72c-.15-.26-.02-.4.11-.53.11-.11.25-.29.38-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.84-.2-.48-.4-.41-.56-.42h-.48c-.17 0-.44.06-.67.31s-.88.86-.88 2.1.9 2.43 1.02 2.6c.13.17 1.77 2.7 4.3 3.79.6.26 1.08.42 1.45.53.61.19 1.17.16 1.61.1.49-.07 1.48-.6 1.69-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.17-.48-.29Z" />
  ),
  instagram: (
    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5Zm8.9 1.2a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
  ),
  soundcloud: (
    <path d="M9.2 9.1c1 0 1.9.3 2.7.8.8-2 2.7-3.4 4.9-3.4 2.9 0 5.2 2.3 5.2 5.2S19.7 17 16.8 17H9.4c-1.8 0-3.4-1.5-3.4-3.4 0-1.6 1.1-3 2.6-3.4.1-.7.4-1.1.6-1.1ZM4 10.2h1v6.8H4v-6.8Zm-2 1.4h1V17H2v-5.4Z" />
  ),
  spotify: (
    <path d="M12 2.2a9.8 9.8 0 1 0 0 19.6 9.8 9.8 0 0 0 0-19.6Zm4.5 14.1c-.2.3-.5.4-.8.2-2.1-1.3-4.8-1.6-8-.9-.4.1-.6-.1-.7-.5-.1-.3.1-.6.5-.7 3.5-.8 6.5-.4 8.8 1 .3.2.4.5.2.9Zm1.2-2.5c-.2.4-.6.5-1 .3-2.4-1.4-6-1.8-8.9-1-.4.1-.8-.1-.9-.5-.1-.4.1-.8.5-.9 3.4-.9 7.3-.5 10.1 1.2.3.2.4.7.2.9Zm.1-2.6c-2.9-1.7-7.8-1.8-10.5-1-.5.1-.9-.1-1-.6-.1-.5.1-.9.6-1 3.1-.9 8.4-.7 11.8 1.2.4.2.5.7.3 1.1-.3.4-.8.5-1.2.3Z" />
  ),
  beatport: (
    <path d="M12 2 3.5 6.9v10.2L12 22l8.5-4.9V6.9L12 2Zm0 2.2 6.4 3.7V16L12 19.8 5.6 16V7.9L12 4.2Zm-2.2 3.7a3.5 3.5 0 1 0 2.4 6.6v1.5h1.6V7.9h-1.6v1.3a3.3 3.3 0 0 0-2.4-1.3Zm.3 1.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z" />
  ),
  email: (
    <path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5v-13Zm2.2-.7a1 1 0 0 0-.7.3L12 11.3l7.5-6.2a1 1 0 0 0-.7-.3h-13Zm14.3 2.3-6.6 5.5a1.4 1.4 0 0 1-1.8 0L4.5 7.1v11.4c0 .6.4 1 1 1h13c.6 0 1-.4 1-1V7.1Z" />
  ),
} as const;

export function FooterSection() {
  const { locale } = useLanguage();
  const copy = footerContent[locale];

  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.panel}>
        <div className={styles.copy}>
          <span className={styles.kicker}>{copy.kicker}</span>
          <h2 className={styles.title}>{copy.title}</h2>
          <p className={styles.description}>{copy.description}</p>
        </div>

        <div className={styles.actions}>
          <a className={styles.mailCta} href={`mailto:${copy.email}`}>
            {copy.email}
          </a>

          <div className={styles.socialGrid}>
            {copy.socials.map((social) => {
              const icon = icons[social.icon as keyof typeof icons];

              return (
                <a
                  aria-label={social.label}
                  className={styles.socialLink}
                  href={social.href}
                  key={social.label}
                  rel="noreferrer"
                  target="_blank"
                >
                  <svg
                    aria-hidden="true"
                    className={styles.socialIcon}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {icon}
                  </svg>
                  <span>{social.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <p className={styles.credits}>
        Desenvolvido por <span>henlpz</span> e design por <span>LOWCREW STUDIO</span>
      </p>
    </footer>
  );
}
