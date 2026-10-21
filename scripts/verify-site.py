"""Verify public release routes after CloudFront deployment."""
import argparse
import json
import urllib.error
import urllib.request
from urllib.parse import quote, urlsplit

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("url", help="HTTPS CloudFront base URL")
args = parser.parse_args()
base = args.url.rstrip("/")
parsed = urlsplit(base)
if parsed.scheme != "https" or not parsed.netloc or parsed.path or parsed.query or parsed.fragment:
    parser.error("Provide an HTTPS origin without a path, query or fragment")
checks = [
    ("/", 200, 'lang="zh-CN"', "bouyout"),
    ("/en/", 200, 'lang="en"', "bouyout"),
    ("/posts/", 200, 'lang="zh-CN"', "你好世界"),
    ("/en/posts/", 200, 'lang="en"', "Hello World"),
    ("/projects/chrome-extension", 200, 'lang="zh-CN"', "PixPage"),
    ("/en/projects/chrome-extension-en/", 200, 'lang="en"', "PixPage"),
    ("/posts/hello-world-my-first-blog/", 200, 'lang="zh-CN"', "你好世界"),
    ("/en/posts/hello-world-my-first-blog-en/", 200, 'lang="en"', "Hello World"),
    ("/tags/随笔/", 200, 'lang="zh-CN"', "随笔"),
    ("/not-a-real-page-deployment-check/", 404, None, "Page not found"),
    ("/projects/pelosi-trade/", 404, None, "Page not found"),
    ("/experiences/accountant/", 404, None, "Page not found"),
]
results = []
for path, expected, lang, marker in checks:
    try:
        response = urllib.request.urlopen(base + quote(path), timeout=30)
    except urllib.error.HTTPError as error:
        response = error
    body = response.read().decode("utf-8")
    ok = response.code == expected and marker in body and (lang is None or lang in body)
    headers = response.headers
    if expected == 200:
        ok = ok and headers.get("x-content-type-options") == "nosniff"
        ok = ok and headers.get("x-frame-options") == "SAMEORIGIN"
        ok = ok and "max-age=" in headers.get("strict-transport-security", "")
    results.append({"path": path, "status": response.code, "passed": ok})
print(json.dumps(results, ensure_ascii=False, indent=2))
raise SystemExit(0 if all(x["passed"] for x in results) else 1)
