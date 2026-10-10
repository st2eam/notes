import path from "node:path";
import { redirectTarget } from "../redirects.mjs";

export function vaultDevRefresh(refresh) {
  return {
    name: "vault-dev-refresh",
    configureServer(server) {
      let timer;
      const root = server.config.root;
      const changed = (file) => {
        const relative = path.relative(root, file).replaceAll("\\", "/");
        if (!relative.endsWith(".md") || relative.startsWith("../") ||
          relative.split("/").some((part) => part.startsWith(".") ||
            ["node_modules", "docs", "public", "tests", "cache", "temp"].includes(part))) return;
        clearTimeout(timer);
        timer = setTimeout(() => {
          try {
            refresh();
            // Data loader exports and layout snapshots must be loaded together.
            server.moduleGraph.invalidateAll();
            server.ws.send({ type: "full-reload" });
          } catch (error) {
            server.config.logger.warn("Knowledge base refresh: " + error.message);
          }
        }, 300);
      };
      server.watcher.on("add", changed).on("unlink", changed).on("change", changed);
      server.httpServer?.once("close", () => {
        clearTimeout(timer);
        for (const event of ["add", "unlink", "change"]) server.watcher.off(event, changed);
      });
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url || "/", "http://localhost");
        if (!url.pathname.endsWith(".html") && !url.pathname.endsWith("/")) return next();
        const target = redirectTarget(url.pathname);
        if (!target) return next();
        const destination = server.config.base.replace(/\/$/, "") + target + ".html";
        if (decodeURIComponent(url.pathname) === destination) return next();
        res.statusCode = 302;
        res.setHeader("Location", encodeURI(destination) + url.search);
        res.end();
      });
    },
  };
}
