import { defineConfig } from "vitepress";
import sidebar from "./sidebar";
import { readVault, wikiPlugin } from "./vault/build.mjs";
import { resolveLink, slugify } from "./vault/model.mjs";
const vault = readVault(process.cwd());

const base = "/notes/";

export default defineConfig({
  base,
  title: "Steam's Notes",
  outDir: "docs",
  srcExclude: [
    "README.md",
    "AGENTS.md",
    "api-examples.md",
    "markdown-examples.md",
  ],
  description: "A personal knowledge base",
  ignoreDeadLinks: true,
  markdown: {
    math: true,
    anchor: { slugify },
    config(md) {
      md.use(wikiPlugin, (source, reference) =>
        resolveLink(vault.notes, source, reference, true),
      );
      md.core.ruler.push("vault-links", (state) => {
        for (const token of state.tokens)
          for (const child of token.children || []) {
            if (child.type !== "link_open") continue;
            const href = child.attrGet("href");
            if (!href || href.startsWith("?") || href.startsWith("#")) continue;
            const resolved = resolveLink(
              vault.notes,
              state.env.relativePath || "",
              href,
              false,
            );
            if (resolved?.target) {
              child.attrSet("href", resolved.href);
              child.attrJoin("class", "internal-link");
            }
          }
      });
    },
  },
  head: [
    ["link", { rel: "icon", href: `${base}favicon.ico`, type: "image/x-icon" }],
    [
      "link",
      {
        rel: "icon",
        href: `${base}favicon.png`,
        type: "image/png",
        sizes: "128x128",
      },
    ],
    [
      "script",
      {},
      `(function(){try{var e=new URLSearchParams(window.location.search).get('embed')==='true';var f=window.self!==window.top;if(e||f){document.documentElement.classList.add('embed-mode')}}catch(x){}})()`,
    ],
  ],
  themeConfig: {
    nav: [
      { text: "首页", link: "/" },
      { text: "历史", link: "/历史/" },
    ],
    logo: "/logo.svg",
    sidebar,
    socialLinks: [{ icon: "github", link: "https://github.com/st2eam" }],
    outline: {
      label: "目录",
    },
    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },
    lastUpdated: {
      text: "最后更新",
    },
    returnToTopLabel: "返回顶部",
    sidebarMenuLabel: "菜单",
    darkModeSwitchLabel: "主题",
  },
});
