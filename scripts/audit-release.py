"""Audit static release files and internal URLs without changing or deleting files."""
import argparse
import hashlib
import json
import mimetypes
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


class References(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []

    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key in {"href", "src", "component-url", "renderer-url"} and value:
                self.urls.append(value)


parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("directory", type=Path)
parser.add_argument("--manifest", type=Path)
args = parser.parse_args()
root = args.directory.resolve(strict=True)
excluded = {"techtim42.png", "techtim42.webp"}
files = sorted(p for p in root.rglob("*") if p.is_file() and p.relative_to(root).as_posix() not in excluded)
keys = {p.relative_to(root).as_posix() for p in files}
errors = []
for p in files:
    if p.suffix != ".html":
        continue
    page = References()
    page.feed(p.read_text())
    for url in page.urls:
        parsed = urlsplit(url)
        if parsed.scheme or parsed.netloc or not parsed.path:
            continue
        path = unquote(parsed.path)
        target = (root / path.lstrip("/") if path.startswith("/") else p.parent / path).resolve()
        if not target.is_relative_to(root):
            errors.append(f"{p.relative_to(root)}: URL escapes release: {url}")
            continue
        if target.is_dir():
            target = target / "index.html"
        elif not target.exists() and "." not in target.name:
            target = target / "index.html"
        if target.relative_to(root).as_posix() not in keys:
            errors.append(f"{p.relative_to(root)}: missing {url}")

required = ["index.html", "en/index.html", "posts/hello-world-my-first-blog/index.html",
            "en/posts/hello-world-my-first-blog-en/index.html", "projects/chrome-extension/index.html",
            "en/projects/chrome-extension-en/index.html", "404.html"]
errors += [f"Missing required page: {key}" for key in required if key not in keys]
for key in keys:
    if key.startswith(("posts/", "en/posts/", "projects/", "en/projects/")) and key.endswith(".html"):
        allowed = set(required) | {"posts/index.html", "en/posts/index.html", "projects/index.html", "en/projects/index.html"}
        if key not in allowed:
            errors.append(f"Unreviewed content page: {key}")
    if key.startswith(("books/", "experiences/")) and key.count("/") > 1:
        errors.append(f"Unreviewed template detail: {key}")

manifest = []
for p in files:
    key = p.relative_to(root).as_posix()
    content_type = mimetypes.guess_type(key)[0] or "application/octet-stream"
    if p.suffix == ".js":
        content_type = "application/javascript"
    if p.suffix in {".html", ".css", ".js", ".txt", ".svg"}:
        content_type += "; charset=utf-8"
    manifest.append({"key": key, "size": p.stat().st_size,
                     "sha256": hashlib.sha256(p.read_bytes()).hexdigest(),
                     "contentType": content_type,
                     "cacheControl": "public,max-age=31536000,immutable" if key.startswith("_astro/") else "public,max-age=300"})

result = {"directory": str(root), "pages": sum(p.suffix == ".html" for p in files),
          "objects": len(files), "bytes": sum(x["size"] for x in manifest),
          "excluded": sorted(excluded), "errors": errors}
if errors:
    print(json.dumps(result, ensure_ascii=False, indent=2))
    raise SystemExit(1)
if args.manifest:
    # Exclusive create: preserve every previous manifest.
    with args.manifest.open("x") as out:
        json.dump({**result, "files": manifest}, out, ensure_ascii=False, indent=2)
print(json.dumps(result, ensure_ascii=False, indent=2))
