#!/usr/bin/env python3
"""
An upgraded barrel‑generator that now also scaffolds each component “capsule” with:
  • <Capsule>/index.js              – re‑exports the component (tree‑shakable)
  • <Capsule>/<Capsule>.stories.jsx – minimal Storybook story (no default‑args blob)

Run from the repository root:

    python scripts/generate_export.py

Keeps existing files intact when their contents match the freshly generated text, so it is safe to run repeatedly (idempotent).
"""
from __future__ import annotations

import re
import sys
from pathlib import Path
from typing import Iterable

# ────────────────────────────────────────────────────────────────────────────────
# Config constants
# ────────────────────────────────────────────────────────────────────────────────

SRC_DIR: Path = Path(__file__).resolve().parent.parent / "src"
BARREL_FILE: Path = SRC_DIR / "index.js"
# Component folders placed under these directories will be ignored when
# generating exports. This allows archiving unused components without
# deleting their source.
IGNORE_DIRS: set[str] = {"archive"}

# Storybook story template — note the doubled curly‑braces to escape them in
# str.format(), _including_ those in the ES‑Module import statement.
STORY_TEMPLATE: str = """import {{ default as {name} }} from './{name}.jsx';

export default {{
  title: 'Components/{name}',
  component: {name},
  tags: ["autodocs"],
}};

export const Primary = {{ args: {{}} }};
"""

# index.js one‑liner inside each capsule folder
INDEX_TEMPLATE: str = "export {{ default }} from './{name}.jsx';\n"

# Matches existing barrel exports of the form:
#   export { default as Button } from './Button/Button.jsx';
EXPORT_PATTERN = re.compile(r"export\s+\{\s+default\s+as\s+(\w+)\s+}.*?;?")


def write_if_diff(path: Path, content: str) -> None:
    """Write *content* to *path* only if it has changed (idempotent)."""
    if path.exists() and path.read_text(encoding="utf-8") == content:
        return  # nothing to do
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    print(f"  ↺ Wrote {path.relative_to(Path.cwd())}")


def find_capsules(src_dir: Path) -> list[str]:
    """Return a sorted list of folder names that qualify as component capsules.

    Folders listed in ``IGNORE_DIRS`` are skipped so archived components don't
    appear in the public barrel file.
    """
    capsules: list[str] = []
    for child in src_dir.iterdir():
        if not child.is_dir():
            continue
        name = child.name
        if name in IGNORE_DIRS:
            continue
        if (child / f"{name}.jsx").exists() or (child / f"{name}.tsx").exists():
            capsules.append(name)
    return sorted(capsules, key=str.casefold)


def parse_existing_exports(barrel: Path) -> set[str]:
    if not barrel.exists():
        return set()
    return set(EXPORT_PATTERN.findall(barrel.read_text(encoding="utf-8")))


def update_barrel(capsules: Iterable[str]) -> None:
    existing = parse_existing_exports(BARREL_FILE)
    missing = [c for c in capsules if c not in existing]
    if not missing:
        print("Barrel file already up‑to‑date ✓")
        return
    lines = [f"export {{ default as {c} }} from './{c}/{c}.jsx';\n" for c in missing]
    BARREL_FILE.parent.mkdir(parents=True, exist_ok=True)
    with BARREL_FILE.open("a" if BARREL_FILE.exists() else "w", encoding="utf-8") as fh:
        fh.writelines(lines)
    print(f"Barrel updated – added: {', '.join(missing)}")


def scaffold_capsule(name: str) -> None:
    capsule_dir = SRC_DIR / name
    idx_file = capsule_dir / "index.js"
    story_file = capsule_dir / f"{name}.stories.jsx"

    # Only scaffold missing files; leave existing ones untouched
    if not idx_file.exists():
        write_if_diff(idx_file, INDEX_TEMPLATE.format(name=name))
    if not story_file.exists():
        write_if_diff(story_file, STORY_TEMPLATE.format(name=name))


def main() -> None:
    if not SRC_DIR.exists():
        sys.exit(f"❌ SRC_DIR '{SRC_DIR}' not found. Check configuration.")

    capsules = find_capsules(SRC_DIR)
    if not capsules:
        sys.exit("No component capsules detected in src/. Nothing to do.")

    print("\n── Generating barrel export file ──")
    update_barrel(capsules)

    print("\n── Scaffolding capsule files ──")
    for name in capsules:
        scaffold_capsule(name)

    print("\nAll done ✨  (idempotent – safe to run anytime)")


if __name__ == "__main__":
    main()
