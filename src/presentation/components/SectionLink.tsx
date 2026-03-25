import type { AnchorHTMLAttributes, MouseEvent } from "react";

type SectionLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

function isInternalSectionLink(href: string) {
  return href.startsWith("#") && href.length > 1;
}

export function SectionLink({ href, onClick, ...props }: SectionLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      !isInternalSectionLink(href)
    ) {
      return;
    }

    const target = document.getElementById(href.slice(1));

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", href);
  };

  return <a {...props} href={href} onClick={handleClick} />;
}
