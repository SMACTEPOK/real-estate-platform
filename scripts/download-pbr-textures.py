import json
import re
import time
import urllib.request
from pathlib import Path

BASE = "https://api.polyhaven.com"
ROOT = Path("public/textures")
UA = "RealEstatePlatform-PBR/1.0 (local asset downloader)"

MATERIALS = {
    "wood_floor": ["wood floor", "wooden floor", "parquet", "floorboards"],
    "concrete": ["concrete floor", "concrete"],
    "marble": ["marble"],
    "tiles": ["floor tiles", "ceramic tile", "tiles"],
    "plaster": ["plaster wall", "plaster"],
    "brick": ["brick wall", "brick"],
    "stone": ["stone wall", "stone"],
    "wallpaper": ["wallpaper"],
    "fabric": ["fabric", "upholstery"],
    "leather": ["leather"],
}

def get_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=45) as response:
        return json.loads(response.read())

def flatten_files(node, path=()):
    if isinstance(node, dict):
        if isinstance(node.get("url"), str):
            yield path, node
        else:
            for key, value in node.items():
                yield from flatten_files(value, path + (str(key),))
    elif isinstance(node, list):
        for index, value in enumerate(node):
            yield from flatten_files(value, path + (str(index),))

def map_kind(path, url):
    text = " ".join(path).lower() + " " + url.lower()
    rules = {
        "color": ["diffuse", "albedo", "basecolor", "base_color", "color"],
        "normal": ["nor_gl", "normalgl", "normal_dx", "normal"],
        "roughness": ["rough"],
        "ao": ["ao", "ambientocclusion", "ambient_occlusion"],
        "height": ["disp", "displacement", "height", "bump"],
        "metalness": ["metal"],
    }
    for kind, terms in rules.items():
        if any(term in text for term in terms):
            return kind
    return None

def score_asset(asset_id, info, terms):
    text = " ".join([
        asset_id.replace("_", " "),
        info.get("name", ""),
        info.get("description", ""),
        info.get("category", ""),
        " ".join(info.get("tags", [])),
    ]).lower()
    score = 0
    for term in terms:
        if term in text:
            score += 10 + len(term.split())
    if info.get("type") != 1:
        return 0
    if info.get("max_resolution", [0])[0] < 2048:
        return 0
    return score

def download(url, target):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=90) as response:
        data = response.read()
    target.write_bytes(data)
    if len(data) < 1000:
        target.unlink(missing_ok=True)
        raise RuntimeError("Downloaded file is unexpectedly small")

print("Отримую каталог Poly Haven...")
catalog = get_json(BASE + "/assets?type=textures")
manifest = {}

for material, terms in MATERIALS.items():
    candidates = [
        (score_asset(asset_id, info, terms), asset_id, info)
        for asset_id, info in catalog.items()
    ]
    candidates = [item for item in candidates if item[0] > 0]
    candidates.sort(key=lambda item: item[0], reverse=True)

    if not candidates:
        print(f"[SKIP] {material}: відповідний матеріал не знайдено")
        continue

    score, asset_id, info = candidates[0]
    print(f"\n[{material}] {info.get('name', asset_id)} ({asset_id})")

    try:
        files = get_json(f"{BASE}/files/{asset_id}")
        available = {}

        for path, entry in flatten_files(files):
            joined = " ".join(path).lower()
            if "2k" not in joined and not re.search(r"_2k[._]", entry["url"].lower()):
                continue

            kind = map_kind(path, entry["url"])
            if not kind or kind in available:
                continue

            available[kind] = entry["url"]

        if "color" not in available or "normal" not in available:
            print(f"[SKIP] Не знайдено Color + Normal у 2K для {asset_id}")
            continue

        folder = ROOT / material
        folder.mkdir(parents=True, exist_ok=True)
        downloaded = {}

        for kind, url in available.items():
            ext = Path(url.split("?")[0]).suffix or ".jpg"
            target = folder / f"{kind}{ext}"
            try:
                download(url, target)
                downloaded[kind] = "/" + str(target).replace("\\", "/").replace("public/", "")
                print(f"  + {kind}: {target.stat().st_size // 1024} KB")
            except Exception as error:
                print(f"  ! {kind}: {error}")

        if "color" in downloaded and "normal" in downloaded:
            manifest[material] = {
                "name": info.get("name", asset_id),
                "source": "Poly Haven",
                "assetId": asset_id,
                "license": "CC0",
                "maps": downloaded,
            }
        else:
            print(f"[WARN] Неповний набір карт для {material}")

    except Exception as error:
        print(f"[ERROR] {material}: {error}")

    time.sleep(0.2)

manifest_path = ROOT / "manifest.json"
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2))
print(f"\nМаніфест: {manifest_path}")
print(f"Завантажено матеріалів: {len(manifest)} із {len(MATERIALS)}")

if not manifest:
    raise SystemExit("Не вдалося завантажити жодного повного PBR-набору.")
