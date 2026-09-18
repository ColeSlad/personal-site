export type Contribution = {
  date: string;
  count: number;
  level: number;
};

export function parseContributions(data: unknown): Contribution[] {
  if (!data || typeof data !== "object" || !("contributions" in data)) {
    throw new Error("Missing GitHub contributions");
  }

  const days = data.contributions;
  if (!Array.isArray(days) || days.length === 0 || days.length > 371) {
    throw new Error("Invalid contribution calendar");
  }

  const contributions = days.map((day: unknown) => {
    if (
      !day || typeof day !== "object" ||
      !("date" in day) || typeof day.date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(day.date) ||
      !Number.isFinite(Date.parse(`${day.date}T00:00:00Z`)) ||
      !("count" in day) || typeof day.count !== "number" ||
      !Number.isInteger(day.count) || day.count < 0 ||
      !("level" in day) || typeof day.level !== "number" ||
      !Number.isInteger(day.level) || day.level < 0 || day.level > 4
    ) {
      throw new Error("Invalid contribution day");
    }

    return { date: day.date, count: day.count, level: day.level };
  }).sort((a, b) => a.date.localeCompare(b.date));

  // A continuous UTC date range keeps weekday and month labels aligned.
  const start = Date.parse(`${contributions[0].date}T00:00:00Z`);
  if (contributions.some((day, index) => (
    new Date(start + index * 86_400_000).toISOString().slice(0, 10) !== day.date
  ))) {
    throw new Error("Incomplete contribution calendar");
  }

  return contributions;
}
