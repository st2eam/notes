#!/usr/bin/env python3
"""Rebuild pinned overview GeoJSON. Run with python3 -I; no third-party modules."""

import argparse
import copy
import hashlib
import json
import math
from pathlib import Path
import shutil
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[2]
GEO = ROOT / "public" / "geo"
SOURCES = GEO / "sources"
OUTPUT = GEO / "v1"
LIMIT = 5_000_000

# Separate upstream datasets, directories, licenses and immutable revisions.
DATASETS = {
    "natural-earth": {
        "sourceId": "natural-earth-110m-land",
        "repository": "https://github.com/nvkelso/natural-earth-vector",
        "commit": "ca96624a56bd078437bca8184e78163e5039ad19",
        "license": "public-domain",
        "files": {
            "ne_110m_land.geojson": (
                "geojson/ne_110m_land.geojson",
                "9e0729ee253ca7d7a5c4ae9395fb1902264c5377c52e224d13dd85010e2835d9",
            ),
            "LICENSE.md": (
                "LICENSE.md",
                "2631b5b39b6d1acc56de75235109b5af2dbb4b0ac5a127b6f06185977247fd4b",
            ),
        },
    },
    "historical-basemaps": {
        "sourceId": "historical-basemaps-800",
        "repository": "https://github.com/aourednik/historical-basemaps",
        "commit": "4b5039e50d8d2464b065bd76ad6086cd4597108d",
        "license": "GPL-3.0-only",
        "files": {
            "world_800.geojson": (
                "geojson/world_800.geojson",
                "9d046cdc4662109c3f803ae46e2c8cba941aa092ec86eccc7823e6cf1554920c",
            ),
            "LICENSE": (
                "LICENSE",
                "8ceb4b9ee5adedde47b31e975c1d90c73ad27b6b165a1dcd80c7c545eb65b903",
            ),
            "README.md": (
                "README.md",
                "4a6d137790d3aea8c2a53c26d6a3fe4a43485f90d48b7751c5e53b65b2a8d6fe",
            ),
        },
    },
}

# Explicit name allowlist; no bounding-box clipping or invented unlabeled states.
SELECTION = {
    "Tang Empire": ("tang-800", "唐"),
    "Tibetan Empire": ("tibetan-empire-800", "吐蕃"),
    "Uyghurs": ("uyghurs-800", "回鹘"),
    "Nan Chao": ("nan-chao-800", "南诏"),
    "Silia": ("silia-800", "新罗"),
    "Parhae": ("parhae-800", "渤海"),
    "Japan": ("japan-800", "日本"),
    "Champa": ("champa-800", "占婆"),
}


def verify(path, expected):
    actual = hashlib.sha256(path.read_bytes()).hexdigest()
    if actual != expected:
        raise ValueError(f"Source checksum mismatch: {path}; {actual}")


def acquire(download):
    SOURCES.mkdir(parents=True, exist_ok=True)
    for directory, dataset in DATASETS.items():
        target = SOURCES / directory
        missing = []
        for filename, (_, checksum) in dataset["files"].items():
            path = target / filename
            if path.exists():
                verify(path, checksum)
            else:
                missing.append(filename)
        if not missing:
            continue
        if not download:
            raise FileNotFoundError(f"Missing {directory}: {missing}; use --download")
        # Each dataset downloads into its own new empty directory. Never execute
        # an interpreter there, and never import or execute downloaded content.
        with tempfile.TemporaryDirectory(prefix=f".download-{directory}-", dir=SOURCES) as temp:
            staging = Path(temp)
            base = dataset["repository"].replace("github.com", "raw.githubusercontent.com")
            for filename in missing:
                upstream, checksum = dataset["files"][filename]
                url = f"{base}/{dataset['commit']}/{upstream}"
                subprocess.run(
                    ["curl", "--fail", "--silent", "--show-error", "--location",
                     "--retry", "2", "--proto", "=https", "--proto-redir", "=https",
                     url, "--output", str(staging / filename)],
                    cwd=ROOT, check=True,
                )
                verify(staging / filename, checksum)
            target.mkdir(parents=True, exist_ok=True)
            for filename in missing:
                shutil.copyfile(staging / filename, target / filename)


def round_coordinates(coordinates):
    if isinstance(coordinates[0], (int, float)):
        return [round(value, 4) for value in coordinates]
    return [round_coordinates(part) for part in coordinates]


