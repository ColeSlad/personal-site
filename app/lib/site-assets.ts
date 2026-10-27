const images = new Map<string, Promise<HTMLImageElement>>();

/** Share decoded images between the startup screen and the WebGL renderer. */
export function loadSiteImage(source: string): Promise<HTMLImageElement> {
  const cached = images.get(source);
  if (cached) return cached;

  const image = new Image();
  image.decoding = "async";
  image.fetchPriority = "high";
  image.src = source;

  let timeout: ReturnType<typeof setTimeout>;
  const ready = Promise.race([
    image.decode().then(() => image),
    new Promise<never>((_, reject) => {
      timeout = setTimeout(() => reject(new Error(`Image load timed out: ${source}`)), 30000);
    }),
  ]).finally(() => clearTimeout(timeout)).catch((error) => {
    if (images.get(source) === ready) images.delete(source);
    throw error;
  });

  images.set(source, ready);
  return ready;
}
