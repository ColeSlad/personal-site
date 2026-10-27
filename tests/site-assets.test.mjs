import { after, test } from "node:test";
import assert from "node:assert/strict";
import { loadSiteImage } from "../app/lib/site-assets.ts";

const originalImage = globalThis.Image;
const requests = [];

globalThis.Image = class {
  constructor() {
    this.decoded = new Promise((resolve, reject) => {
      this.finishDecode = resolve;
      this.failDecode = reject;
    });
    requests.push(this);
  }
  decode() { return this.decoded; }
};

after(() => {
  if (originalImage) globalThis.Image = originalImage;
  else delete globalThis.Image;
});

test("startup waits until the image has decoded", async () => {
  const ready = loadSiteImage("/test/await-decode.webp");
  const image = requests.at(-1);
  let resolved = false;
  void ready.then(() => { resolved = true; });
  await Promise.resolve();
  assert.equal(resolved, false);
  image.finishDecode();
  assert.equal(await ready, image);
});

test("startup and renderer reuse the same decoded image without another request", async () => {
  const before = requests.length;
  const startup = loadSiteImage("/test/shared-texture.webp");
  assert.equal(loadSiteImage("/test/shared-texture.webp"), startup);
  const image = requests.at(-1);
  image.finishDecode();
  await startup;
  assert.equal(await loadSiteImage("/test/shared-texture.webp"), image);
  assert.equal(requests.length, before + 1);
});

test("a failed texture can be retried instead of caching the failure", async () => {
  const failed = loadSiteImage("/test/retry-texture.webp");
  requests.at(-1).failDecode(new Error("Download failed"));
  await assert.rejects(failed, /Download failed/);
  const retry = loadSiteImage("/test/retry-texture.webp");
  assert.notEqual(retry, failed);
  const image = requests.at(-1);
  image.finishDecode();
  assert.equal(await retry, image);
});
