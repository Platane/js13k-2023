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

export const buildIndexHtml = async (
  jsCode: string,
  cssCode: string = "",
  { minify }: { minify?: boolean } = {}
) => {
  let html = (
    await fs.readFile(path.join(import.meta.dir, "/../game/index.html"))
  ).toString();

  html = html.replace("</body>", `<script>${jsCode}</script></body>`);

  if (cssCode)
    html = html.replace("</head>", `<style>${cssCode}</style></head>`);

  if (minify) html = html.replace(/\>\s+\</g, "><");

  return html;
};
