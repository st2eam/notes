#!/usr/bin/env python3
"""Build modern reference maps from checksum-pinned originals (Python stdlib only).

    python3 -I scripts/geo/build-modern.py --download  # fetch and regenerate
    python3 -I scripts/geo/build-modern.py             # regenerate offline

Downloaded sources are data: never execute them or import from their directories.
"""
import argparse
import copy
import hashlib
import json
import math
from pathlib import Path
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "public/geo/sources/modern"
OUTPUT = ROOT / "public/geo/v1"
CATALOG = ROOT / ".vitepress/vault/geo-modern-catalog.mjs"
GB_COMMIT = "8ce2700661a28ee944350e2b329bbabb58d2ff83"
NE_COMMIT = "ca96624a56bd078437bca8184e78163e5039ad19"
GB_REPO = "https://github.com/wmgeolab/geoBoundaries"
NE_REPO = "https://github.com/nvkelso/natural-earth-vector"
GB_MEDIA = f"https://media.githubusercontent.com/media/wmgeolab/geoBoundaries/{GB_COMMIT}/releaseData/gbOpen/CHN/ADM1/"
NE_RAW = f"https://raw.githubusercontent.com/nvkelso/natural-earth-vector/{NE_COMMIT}/"
# Each stored original is byte-for-byte upstream content. The HTML documentation
# has a .txt suffix so the archived page cannot execute scripts when served.
FILES = {
    "geoBoundaries-CHN-ADM1.geojson": (
        GB_MEDIA + "geoBoundaries-CHN-ADM1.geojson",
        "3a00467a0db9b4136facb5f2f3d0edbfd96adb15651cfdf63991da9281030e85"),
    "geoBoundaries-CHN-ADM1-metaData.json": (
        GB_MEDIA + "geoBoundaries-CHN-ADM1-metaData.json",
        "b14151296df758f83bc66706929db37eb2114a439b6f0a1e5c9608732d840136"),
    "geoBoundaries-LICENSE.txt": (
        f"https://raw.githubusercontent.com/wmgeolab/geoBoundaries/{GB_COMMIT}/LICENSE",
        "c6e6f4f2cc8aa4fe74aa536570af16f0ffafd56c5878822043b4851fb858d1d1"),
    "ne_110m_admin_0_countries.geojson": (
        NE_RAW + "geojson/ne_110m_admin_0_countries.geojson",
        "6866c877d39cba9c357620878839b336d569f8c662d3cfab4cb1dbe2d39c977f"),
    "ne_110m_admin_0_countries.VERSION.txt": (
        NE_RAW + "110m_cultural/ne_110m_admin_0_countries.VERSION.txt",
        "f9893302cd3158f3b5aea394dcd2a91574869e9e6ff69e9235b10a3bf8c983fb"),
    "ne_110m_admin_0_countries.source.html.txt": (
        NE_RAW + "110m_cultural/ne_110m_admin_0_countries.README.html",
        "505ed31e9d9704a90818095b534465fac7dbb93e4f56a7727d36f4d4f27ecf74"),
    "natural-earth-LICENSE.md": (
        NE_RAW + "LICENSE.md",
        "2631b5b39b6d1acc56de75235109b5af2dbb4b0ac5a127b6f06185977247fd4b"),
}
CHINA_NAMES = {
    "Hainan Province": "海南省",
    "Taiwan Province": "台湾省",
    "Guangxi Zhuang Autonomous Region": "广西壮族自治区",
    "Fujian Province": "福建省",
    "Yunnan Province": "云南省",
    "Guizhou Province": "贵州省",
    "Jiangxi Province": "江西省",
    "Hunan Province": "湖南省",
    "Zhejiang Province": "浙江省",
    "Shanghai Municipality": "上海市",
    "Chongqing Municipality": "重庆市",
    "Hubei Province": "湖北省",
    "Sichuan Province": "四川省",
    "Anhui Province": "安徽省",
    "Jiangsu Province": "江苏省",
    "Henan Province": "河南省",
    "Tibet Autonomous Region": "西藏自治区",
    "Shandong Province": "山东省",
    "Qinghai Province": "青海省",
    "Ningxia Ningxia Hui Autonomous Region": "宁夏回族自治区",
    "Shaanxi Province": "陕西省",
    "Tianjin Municipality": "天津市",
    "Shanxi Province": "山西省",
    "Beijing Municipality": "北京市",
    "Gansu Province": "甘肃省",
    "Hebei Province": "河北省",
    "Liaoning Province": "辽宁省",
    "Jilin Province": "吉林省",
    "Xinjiang Uyghur Autonomous Region": "新疆维吾尔自治区",
    "Inner Mongolia Autonomous Region": "内蒙古自治区",
    "Heilongjiang Province": "黑龙江省",
    "Macau Special Administrative Region": "澳门特别行政区",
    "Hong Kong Special Administrative Region": "香港特别行政区",
    "Guangzhou Province": "广东省",
}
# Independent geographic checks for the questionable upstream label. Longitude,
# latitude are city reference points, not new administrative boundary evidence.
GUANGDONG_INSIDE = {
    "广州": (113.2644, 23.1291), "深圳": (114.0579, 22.5431),
    "韶关": (113.5975, 24.8104), "湛江": (110.3594, 21.2707),
    "梅州": (116.1222, 24.2886),
}
GUANGDONG_OUTSIDE = {"南宁": (108.3669, 22.8170), "长沙": (112.9388, 28.2282)}


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def encode(value):
    return (json.dumps(value, ensure_ascii=False, separators=(",", ":"),
                       allow_nan=False) + "\n").encode("utf-8")


