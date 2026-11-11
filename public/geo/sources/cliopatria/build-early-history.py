#!/usr/bin/env python3
"""Build curated Chinese historical snapshots from pinned Cliopatria records.
Run with python3 -I. Never execute or import downloaded data.
"""
import argparse
import copy
import hashlib
import json
from pathlib import Path
import runpy
import shutil
import subprocess
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "public/geo/sources/cliopatria"
OUTPUT = ROOT / "public/geo/v1"
COMMIT = "5f433377139a6eeaeacbdc894b70f8805b72c8b5"
REPOSITORY = "https://github.com/Seshat-Global-History-Databank/cliopatria"
FILES = {
    "cliopatria.geojson.zip": "e10a4e429fca708788ff9e7572a95fce801fae55852d217cffabc1c59cd4eed4",
    "LICENSE.md": "62ca7e92dee4ebe402372d5e64f87845de445a6c0e5d76fddb68b3e33739d1a6",
    "README.md": "1d7057948a3dcdeb359eb2e1482b71f9d9fd7650d0e55ab09dc9f90dc341b5e9",
}
# Explicitly selected snapshots. These are contextual references, not annual borders.
# (id, period, representative year, first/last event year, source names/display names)
SNAPSHOTS = [
    # Earlier source slices omit Qi or Lingnan; use the explicitly dated 210 BCE reference.
    ("qin-210-bce", "秦", -210, -221, -207, [("Qin Dynasty", "秦")]),
    ("western-han-200-bce", "西汉", -200, -202, -128, [("Han Dynasty", "西汉")]),
    ("western-han-100-bce", "西汉", -100, -127, -37, [("Han Dynasty", "西汉")]),
    ("western-han-1", "西汉", 1, -36, 8, [("Han Dynasty", "西汉")]),
    ("eastern-han-50", "东汉", 50, 25, 89, [("Han Dynasty", "东汉")]),
    # The 200 CE Han source omits Luoyang; 100 CE remains an explicitly older reference.
    ("eastern-han-100", "东汉", 100, 90, 220, [("Han Dynasty", "东汉")]),
    # The 230 CE Wu source omits much of the south; do not publish that slice.
    ("three-kingdoms-250", "三国", 250, 221, 260,
     [("Cao Wei", "曹魏"), ("Shu Han", "蜀汉"), ("Eastern Wu", "孙吴")]),
    ("three-kingdoms-262", "三国", 262, 261, 262,
     [("Cao Wei", "曹魏"), ("Shu Han", "蜀汉"), ("Eastern Wu", "孙吴")]),
    ("wei-wu-264", "三国", 264, 263, 264, [("Cao Wei", "曹魏"), ("Eastern Wu", "孙吴")]),
    ("jin-wu-270", "三国", 270, 265, 279, [("Western Jin", "西晋"), ("Eastern Wu", "孙吴")]),
    ("shang-1200-bce", "商", -1200, -1600, -1047, [("Shang Dynasty", "商")]),
    ("western-zhou-900-bce", "西周", -900, -1046, -771, [("Zhou Dynasty", "西周")]),
    ("spring-autumn-600-bce", "春秋", -600, -770, -481,
     [("Jin", "晋"), ("Chu", "楚"), ("Qin", "秦"), ("Qi", "齐"), ("Song", "宋"),
      ("Chen", "陈"), ("Lu", "鲁"), ("Zheng", "郑"), ("Yan", "燕"), ("Wu", "吴"), ("Later Zhou", "周王室")]),
    ("warring-states-300-bce", "战国", -300, -480, -222,
     [("Qin", "秦"), ("Chu", "楚"), ("Qi", "齐"), ("Yan", "燕"), ("Zhao", "赵"), ("Wei", "魏"), ("Han", "韩")]),
    ("western-jin-300", "西晋", 300, 280, 316, [("Western Jin", "西晋")]),
    ("eastern-jin-402", "东晋", 402, 317, 419,
     [("Western Jin", "东晋"), ("Northern Wei", "北魏"), ("Later Qin", "后秦"),
      ("Southern Yan", "南燕"), ("Later Liang", "后凉"), ("Northern Liang", "北凉"), ("Southern Liang", "南凉")]),
    ("north-south-450", "南北朝", 450, 420, 533, [("Northern Wei", "北魏"), ("Liu Song Dynasty", "刘宋")]),
    ("north-south-570", "南北朝", 570, 534, 588,
     [("Northern Qi", "北齐"), ("Northern Zhou", "北周"), ("Chen Dynasty", "陈"), ("Later Western Liang", "西梁")]),
    ("sui-600", "隋", 600, 581, 617, [("Sui Dynasty", "隋")]),
    ("tang-650", "唐", 650, 618, 754, [("Tang Dynasty", "唐")]),
    ("five-dynasties-920", "五代十国", 920, 907, 959,
     [("Later Liang Dynasty", "后梁"), ("Former Shu", "前蜀"), ("Southern Wu", "吴"),
      ("Min", "闽"), ("Wuyue", "吴越"), ("Southern Han", "南汉"), ("Southern Chu", "楚"), ("Later Jin", "晋（河东）")]),
    ("five-dynasties-970", "五代十国", 970, 960, 979,
     [("Northern Song", "北宋"), ("Southern Tang", "南唐"), ("Wuyue", "吴越"), ("Southern Han", "南汉"), ("Northern Han", "北汉"), ("Liao Dynasty", "辽")]),
    ("northern-song-1060", "北宋", 1060, 960, 1126,
     [("Northern Song", "北宋"), ("Liao Dynasty", "辽"), ("Western Xia", "西夏"), ("Kingdom of Dali", "大理")]),
    ("southern-song-1200", "南宋", 1200, 1127, 1279,
     [("Southern Song", "南宋"), ("Great Jin", "金"), ("Western Xia", "西夏"), ("Kingdom of Dali", "大理")]),
    ("yuan-1300", "元", 1300, 1271, 1367, [("Yuan Dynasty", "元")]),
    ("ming-1400", "明", 1400, 1368, 1549, [("Ming Dynasty", "明"), ("Northern Yuan", "北元")]),
    ("ming-1600", "明", 1600, 1550, 1644, [("Ming Dynasty", "明")]),
    ("qing-1700", "清", 1700, 1644, 1789, [("Qing Dynasty", "清")]),
    ("qing-1820", "清", 1820, 1790, 1859, [("Qing Dynasty", "清")]),
    ("qing-1900", "清", 1900, 1860, 1911, [("Qing Dynasty", "清")]),
    ("republic-1912", "中华民国", 1912, 1912, 1936, [("Republic of China", "中华民国")]),
    ("republic-1937", "中华民国", 1937, 1937, 1945, [("Republic of China", "中华民国")]),
    ("republic-1948", "中华民国", 1948, 1946, 1949, [("Republic of China", "中华民国"), ("Communist Party of China", "中共控制区")]),
]
LABELS = {
    "秦": [109, 35], "西汉": [110, 35], "东汉": [112, 35],
    "曹魏": [114, 37], "蜀汉": [103, 29], "孙吴": [116, 26], "西晋": [111, 35],
}


