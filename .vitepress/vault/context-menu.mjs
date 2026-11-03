const embedParameters = ["embed", "theme", "background", "parentOrigin"];

export function publicNoteUrl(href, origin, base = "/notes/") {
  const url = new URL(href, origin);
  if (url.origin !== new URL(origin).origin || !/^https?:$/.test(url.protocol))
    throw new Error("Expected an internal note URL");
  const prefix = "/" + base.split("/").filter(Boolean).join("/");
  if (prefix !== "/" && url.pathname !== prefix && !url.pathname.startsWith(prefix + "/"))
    url.pathname = prefix + url.pathname;
  for (const parameter of embedParameters) url.searchParams.delete(parameter);
  return url.href;
}

export function contextMenuPosition(point, size, viewport, margin = 8) {
  const place = (coordinate, length, available) => {
    const inset = Math.min(margin, Math.max(0, available / 2));
    const extent = Math.min(length, Math.max(0, available - inset * 2));
    const position = coordinate + extent > available - inset
      ? coordinate - extent
      : coordinate;
    return Math.max(inset, Math.min(position, available - inset - extent));
  };
  return {
    left: place(point.x, size.width, viewport.width),
    top: place(point.y, size.height, viewport.height),
  };
}
