#!/usr/bin/env python3
"""Interactive helper to scaffold a new component capsule.

Run from the repository root:

    python scripts/new_component.py

The script prompts for a component name and creates the basic files under
``src/<Name>/``:
  - `<Name>.jsx`
  - `<Name>.module.css`
  - `index.js`

After filling in the component implementation, run
``python scripts/generate_export.py`` to update exports and scaffold the
Storybook story.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

SRC_DIR = Path(__file__).resolve().parent.parent / "src"

INDEX_TEMPLATE = "export {{ default }} from './{name}.jsx';\n"

COMPONENT_TEMPLATE = """import React from 'react';
import './{name}.module.css';

export default function {name}() {{}}
"""

CSS_TEMPLATE = "/* Styles for {name} */"


def prompt_name() -> str:
    while True:
        name = input("Component name (PascalCase): ").strip()
        if not re.match(r"^[A-Z][A-Za-z0-9_]*$", name):
            print("Invalid name. Use PascalCase like 'MyComponent'.")
            continue
        if (SRC_DIR / name).exists():
            print(f"'{name}' already exists. Choose a different name.")
            continue
        return name


def write_if_missing(path: Path, content: str) -> None:
    if path.exists():
        print(f"  exists {path.relative_to(Path.cwd())}")
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    print(f"  created {path.relative_to(Path.cwd())}")


def main() -> None:
    if not SRC_DIR.exists():
        sys.exit(f"❌  SRC_DIR '{SRC_DIR}' not found.")

    name = prompt_name()
    capsule = SRC_DIR / name

    write_if_missing(capsule / "index.js", INDEX_TEMPLATE.format(name=name))
    write_if_missing(capsule / f"{name}.jsx", COMPONENT_TEMPLATE.format(name=name))
    write_if_missing(capsule / f"{name}.module.css", CSS_TEMPLATE.format(name=name))

    print("\nComponent scaffold complete. Now run:")
    print("  python scripts/generate_export.py")


if __name__ == "__main__":
    main()
