const SOCIAL_LINKS = [
  { label: "github", href: "https://github.com/samuelorobosa" },
  { label: "linkedin", href: "https://www.linkedin.com/in/samuel-amagbakhen" },
  { label: "twitter", href: "https://twitter.com/Samuel_Orobosa" },
] as const;

export default function Footer() {
  return (
    <footer className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 px-4 sm:px-8 md:px-[52px] py-6">
      <span className="text-[11px] font-normal text-muted">
        © 2025 Samuel Orobosa Amagbakhen
      </span>

      <div className="flex gap-6">
        {SOCIAL_LINKS.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] font-normal text-muted no-underline transition-colors duration-150 hover:text-ink"
          >
            {label}
          </a>
        ))}
      </div>
    </footer>
  );
}
