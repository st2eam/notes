import { matchesQuery } from './model.mjs';
export function searchNotes(notes, documents, query, quick = false) {
  const tokens = query.match(/-?(?:path:|tag:|category:|origin:)?"[^"]+"|\S+/g) || [];
  const structured = tokens.filter(t=>/^-?(path:|tag:|category:|origin:)/.test(t)).join(' ');
  const terms = tokens.filter(t=>!/^(-?path:|-?tag:|-?category:|-?origin:)/.test(t)).map(t=>t.replace(/^"|"$/g,'').toLowerCase());
  const texts = new Map(documents.map((d) => [d.id, d.text]));
  return notes
    .filter(note=>matchesQuery(note,structured))
    .map((note) => {
      const title = [note.title, ...note.aliases, note.id]
        .join(" ")
        .toLowerCase();
      const text = texts.get(note.id) || note.excerpt;
      const lower = text.toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (title.includes(term))
          score +=
            20 +
            (note.title.toLowerCase().startsWith(term) ? 10 : 0) +
            ([note.title, ...note.aliases].some((s) => s.toLowerCase() === term)
              ? 30
              : 0);
        else if (!quick && lower.includes(term)) score += 2;
        else {
          if (!quick || !fuzzy(title, term)) return null;
          score += 1;
        }
      }
      const pos = terms.length
        ? lower.indexOf(terms.find((t) => lower.includes(t)) || "")
        : 0;
      const start = Math.max(0, pos - 45);
      return {
        note,
        score,
        context:
          (start ? "…" : "") +
          text.slice(start, start + 160).replace(/\n/g, " "),
      };
    })
    .filter(Boolean)
    .sort(
      (a, b) => b.score - a.score || a.note.title.localeCompare(b.note.title),
    )
    .slice(0, 80);
}
function fuzzy(text, term) {
  let i = 0;
  for (const c of text) if (c === term[i]) i++;
  return i === term.length;
}
