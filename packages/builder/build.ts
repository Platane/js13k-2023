import * as fs from "node:fs";
import * as path from "node:path";
import { buildCss, buildIndexHtml, buildJsCode } from "./utils";
import { execFileSync } from "node:child_process";

const outDir = path.join(import.meta.dir, "../../dist");

fs.rmdirSync(outDir, { recursive: true });

fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(
  path.join(outDir, "index.html"),
  buildIndexHtml(
    await buildJsCode({ minify: true }),
    await buildCss({ minify: true })
  )
);

const listFiles = (filename: string): string[] => {
  const stat = fs.statSync(filename);
  if (stat.isFile()) return [filename];
  if (stat.isDirectory())
    return fs
      .readdirSync(filename)
      .map((f) => listFiles(path.join(filename, f)))
      .flat();
  return [];
};

execFileSync("advzip", [
  "--add",
  "--shrink-insane",
  path.join(outDir, "bundle.zip"),
  ...listFiles(outDir),
]);

//
// write size info
{
  const size = fs.statSync(path.join(outDir, "bundle.zip")).size;
  const literalSize = (size / 1024).toFixed(2) + "K";
  const content = {
    label: "size",
    message: literalSize,
    color: size < 13312 ? "success" : "important",
  };
  fs.writeFileSync("dist/shieldio_size.json", JSON.stringify(content));

  console.log(literalSize);
}
