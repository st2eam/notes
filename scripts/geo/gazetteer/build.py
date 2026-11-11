#!/usr/bin/env python3
"""Extract a pinned GeoNames subset. Run with python3 -I; never executes input."""
import argparse
import csv
import hashlib
import io
import math
from pathlib import Path
import re
import zipfile

ROOT = Path(__file__).resolve().parents[3]
SOURCE = ROOT / "public/geo/sources/geonames"
ZIP_SHA256 = "6e5bb17e2c265df549ca7d8cae1762d8cf4ce04a9edca9426c2cdbf378b42c0e"
HEADER = ["id", "name", "country", "lon", "lat", "population", "altChineseNames", "asciiName"]
# The dump has no alias language tags. Keep Han-script candidates, excluding kana,
# hangul, Latin transliterations and numeric variants; this is not language proof.
HAN = re.compile(r"[㐀-䶿一-鿿豈-﫿\U00020000-\U000323af]")
HAN_NAME = re.compile(r"[㐀-䶿一-鿿豈-﫿\U00020000-\U000323af·・．.\-—\s（）()]+").fullmatch


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def chinese_names(fields):
    return sorted({s.strip() for s in [fields[1], fields[2], *fields[3].split(",")]
                   if HAN.search(s) and HAN_NAME(s.strip())})


def search_names(fields):
    chinese = chinese_names(fields)
    # A transparent modern suffix normalization, not an ancient-name mapping.
    chinese += [s[:-1] for s in chinese if s.endswith("市") and len(s) > 2]
    return sorted(set(chinese))


def read_dump(archive):
    if digest(archive) != ZIP_SHA256:
        raise ValueError("ZIP SHA-256 mismatch: use the pinned snapshot, not a new daily dump")
    with zipfile.ZipFile(archive) as z:
        info = z.getinfo("cities15000.txt")
        if info.file_size > 40_000_000:
            raise ValueError("Unexpected uncompressed member size")
        # Read the one expected member in memory: no path extraction or imports.
        text = z.read(info).decode("utf-8")
    rows = {}
    for number, fields in enumerate(csv.reader(io.StringIO(text), delimiter="\t", quoting=csv.QUOTE_NONE), 1):
        if len(fields) != 19:
            raise ValueError(f"Invalid source column count at row {number}")
        ident = int(fields[0])
        lon, lat, population = float(fields[5]), float(fields[4]), int(fields[14])
        if ident <= 0 or ident in rows or fields[6] != "P" or population < 0:
            raise ValueError(f"Invalid source city at row {number}")
        if not (math.isfinite(lon) and math.isfinite(lat) and -180 <= lon <= 180 and -90 <= lat <= 90):
            raise ValueError(f"Invalid coordinates at row {number}")
        rows[ident] = fields
    return rows


def choose(rows, notes):
    paths = sorted(notes.rglob("*.md"))
    if not paths:
        raise ValueError("No history notes found")
    corpus = "\n".join(p.read_text(encoding="utf-8") for p in paths)
    # Index short ASCII phrases once instead of running 68k regex searches over
    # the whole Chinese corpus. Punctuation/whitespace separate English tokens.
    tokens = lambda value: tuple(re.findall(r"[a-z0-9]+", value.lower()))
    english_candidates = {tokens(name) for fields in rows.values() for name in fields[1:3]
                          if len(name) >= 4 and name.isascii()}
    lengths = {len(value) for value in english_candidates if value}
    english_mentions = set()
    for fragment in re.findall(r"[A-Za-z0-9][A-Za-z0-9 \t’'().,_-]*", corpus):
        words = tokens(fragment)
        for size in lengths:
            for start in range(len(words) - size + 1):
                phrase = words[start:start + size]
                if phrase in english_candidates:
                    english_mentions.add(phrase)
    selection = []
    for ident, fields in sorted(rows.items()):
        reasons = []
        matched = [s for s in search_names(fields) if len(s) >= 2 and s in corpus]
        # Consider canonical name and ASCII name only; avoid every transliteration.
        for name in sorted(set(fields[1:3])):
            if len(name) >= 4 and name.isascii() and tokens(name) in english_mentions:
                matched.append(name)
        if matched:
            reasons.append("note-name-match")
        if fields[7] == "PPLC":
            reasons.append("capital")
        if int(fields[14]) >= 1_000_000:
            reasons.append("population>=1000000")
        if reasons:
            selection.append([str(ident), "|".join(reasons), "|".join(sorted(set(matched)))])
    return selection


def write_tsv(path, header, rows):
    buffer = io.StringIO(newline="")
    writer = csv.writer(buffer, delimiter="\t", lineterminator="\n", quoting=csv.QUOTE_NONE)
    writer.writerow(header)
    writer.writerows(rows)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(buffer.getvalue(), encoding="utf-8", newline="")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--zip", type=Path, default=Path(__file__).resolve().parent / "raw/cities15000.zip",
                        help="Previously downloaded pinned cities15000.zip; defaults to raw/cities15000.zip")
    parser.add_argument("--selection", type=Path, default=SOURCE / "selection.tsv")
    parser.add_argument("--output", type=Path, default=ROOT / "public/geo/v1/cities.tsv")
    parser.add_argument("--select-notes", type=Path, help="Explicitly regenerate selection from this notes directory")
    args = parser.parse_args()
    rows = read_dump(args.zip)
    if args.select_notes:
        selection = choose(rows, args.select_notes)
        write_tsv(args.selection, ["id", "reason", "matchedNames"], selection)
    else:
        with args.selection.open(encoding="utf-8", newline="") as stream:
            reader = csv.DictReader(stream, delimiter="\t")
            if reader.fieldnames != ["id", "reason", "matchedNames"]:
                raise ValueError("Invalid selection header")
            selection = [[r["id"], r["reason"], r["matchedNames"]] for r in reader]
    ids = [int(row[0]) for row in selection]
    if not ids or len(set(ids)) != len(ids) or not set(ids) <= rows.keys():
        raise ValueError("Selection contains empty, duplicate or missing IDs")
    output = []
    for ident in sorted(ids):
        f = rows[ident]
        aliases = chinese_names(f)
        if any("|" in value for value in aliases):
            raise ValueError("Alias contains reserved delimiter")
        output.append([str(ident), f[1], f[8], f[5], f[4], f[14], "|".join(aliases), f[2]])
    write_tsv(args.output, HEADER, output)
    print(f"Source: {len(rows)} cities; selected: {len(output)}; output: {args.output.stat().st_size} bytes")
    print(f"{digest(args.output)}  {args.output}")


if __name__ == "__main__":
    main()
