export function activeAlternateSection(
  tops: { work?: number; about?: number },
  viewportHeight: number,
): "orbit" | "work" | "about" {
  const threshold = viewportHeight * 0.4;
  if (tops.about !== undefined && tops.about <= threshold) return "about";
  if (tops.work !== undefined && tops.work <= threshold) return "work";
  return "orbit";
}
