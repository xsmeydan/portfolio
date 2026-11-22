const footerLinks = [
  { href: 'https://github.com/xsmeydan', label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/sudenur-meydan/', label: 'LinkedIn' },
  { href: 'https://www.medium.com/@sudenurmeydan01', label: 'Medium' },
  { href: 'https://github.com/xsmeydan/portfolio', label: 'Source' },
];

export default function Footer() {
  return (
    <footer className="w-full py-14 md:py-20 px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0 border-t border-white/5 bg-gradient-to-t from-primary/10 to-transparent bg-background mt-20 md:mt-32 relative z-10 md:hover:tracking-widest transition-all duration-700">
      <div className="text-headline-md font-headline-md text-primary">
        SM.
      </div>
      <nav aria-label="Social links" className="flex flex-wrap justify-center gap-x-4 gap-y-1 md:gap-8">
        {footerLinks.map(({ href, label }) => (
          <a
            key={label}
            className="text-on-surface-variant font-label-mono text-label-mono hover:text-secondary-fixed-dim transition-colors cursor-hover inline-flex items-center min-h-[44px] px-2 md:px-0"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {label}
          </a>
        ))}
      </nav>
      <div className="font-label-mono text-label-mono text-on-surface-variant text-sm text-center">
        © {new Date().getFullYear()} DESIGNED BY dasKindMitKeinemAuto
      </div>
    </footer>
  );
}
