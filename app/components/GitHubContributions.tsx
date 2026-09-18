import ContributionCalendar from "./ContributionCalendar";
import { parseContributions } from "../lib/github-contributions";

export default async function GitHubContributions() {
  let contributions = null;

  try {
    // Public data, cached hourly; no GitHub token is sent to the browser.
    const response = await fetch(
      "https://github-contributions-api.jogruber.de/v4/ColeSlad?y=last",
      { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000) },
    );
    if (!response.ok) throw new Error(`Contribution request failed: ${response.status}`);
    contributions = parseContributions(await response.json());
  } catch {
    // Keep the about page available when the external service is unavailable.
  }

  return (
    <section className="github-contributions" aria-labelledby="github-heading">
      <div className="github-heading">
        <h3 id="github-heading">github contributions</h3>
        <a href="https://github.com/ColeSlad" target="_blank" rel="noopener noreferrer">
          @ColeSlad <span aria-hidden="true">↗</span>
        </a>
      </div>
      {contributions ? (
        <ContributionCalendar contributions={contributions} />
      ) : (
        <p className="github-status">
          contributions are unavailable right now.{' '}
          <a href="https://github.com/ColeSlad?tab=overview" target="_blank" rel="noopener noreferrer">
            view on github ↗
          </a>
        </p>
      )}
    </section>
  );
}
