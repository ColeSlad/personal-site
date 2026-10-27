import { ThemeTransitionLink } from "./ThemeTransition";

export default function ThemeSwitch() {
  return (
    <ThemeTransitionLink
      href="/alternate"
      className="theme-switch"
      aria-label="Explore the alternate version of this site"
    >
      <span className="theme-switch-label">another side</span>
      <span className="theme-switch-arrow" aria-hidden="true">→</span>
    </ThemeTransitionLink>
  );
}