def digest(data):
    return hashlib.sha256(data).hexdigest()


def encoded(value):
    return (json.dumps(value, ensure_ascii=False, separators=(",", ":"), allow_nan=False) + "\n").encode()


def select(source):
    records = []
    indices = []
    for _, _, year, _, _, names in SNAPSHOTS:
        for name, _ in names:
            matches = [(i, f) for i, f in enumerate(source["features"])
                       if f["properties"]["Name"] == name
                       and f["properties"]["Type"] == "POLITY"
                       and f["properties"]["FromYear"] <= year <= f["properties"]["ToYear"]]
            if len(matches) != 1:
                raise ValueError(f"Expected exactly one {name} at {year}")
            index, feature = matches[0]
            if index not in indices:
                indices.append(index)
                records.append(feature)
    return {"type": "FeatureCollection", "sourceCommit": COMMIT,
            "sourceArchiveSHA256": FILES["cliopatria.geojson.zip"],
            "sourceFeatureIndices": indices, "features": records}


def acquire(archive=None, download=False):
    if not archive and not download:
        return
    # The archive stays outside public; only original selected records are shipped.
    with tempfile.TemporaryDirectory(prefix="notes-cliopatria-") as directory:
        staging = Path(directory)
        for name, checksum in FILES.items():
            target = staging / name
            if name == "cliopatria.geojson.zip" and archive:
                shutil.copyfile(archive, target)
            elif archive and (archive.parent / name).exists():
                shutil.copyfile(archive.parent / name, target)
            else:
                url = REPOSITORY.replace("github.com", "raw.githubusercontent.com") + f"/{COMMIT}/{name}"
                subprocess.run(["curl", "--fail", "--silent", "--show-error", "--location",
                                "--retry", "2", "--proto", "=https", "--proto-redir", "=https",
                                url, "--output", str(target)], check=True, cwd=ROOT)
            if digest(target.read_bytes()) != checksum:
                raise ValueError(f"Source checksum mismatch: {name}")
        with zipfile.ZipFile(staging / "cliopatria.geojson.zip") as zipped:
            # Read just the known data member; never extract or run archive content.
            with zipped.open("cliopatria_polities_only_v021.geojson") as member:
                subset = select(json.load(member))
        SOURCE.mkdir(parents=True, exist_ok=True)
        (SOURCE / "selected-original.geojson").write_bytes(encoded(subset))
        for name in ["LICENSE.md", "README.md"]:
            shutil.copyfile(staging / name, SOURCE / name)


