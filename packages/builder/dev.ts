import { buildCss, buildIndexHtml, buildJsCode } from "./utils";
import chokidar from "chokidar";
import * as path from "node:path";

const outDir = path.join(import.meta.dir, "../game");

let onChange: () => void;
let onChangePromise = new Promise<void>((r) => {
  onChange = r;
});

chokidar.watch(outDir).on("all", () => {
  onChange();
  onChangePromise = new Promise<void>((r) => {
    onChange = r;
  });
});

const injectWatcher = (html: string) => {
  function code() {
    let delay = 0;

    const loop = () => {
      fetch("/__watcher")
        .then(async (res) => {
          delay = 0;
          if ((await res.text()) === "refresh")
            setTimeout(() => window.location.reload(), 100);

          loop();
        })
        .catch(() => {
          setTimeout(loop, delay);
          delay = Math.min(5000, delay * 2 + 100);
        });
    };

    loop();
  }

  return html.replace(
    /<\/head>/,
    `<script>;(${code.toString()})()</script></head>`
  );
};

Bun.serve({
  async fetch(req) {
    const { pathname } = new URL(req.url);

    if (pathname === "/") {
      const payload = injectWatcher(
        await buildIndexHtml(await buildJsCode(), await buildCss())
      );
      return new Response(payload, {
        headers: { "content-type": "text/html" },
      });
    }

    if (pathname === "/__watcher") {
      await onChangePromise;

      return new Response("refresh");
    }

    return new Response("", { status: 404 });
  },
});
