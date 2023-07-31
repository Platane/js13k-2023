import * as fs from "node:fs/promises";
import * as path from "node:path";
import { tmpdir } from "node:os";
import { transform } from "lightningcss";

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

export const buildCss = async ({ minify }: { minify?: boolean } = {}) => {
  const css = await fs.readFile(
    path.join(import.meta.dir, "/../game/index.css")
  );

  if (!minify) return css.toString();
  else
    return transform({
      filename: "style.css",
      code: css,
      minify: true,
      sourceMap: false,
    }).code.toString();
};

export const buildIndexHtml = (jsCode: string, cssCode: string = "") =>
  [
    "<!DOCTYPE html>",
    '<html lang="en">',
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width">',
    cssCode ? `<style>${cssCode}</style>` : "",
    `<script>${jsCode}</script>`,
    "</head>",
    "<body>",
    "<canvas/>",
    "</body>",
    "</html>",
  ].join("");