def build():
    original_bytes = (SOURCE / "selected-original.geojson").read_bytes()
    if digest(original_bytes) != "60f20c96b9ee0c6f05bcb27183db9a52232ea10419dd77a1a852e0bef3766311":
        raise ValueError("Selected original checksum mismatch")
    subset = json.loads(original_bytes)
    if subset["sourceCommit"] != COMMIT or subset["sourceArchiveSHA256"] != FILES["cliopatria.geojson.zip"]:
        raise ValueError("Unexpected source revision")
    helpers = runpy.run_path(str(ROOT / "scripts/geo/build.py"))
    catalog = []
    total = 0
    for identifier, period, year, first, last, names in SNAPSHOTS:
        features = []
        for name, display in names:
            original = [f for f in subset["features"] if f["properties"]["Name"] == name
                        and f["properties"]["FromYear"] <= year <= f["properties"]["ToYear"]]
            if len(original) != 1:
                raise ValueError(f"Ambiguous subset record: {name}, {year}")
            feature = copy.deepcopy(original[0])
            helpers["validate_geometry"](feature["geometry"])
            feature["id"] = identifier + "-" + name.lower().replace(" ", "-")
            feature["properties"].update(displayName=display, representativeYear=year)
            if display in LABELS:
                feature["properties"]["labelCoordinates"] = LABELS[display]
            features.append(feature)
        collection = {"type": "FeatureCollection", "name": identifier,
                      "representativeYear": year, "sourceCommit": COMMIT,
                      "sourceId": "cliopatria-early-china", "license": "CC-BY-4.0",
                      "attribution": "Cliopatria — Seshat Global History Databank and contributors; curated subset",
                      "sourceDocumentation": "../sources/cliopatria/SOURCES.md", "features": features}
        content = encoded(collection)
        total += len(content)
        (OUTPUT / (identifier + ".geojson")).write_bytes(content)
        title = ("前 " + str(-year) if year < 0 else str(year)) + " 年"
        accuracy = "政权层级疆域示意；代表年份与事件当年可能不同，不表示郡县划分或精确控制线。"
        if identifier == "eastern-han-100":
            accuracy += "汉末笔记使用此较早参照，不区分曹操、袁绍等军阀控制范围。"
        if identifier == "three-kingdoms-250":
            accuracy += "早期三国笔记使用 250 年参照，不能据此判断 238 年平辽东前的归属。"
        if identifier in ["shang-1200-bce", "western-zhou-900-bce"]:
            accuracy += "早期王朝的势力范围具有较大不确定性，不等同于连续直接统治。"
        if identifier in ["spring-autumn-600-bce", "warring-states-300-bce", "eastern-jin-402", "five-dynasties-920"]:
            accuracy += "仅列所选主要政权，未穷尽当时各诸侯或割据政权。"
        if period == "中华民国":
            accuracy += "源图可能混合政权宣称范围与控制范围，不表示各方实际控制的精确复原。"
        entry = {"id": identifier, "scope": "china", "period": period,
                 "year": year, "from": first, "to": last,
                 "name": period + " · " + title,
                 "geometry": "/geo/v1/" + identifier + ".geojson",
                 "source": {"title": "Cliopatria · Seshat 历史疆域 · " + title,
                            "url": REPOSITORY + "/tree/" + COMMIT},
                 "accuracy": accuracy}
        aliases = {
            "spring-autumn-600-bce": ["春秋", "东周"],
            "warring-states-300-bce": ["战国", "东周", "秦"],
            "jin-wu-270": ["三国", "西晋", "两晋南北朝"],
            "western-jin-300": ["三国", "西晋", "两晋南北朝"],
            "eastern-jin-402": ["东晋", "两晋南北朝"],
            "north-south-450": ["南北朝", "两晋南北朝"],
            "north-south-570": ["南北朝", "两晋南北朝"],
            "northern-song-1060": ["北宋", "宋"],
            "southern-song-1200": ["南宋", "宋"],
        }
        if period in ["西汉", "东汉"]:
            entry["periods"] = [period, "汉"]
        if identifier in aliases:
            entry["periods"] = aliases[identifier]
        if identifier == "jin-wu-270":
            entry["name"] = "晋吴对峙 · 270 年"
        catalog.append(entry)
        print(identifier, len(features), len(content), digest(content))
    if total > 2_000_000:
        raise ValueError("Early history snapshots exceed 2 MB budget")
    output = "// Generated by scripts/geo/build-early-history.py; curated representative years.\n"
    output += "export const earlyHistoricalMaps = " + json.dumps(catalog, ensure_ascii=False, indent=2) + ";\n"
    (ROOT / ".vitepress/vault/geo-early-catalog.mjs").write_text(output)
    (SOURCE / "build-early-history.py").write_bytes(Path(__file__).read_bytes())


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--archive", type=Path, help="Verified upstream ZIP in an isolated data directory")
    parser.add_argument("--download", action="store_true")
    args = parser.parse_args()
    acquire(args.archive, args.download)
    build()


if __name__ == "__main__":
    main()
