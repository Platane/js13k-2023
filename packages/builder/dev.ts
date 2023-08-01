import { createServer } from "node:http";
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
    const loop = () => {
      fetch("/__watcher")
        .then(async (res) => {
          if ((await res.text()) === "refresh")
            setTimeout(() => window.location.reload(), 100);

          loop();
        })
        .catch(loop);
    };

    loop();
  }

  return html.replace(
    /<script>/,
    `<script>;(${code.toString()})()</script><script>`
  );
};

const server = createServer(async (req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "content-type": "text/html" });
    res.write(
      injectWatcher(await buildIndexHtml(await buildJsCode(), await buildCss()))
    );
    res.end();
  } else if (req.url === "/__watcher") {
    onChangePromise.then(() => {
      res.writeHead(200);
      res.end("refresh");
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3000, () => {
  const a = server.address() as any;

  const origin =
    (a.family === "IPv6" && `http://[${a.address}]:${a.port}`) ||
    (a.family === "IPv4" && `http://${a.address}:${a.port}`) ||
    JSON.stringify(a);

  console.log(`serving ${origin}`);
});
