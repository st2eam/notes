export function embedOptions(search, referrer = "", origin = "") {
  const params = new URLSearchParams(search);
  let parentOrigin = origin;
  try {
    const candidate = params.get("parentOrigin") || referrer;
    if (candidate) {
      const url = new URL(candidate);
      if (/^https?:$/.test(url.protocol)) parentOrigin = url.origin;
    }
  } catch {}
  return {
    theme: ["light", "dark"].includes(params.get("theme"))
      ? params.get("theme")
      : "auto",
    background: params.get("background") === "theme" ? "theme" : "transparent",
    parentOrigin,
  };
}
export function validEmbedMessage(event, parent, origin) {
  return (
    event.source === parent &&
    event.origin === origin &&
    event.data?.type === "notes:embed-config" &&
    ["light", "dark", "auto", undefined].includes(event.data.theme) &&
    ["transparent", "theme", undefined].includes(event.data.background)
  );
}
export function embedHref(href, currentSearch) {
  const url = new URL(href, "https://notes.invalid");
  const current = new URLSearchParams(currentSearch);
  url.searchParams.set("embed", "true");
  for (const key of ["theme", "background", "parentOrigin"]) {
    if (!url.searchParams.has(key) && current.has(key))
      url.searchParams.set(key, current.get(key));
  }
  return url.pathname + url.search + url.hash;
}
