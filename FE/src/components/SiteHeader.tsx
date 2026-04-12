import type { SiteHeaderProps } from "../types";

export function SiteHeader({ isAuthenticated, onPrimaryAction }: SiteHeaderProps) {
  return (
    <header className="site-nav">
      <a className="brandmark" href="#top">
        <span className="brandmark-badge">CP</span>
        <span>Contest Platform</span>
      </a>
      <nav className="nav-links">
        <a href="#top">Home</a>
        <a href="#auth">Auth</a>
        <a href="#dashboard">Contests</a>
      </nav>
      <button className="nav-cta" onClick={onPrimaryAction} type="button">
        {isAuthenticated ? "Open contests" : "Sign in"}
      </button>
    </header>
  );
}
