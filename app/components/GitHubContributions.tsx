import ContributionCalendar from "./ContributionCalendar";
import { getGitHubContributions } from "../lib/github-contributions";

export default async function GitHubContributions() {
  // Public data, cached hourly, with GitHub itself as a fallback.
  const contributions = await getGitHubContributions();

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
