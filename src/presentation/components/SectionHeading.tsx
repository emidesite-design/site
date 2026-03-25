import styles from "@/presentation/components/SectionHeading.module.css";
import type { ReactNode } from "react";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  iconSrc?: string;
  iconAlt?: string;
}

export function SectionHeading({
  title,
  subtitle,
  action,
  iconSrc,
  iconAlt = "",
}: SectionHeadingProps) {
  return (
    <div className={styles.wrapper}>
      <div>
        <div className={styles.titleRow}>
        
          <h2 className={styles.title}>{title}</h2>
        </div>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      </div>
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  );
}