def verified(name, content):
    if sha256(content) != FILES[name][1]:
        raise ValueError(f"Pinned SHA-256 mismatch: {name}")
    return content


def acquire():
    originals = {}
    for name, (url, _) in FILES.items():
        # A NEW empty directory for each individual download; curl's working
        # directory and this script always stay outside the downloaded files.
        with tempfile.TemporaryDirectory(prefix="notes-modern-source-") as directory:
            destination = Path(directory) / name
            subprocess.run([
                "curl", "--fail", "--silent", "--show-error", "--location",
                "--retry", "2", "--proto", "=https", "--proto-redir", "=https",
                url, "--output", str(destination),
            ], check=True, cwd=ROOT)
            originals[name] = verified(name, destination.read_bytes())
    SOURCE.mkdir(parents=True, exist_ok=True)
    for name, content in originals.items():
        (SOURCE / name).write_bytes(content)


def validate_geometry(geometry):
    kind = geometry["type"]
    if kind not in ("Polygon", "MultiPolygon"):
        raise ValueError(f"Unsupported geometry: {kind}")
    polygons = [geometry["coordinates"]] if kind == "Polygon" else geometry["coordinates"]
    if not polygons:
        raise ValueError("Empty geometry")
    for polygon in polygons:
        if not polygon:
            raise ValueError("Empty polygon")
        for ring in polygon:
            if len(ring) < 4 or ring[0] != ring[-1]:
                raise ValueError("Invalid or unclosed polygon ring")
            for position in ring:
                if len(position) != 2 or not all(
                    isinstance(n, (float, int)) and not isinstance(n, bool) and math.isfinite(n)
                    for n in position
                ):
                    raise ValueError("Expected finite longitude/latitude positions")
                if not (-180 <= position[0] <= 180 and -90 <= position[1] <= 90):
                    raise ValueError("Coordinates outside WGS84 bounds")


def ring_contains(point, ring):
    x, y = point
    inside = False
    for a, b in zip(ring, ring[1:]):
        if ((a[1] > y) != (b[1] > y)
                and x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]):
            inside = not inside
    return inside


def contains(geometry, point):
    polygons = ([geometry["coordinates"]] if geometry["type"] == "Polygon"
                else geometry["coordinates"])
    return any(ring_contains(point, polygon[0])
               and not any(ring_contains(point, ring) for ring in polygon[1:])
               for polygon in polygons)


