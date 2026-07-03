#!/usr/bin/env python3
"""Generate CSS variables from a simple token JSON or starter preset.

Input JSON shape can be nested dictionaries with string/number leaves:
{
  "primitive": {"color": {"ink-950": "#11100d"}},
  "semantic": {"color": {"background": "var(--color-ink-950)"}},
  "component": {"button": {"bg": "var(--color-primary)"}}
}

Usage:
  python scripts/generate_tokens.py --starter
  python scripts/generate_tokens.py tokens.json -o tokens.css
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

STARTER = {
    "primitive": {
        "color": {
            "ink-950": "#11100d",
            "paper-50": "#faf7ef",
            "amber-500": "#f2a900",
            "red-600": "#dc2626",
            "green-600": "#16a34a",
        },
        "space": {"1": "0.25rem", "2": "0.5rem", "4": "1rem", "6": "1.5rem", "8": "2rem"},
        "radius": {"sm": "0.25rem", "md": "0.5rem", "lg": "0.75rem"},
        "duration": {"fast": "150ms", "normal": "250ms", "slow": "450ms"},
    },
    "semantic": {
        "color": {
            "background": "var(--color-paper-50)",
            "foreground": "var(--color-ink-950)",
            "primary": "var(--color-amber-500)",
            "danger": "var(--color-red-600)",
            "success": "var(--color-green-600)",
            "focus": "var(--color-amber-500)",
        },
        "space": {"component": "var(--space-4)", "section": "var(--space-8)"},
    },
    "component": {
        "button": {"bg": "var(--color-primary)", "fg": "var(--color-foreground)", "radius": "var(--radius-md)", "duration": "var(--duration-fast)"},
        "input": {"border": "color-mix(in srgb, var(--color-foreground) 24%, transparent)", "focus": "var(--color-focus)", "radius": "var(--radius-md)"},
        "card": {"bg": "var(--color-background)", "padding": "var(--space-component)", "radius": "var(--radius-lg)"},
    },
}


def flatten(prefix: list[str], value: Any) -> list[tuple[str, str]]:
    if isinstance(value, dict):
        items: list[tuple[str, str]] = []
        for key, child in value.items():
            items.extend(flatten(prefix + [str(key)], child))
        return items
    name = "--" + "-".join(part.replace("_", "-") for part in prefix)
    return [(name, str(value))]


def css(tokens: dict[str, Any]) -> str:
    sections = []
    for section in ["primitive", "semantic", "component"]:
        if section not in tokens:
            continue
        lines = [f"  /* {section.upper()} */"]
        for name, value in flatten([], tokens[section]):
            lines.append(f"  {name}: {value};")
        sections.extend(lines)
        sections.append("")
    return ":root {\n" + "\n".join(sections).rstrip() + "\n}\n"


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate design token CSS")
    parser.add_argument("file", nargs="?", help="Token JSON file")
    parser.add_argument("--starter", action="store_true", help="Use built-in starter tokens")
    parser.add_argument("-o", "--output", help="Output CSS file")
    args = parser.parse_args()
    if args.starter:
        data = STARTER
    elif args.file:
        data = json.loads(Path(args.file).read_text(encoding="utf-8"))
    else:
        parser.error("provide a token JSON file or --starter")
    result = css(data)
    if args.output:
        Path(args.output).write_text(result, encoding="utf-8")
    else:
        print(result, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