def positions(coordinates):
    if isinstance(coordinates[0], (int, float)):
        yield coordinates
    else:
        for part in coordinates:
            yield from positions(part)


def validate_geometry(geometry):
    if geometry["type"] not in ("Polygon", "MultiPolygon"):
        raise ValueError(f"Unexpected geometry: {geometry['type']}")
    coordinates = geometry["coordinates"]
    for lon, lat in positions(coordinates):
        if not (math.isfinite(lon) and math.isfinite(lat)
                and -180 <= lon <= 180 and -90 <= lat <= 90):
            raise ValueError(f"Invalid geographic position: {[lon, lat]}")
    polygons = coordinates if geometry["type"] == "MultiPolygon" else [coordinates]
    for polygon in polygons:
        for ring in polygon:
            if len(ring) < 4 or ring[0] != ring[-1]:
                raise ValueError("Invalid or unclosed linear ring")
            if len({tuple(point) for point in ring}) < 3:
                raise ValueError("Coordinate rounding collapsed a ring")


def rounded(feature):
    result = copy.deepcopy(feature)
    validate_geometry(result["geometry"])
    result["geometry"]["coordinates"] = round_coordinates(result["geometry"]["coordinates"])
    validate_geometry(result["geometry"])
    return result


def collection(dataset, features, name, historical=False):
    result = {
        "type": "FeatureCollection", "name": name,
        "sourceId": dataset["sourceId"],
        "sourceCommit": dataset["commit"], "license": dataset["license"],
        "attribution": (
            "Historical basemaps — André Ourednik and contributors; modified overview subset"
            if historical else "Made with Natural Earth"
        ),
        "sourceDocumentation": "../SOURCES.md",
        "features": features,
    }
    if historical:
        result["representativeYear"] = 800
        result["scopeNote"] = "大陆尺度历史示意；非县级精确边界，非整个唐代各年代疆域或最大疆域。"
    return result


def encode(data):
    return (json.dumps(data, ensure_ascii=False, separators=(",", ":"), allow_nan=False) + "\n").encode()


def build():
    land_source = json.loads((SOURCES / "natural-earth/ne_110m_land.geojson").read_text())
    history_source = json.loads((SOURCES / "historical-basemaps/world_800.geojson").read_text())
    if land_source["type"] != "FeatureCollection" or history_source["type"] != "FeatureCollection":
        raise ValueError("Expected source FeatureCollections")
    land = [rounded(feature) for feature in land_source["features"]]
    selected = []
    for upstream_name, (identifier, display_name) in SELECTION.items():
        matches = [f for f in history_source["features"] if f["properties"].get("NAME") == upstream_name]
        if len(matches) != 1:
            raise ValueError(f"Expected exactly one {upstream_name}, found {len(matches)}")
        feature = rounded(matches[0])
        feature["id"] = identifier
        feature["properties"].update({
            "displayName": display_name,
            "sourceId": DATASETS["historical-basemaps"]["sourceId"],
            "representativeYear": 800,
        })
        selected.append(feature)
    tang = [f for f in selected if f["id"] == "tang-800"]
    if tang[0]["geometry"]["type"] != "MultiPolygon":
        raise ValueError("Expected original Tang MultiPolygon")
    datasets = {
        "land.geojson": collection(DATASETS["natural-earth"], land, "Natural Earth 1:110m land"),
        "east-asia-800.geojson": collection(DATASETS["historical-basemaps"], selected, "East Asia overview, 800 CE", True),
        "tang-800.geojson": collection(DATASETS["historical-basemaps"], tang, "Tang overview, 800 CE", True),
    }
    encoded = {name: encode(data) for name, data in datasets.items()}
    if sum(map(len, encoded.values())) >= LIMIT:
        raise ValueError("Generated data exceeds the combined 5 MB budget")
    OUTPUT.mkdir(parents=True, exist_ok=True)
    # Ship the transformation source alongside the original licensed datasets.
    (SOURCES / "build.py").write_bytes(Path(__file__).read_bytes())
    for name, content in encoded.items():
        (OUTPUT / name).write_bytes(content)
        print(f"{name}: {len(datasets[name]['features'])} features, {len(content)} bytes, sha256 {hashlib.sha256(content).hexdigest()}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--download", action="store_true", help="Fetch missing pinned source files with curl and verify SHA-256")
    args = parser.parse_args()
    acquire(args.download)
    build()


if __name__ == "__main__":
    main()