def verify_guangdong(features):
    matches = [f for f in features if f["properties"]["shapeName"] == "Guangzhou Province"]
    if len(matches) != 1 or matches[0]["properties"]["shapeID"] != "43563684B38891657012300":
        raise ValueError("Unexpected upstream Guangzhou Province feature")
    geometry = matches[0]["geometry"]
    if not all(contains(geometry, p) for p in GUANGDONG_INSIDE.values()):
        raise ValueError("Guangzhou Province does not cover Guangdong reference cities")
    if any(contains(geometry, p) for p in GUANGDONG_OUTSIDE.values()):
        raise ValueError("Guangzhou Province covers a reference city outside Guangdong")
    polygons = [geometry["coordinates"]] if geometry["type"] == "Polygon" else geometry["coordinates"]
    points = [p for polygon in polygons for ring in polygon for p in ring]
    bounds = [min(p[0] for p in points), min(p[1] for p in points),
              max(p[0] for p in points), max(p[1] for p in points)]
    if not (109 < bounds[0] < 110 and 20 < bounds[1] < 21
            and 117 < bounds[2] < 118 and 25 < bounds[3] < 26):
        raise ValueError("Guangzhou Province bounding box is inconsistent with Guangdong")
    return {"shapeID": matches[0]["properties"]["shapeID"],
            "originalName": "Guangzhou Province", "displayName": "广东省",
            "bbox": bounds, "containedReferenceCities": GUANGDONG_INSIDE,
            "excludedReferenceCities": GUANGDONG_OUTSIDE}


def collection(original, identifier, commit, source_license, license_name, **metadata):
    if original["type"] != "FeatureCollection":
        raise ValueError("Expected a FeatureCollection")
    result = copy.deepcopy(original)
    result.update(name=identifier, modern=True, sourceCommit=commit,
                  sourceLicense=source_license, license=license_name,
                  sourceDocumentation="../sources/modern/SOURCES.md", **metadata)
    return result


