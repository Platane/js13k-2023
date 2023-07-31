import * as fs from "node:fs/promises";
import * as path from "node:path";
import { tmpdir } from "node:os";

export const createTmpDir = () => fs.mkdtemp(path.join(tmpdir(), "js13k-"));

export const buildJsCode = async ({ minify }: { minify?: boolean } = {}) => {
  const outdir = await createTmpDir();

  const res = await Bun.build({
    entrypoints: [path.join(import.meta.dir, "/../game/index.ts")],
    outdir,
    target: "browser",
    minify,
  });

  const index = res.outputs.find((o) => o.path.endsWith("index.js"))!;

  return index.text();
};

export const buildIndexHtml = (jsCode: string) =>
  [
    "<!DOCTYPE html>",
    '<html lang="en">',
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width">',
    `<script>${jsCode}</script>`,
    "</head>",
    "<body>",
    "<canvas/>",
    "</body>",
    "</html>",
  ].join("");
