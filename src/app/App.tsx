import styles from "@/app/App.module.css";
import { SectionLink } from "@/presentation/components/SectionLink";
import { HeroSection } from "@/presentation/sections/HeroSection";
import { HeroLinksSection } from "@/presentation/sections/HeroLinksSection";
import { SoundCloudSection } from "@/presentation/sections/SoundCloudSection";
import { SpotifySection } from "@/presentation/sections/SpotifySection";
import { BeatportSection } from "@/presentation/sections/BeatportSection";
import { BiographySection } from "@/presentation/sections/BiographySection";
import { PresskitSection } from "@/presentation/sections/PresskitSection";
import { VideoSetSection } from "@/presentation/sections/VideoSetSection";
import { FooterSection } from "@/presentation/sections/FooterSection";
import { LanguageSwitcher } from "@/presentation/components/LanguageSwitcher";
import { LanguageProvider, useLanguage } from "@/shared/i18n/LanguageContext";
import appContent from "@/shared/content/app.json";

function AppShell() {
  const { locale } = useLanguage();
  const copy = appContent[locale];

  return (
    <div className={styles.pageShell}>
      <header className={styles.topbar}>
        <SectionLink aria-label={copy.brand} className={styles.brand} href="#hero">
          <img
            alt=""
            aria-hidden="true"
            className={styles.brandLogo}
            decoding="async"
            height={1080}
            src="/assets/logo.svg"
            width={1080}
          />
        </SectionLink>
        <nav className={styles.topnav} aria-label={copy.navigationAriaLabel}>
          <SectionLink href="#soundcloud">{copy.navigation.soundcloud}</SectionLink>
          <SectionLink href="#spotify">{copy.navigation.spotify}</SectionLink>
          <SectionLink href="#beatport">{copy.navigation.beatport}</SectionLink>
          <SectionLink href="#videos">{copy.navigation.videos}</SectionLink>
          <SectionLink href="#biography">{copy.navigation.biography}</SectionLink>
          <SectionLink href="#presskit">{copy.navigation.presskit}</SectionLink>
          <SectionLink href="#contact">{copy.navigation.contact}</SectionLink>
          <LanguageSwitcher tone="ghost" />
        </nav>
      </header>

      <main className={styles.main}>
        <HeroSection />
        <br></br>
        <HeroLinksSection />
        <div className={styles.featureBand}>
          <BiographySection />
          <PresskitSection />
        </div>
        <VideoSetSection />
        <SpotifySection />
        <SoundCloudSection />
        <BeatportSection />
        <FooterSection />
      </main>
    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <AppShell />
    </LanguageProvider>
  );
}
