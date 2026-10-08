// Compatibility identities are generated from the reviewed migration manifest.
import { migrationPaths } from "./migration-paths.mjs";
export { migrationPaths };
export const migrateNoteId = (id) => migrationPaths[id] || id;
export function migrateQuery(query = "") {
  return query.replace(/(-?)path:("[^"]+"|[^\s]+)/g, (_, negative, raw) => {
    const value = raw.replace(/^"|"$/g, "");
    const exact =
      migrationPaths[value] ||
      migrationPaths[value.replace(/\.html$/, ".md")] ||
      migrationPaths[value + ".md"];
    if (exact && !value.endsWith("/"))
      return negative + 'path:"' + exact.replace(/\.md$/, "") + '"';
    const matched = Object.entries(migrationPaths).filter(([old]) =>
      old.startsWith(value),
    );
    if (!matched.length) return negative + "path:" + raw;
    const target = matched.map(([, next]) => next.split("/")[0]);
    if (
      new Set(target).size === 1 &&
      value.split("/").filter(Boolean).length === 1 &&
      !["C++", "Python", "Tools", "Fundamentals"].includes(
        value.replace(/\/$/, ""),
      )
    ) {
      const common = matched[0][1].split("/");
      while (
        common.length &&
        !matched.every(([, next]) => next.startsWith(common.join("/") + "/"))
      )
        common.pop();
      return negative + 'path:"' + common.join("/") + '/"';
    }
    return negative + 'origin:"' + value + '"';
  });
}
