import { createServer } from "node:http";
import { buildIndexHtml, buildJsCode } from "./utils";

// import this so it is watched
import "../game/index";

const server = createServer(async (req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "content-type": "text/html" });
    res.write(injectWatcher(buildIndexHtml(await buildJsCode())));
    res.end();
  } else if (req.url === "/__watcher") {
    res.writeHead(200);
    res.write("ok");
    setTimeout(() => res.end(), 5 * 60 * 1000);
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

function injectWatcher(html: string) {
  function code() {
    const loop = () => {
      fetch("/__watcher")
        .catch((err) => {
          // @ts-ignore
          setTimeout(() => window.location.reload(), 100);
        })
        .then(loop);
    };

    loop();
  }

  return html.replace(
    /<\/script>/,
    `</script><script>;(${code.toString()})()</script>`
  );
}
