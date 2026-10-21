"""Run local schema, project billing safeguards and unmodified AWS Guard rules."""
import argparse
import collections
import hashlib
import json
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[1]
INFRA = ROOT / "infra"
PINNED_REGISTRY = "7f7340c26ae5d5e8874651dbffeb12e0e9f505b6"

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--registry", required=True, type=Path)
parser.add_argument("--output", required=True, type=Path)
args = parser.parse_args()


def run_json(command):
    result = subprocess.run(command, capture_output=True, text=True)
    if result.stderr:
        raise RuntimeError(result.stderr)
    return result.returncode, json.loads(result.stdout)


commit = subprocess.check_output(
    ["git", "-C", str(args.registry), "rev-parse", "HEAD"], text=True,
).strip()
if commit != PINNED_REGISTRY:
    raise SystemExit(f"Expected official registry commit {PINNED_REGISTRY}; got {commit}")

guard = str(INFRA / ".venv/bin/cfn-guard")
lint = str(INFRA / ".venv/bin/cfn-lint")
records = []
gate_passed = True
for name, region in [("website.yaml", "ap-southeast-1"), ("edge-free.yaml", "us-east-1")]:
    template = INFRA / name
    lint_code, findings = run_json([lint, "--format", "json", "--regions", region, "--template", str(template)])
    guard_args = ["--data", str(template), "--output-format", "json", "--structured", "--show-summary", "none"]
    project_code, project = run_json([guard, "validate", "--rules", str(INFRA / "free-plan.guard"), *guard_args])
    gate_passed = gate_passed and lint_code == 0 and project_code == 0
    official = []
    for directory in ["amazon_s3", "cloudfront"]:
        for rule in sorted((args.registry / "rules/aws" / directory).glob("*.guard")):
            code, results = run_json([guard, "validate", "--rules", str(rule), *guard_args])
            if code not in {0, 19}:
                raise RuntimeError(f"Unexpected Guard execution failure {code}: {rule}")
            official.append({
                "rule": str(rule.relative_to(args.registry / "rules/aws")),
                "sha256": hashlib.sha256(rule.read_bytes()).hexdigest(),
                "exitCode": code,
                "statuses": [r["status"] for r in results],
                "failedRules": [f["Rule"]["name"] for r in results for f in r.get("not_compliant", []) if "Rule" in f],
            })
    counts = dict(collections.Counter(status for r in official for status in r["statuses"]))
    records.append({"template": name, "region": region,
                    "sha256": hashlib.sha256(template.read_bytes()).hexdigest(),
                    "cfnLintFindings": findings, "projectGuard": project,
                    "officialCounts": counts, "officialRules": official})
    print(json.dumps({"template": name, "schemaFindings": len(findings),
                      "projectGuard": [r["status"] for r in project], "officialGuard": counts}))

report = {
    "scheme": "CloudFront FREE fixed plan; two regions; disabled by default",
    "cfnLintVersion": subprocess.check_output([lint, "--version"], text=True).strip(),
    "cfnGuardVersion": subprocess.check_output([guard, "--version"], text=True).strip(),
    "registryCommit": commit, "templates": records, "localGatePassed": gate_passed,
    "officialAllPassed": all(r["officialCounts"].get("FAIL", 0) == 0 for r in records),
    "cloudResourcesCreated": False, "runtimeActivationVerified": False,
}
args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
print("Local gate checks schema and project safeguards; official exceptions remain separately reported.")
raise SystemExit(0 if gate_passed else 1)