def build():
    originals = {name: verified(name, (SOURCE / name).read_bytes()) for name in FILES}
    gb_metadata = json.loads(originals["geoBoundaries-CHN-ADM1-metaData.json"])
    if (gb_metadata["boundaryYear"] != "2019"
            or gb_metadata["boundaryLicense"] != "Public Domain"
            or gb_metadata["admUnitCount"] != "34"):
        raise ValueError("Unexpected geoBoundaries metadata")
    edition = originals["ne_110m_admin_0_countries.VERSION.txt"].decode().strip()
    if edition != "5.1.1":
        raise ValueError("Unexpected Natural Earth edition")
    china = collection(json.loads(originals["geoBoundaries-CHN-ADM1.geojson"]),
                       "modern-china-2019", GB_COMMIT, "Public Domain", "CC-BY-4.0",
                       dataYear=2019, projectLicense="CC-BY-4.0",
                       sourceId="geoboundaries-chn-adm1", sourceSHA256=FILES["geoBoundaries-CHN-ADM1.geojson"][1],
                       attribution="geoBoundaries / William & Mary geoLab; source: Wikimedia Commons; Chinese display names added")
    world = collection(json.loads(originals["ne_110m_admin_0_countries.geojson"]),
                       "modern-world", NE_COMMIT, "Public Domain", "Public Domain",
                       edition=edition, sourceId="natural-earth-110m-admin-0",
                       sourceSHA256=FILES["ne_110m_admin_0_countries.geojson"][1],
                       attribution="Made with Natural Earth; displayName copied from NAME_ZH")
    if len(china["features"]) != 34 or len(world["features"]) != 177:
        raise ValueError("Unexpected modern feature counts")
    for data in (china, world):
        for feature in data["features"]:
            if feature["type"] != "Feature":
                raise ValueError("Expected a GeoJSON Feature")
            validate_geometry(feature["geometry"])
    audit = verify_guangdong(china["features"])
    if {f["properties"]["shapeName"] for f in china["features"]} != set(CHINA_NAMES):
        raise ValueError("Unexpected Chinese administrative names")
    for feature in china["features"]:
        props = feature["properties"]
        feature["id"] = "gb-chn-adm1-" + props["shapeID"]
        props["displayName"] = CHINA_NAMES[props["shapeName"]]
    for feature in world["features"]:
        props = feature["properties"]
        if not props.get("NAME_ZH") or not props.get("NE_ID"):
            raise ValueError("Missing Natural Earth Chinese label or unique identifier")
        feature["id"] = "ne-admin0-" + str(props["NE_ID"])
        props["displayName"] = props["NAME_ZH"]
    for data in (china, world):
        if len({f["id"] for f in data["features"]}) != len(data["features"]):
            raise ValueError("Duplicate modern map feature IDs")
    entries = [
        {"id": "modern-china-2019", "modern": True, "scope": "china", "period": "现代",
         "year": 2019, "dataYear": 2019, "from": 1949, "to": 100000,
         "name": "现代中国省级区划参照 · 2019 年",
         "geometry": "/geo/v1/modern-china-2019.geojson",
         "source": {"title": "geoBoundaries · CHN ADM1 · 2019 年",
                    "url": GB_REPO + "/tree/" + GB_COMMIT + "/releaseData/gbOpen/CHN/ADM1"},
         "accuracy": "2019 年现代省级区划参照，非历史疆域复原；用于 1949 年及以后事件定位，不表示 1949 年或事件当年的行政区划、实际控制线。保留 geoBoundaries 来源的 34 单元收录口径。"},
        {"id": "modern-world", "modern": True, "scope": "world", "period": "现代",
         "edition": edition, "from": 1949, "to": 100000,
         "name": "现代世界国家与地区参照 · Natural Earth " + edition,
         "geometry": "/geo/v1/modern-world.geojson",
         "source": {"title": "Natural Earth · 1:110m Admin 0 Countries · " + edition,
                    "url": NE_REPO + "/blob/" + NE_COMMIT + "/geojson/ne_110m_admin_0_countries.geojson"},
         "accuracy": "Natural Earth " + edition + " 版现代世界参照，非历史疆域复原；采用来源默认 de facto（实际控制）口径与 1:110m 概化，不表示 1949 年或事件当年的国界，也不具有统一边界年份。与中国省级图的来源口径不同。"},
    ]
    generated = {OUTPUT / "modern-china-2019.geojson": encode(china),
                 OUTPUT / "modern-world.geojson": encode(world),
                 CATALOG: ("// Generated by scripts/geo/build-modern.py; modern reference maps, not historical reconstructions.\n"
                           "export const modernMaps = " + json.dumps(entries, ensure_ascii=False, indent=2) + ";\n").encode()}
    manifest = {
        "schemaVersion": 1,
        "generator": "scripts/geo/build-modern.py",
        "sources": [{"file": name, "url": url, "sha256": checksum}
                    for name, (url, checksum) in FILES.items()],
        "china": {"sourceCommit": GB_COMMIT, "dataYear": 2019, "featureCount": 34,
                  "sourceLicense": "Public Domain", "projectLicense": "CC-BY-4.0",
                  "featureId": "gb-chn-adm1-{shapeID}", "labelAudit": audit},
        "world": {"sourceCommit": NE_COMMIT, "edition": edition, "featureCount": 177,
                  "license": "Public Domain", "featureId": "ne-admin0-{NE_ID}",
                  "boundaryConvention": "Natural Earth default de facto; no uniform boundary year"},
        "outputs": [{"file": str(path.relative_to(ROOT)), "sha256": sha256(content), "bytes": len(content)}
                    for path, content in generated.items()],
    }
    generated[SOURCE / "metadata.json"] = encode(manifest)
    for path, content in generated.items():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(content)
    for record in manifest["outputs"]:
        print(f"{record['sha256']}  {record['file']}  ({record['bytes']} bytes)")
    print("Validated 34 Chinese units, 177 world features, unique IDs, finite WGS84 closed rings and Guangdong label geometry.")


def main():
    if not sys.flags.isolated:
        raise SystemExit("Run with isolated Python: python3 -I scripts/geo/build-modern.py [--download]")
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--download", action="store_true", help="Fetch checksum-pinned originals using TLS curl")
    args = parser.parse_args()
    if args.download:
        acquire()
    build()


if __name__ == "__main__":
    main()
