#!/usr/bin/env python3
"""Extract portable brand context from markdown guidelines.

Usage:
  python scripts/extract_brand_context.py docs/brand-guidelines.md
  python scripts/extract_brand_context.py docs/brand-guidelines.md --json
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

SECTION_NAMES = ["voice", "tone", "personality", "messaging", "typography", "logo", "colors", "colour"]


def extract_sections(text: str) -> dict[str, str]:
    sections: dict[str, list[str]] = {}
    current = "overview"
    for line in text.splitlines():
        heading = re.match(r"^(#{1,4})\s+(.+)$", line)
        if heading:
            name = heading.group(2).strip().lower()
            current = name
        if any(key in current for key in SECTION_NAMES):
            sections.setdefault(current, []).append(line)
    return {key: "\n".join(value).strip() for key, value in sections.items() if value}


def extract_fonts(text: str) -> list[str]:
    patterns = [
        r"font(?:-family)?\s*[:=]\s*[`'\"]?([^`'\"\n;]+)",
        r"--font-[a-z-]+\s*:\s*['\"]?([^'\";]+)",
        r"\b(?:Inter|Roboto|Arial|Helvetica|Georgia|Times|Montserrat|Poppins|Lora|Merriweather|JetBrains Mono|IBM Plex [A-Za-z]+|Space Grotesk|Manrope|Outfit)\b",
    ]
    fonts: list[str] = []
    for pattern in patterns:
        for match in re.findall(pattern, text, flags=re.I):
            value = match.strip() if isinstance(match, str) else str(match).strip()
            if value and value not in fonts:
                fonts.append(value)
    return fonts[:12]


def extract(path: Path) -> dict[str, object]:
    text = path.read_text(encoding="utf-8")
    colors = sorted(set(re.findall(r"#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?\b", text)))
    sections = extract_sections(text)
    prohibited = re.findall(r"(?:avoid|forbidden|prohibited|never use)[:\s-]+([^\n]+)", text, flags=re.I)
    return {
        "source": str(path),
        "colors": colors,
        "fonts": extract_fonts(text),
        "sections": sections,
        "prohibited": [item.strip(" -*`'") for item in prohibited[:20]],
    }


def markdown(data: dict[str, object]) -> str:
    lines = ["# Brand Context", "", f"Source: `{data['source']}`", ""]
    colors = data.get("colors") or []
    fonts = data.get("fonts") or []
    prohibited = data.get("prohibited") or []
    if colors:
        lines += ["## Colors", "", ", ".join(f"`{c}`" for c in colors), ""]
    if fonts:
        lines += ["## Typography", "", ", ".join(f"`{f}`" for f in fonts), ""]
    if prohibited:
        lines += ["## Avoid", ""] + [f"- {item}" for item in prohibited] + [""]
    sections = data.get("sections") or {}
    if isinstance(sections, dict) and sections:
        lines.append("## Relevant Sections")
        lines.append("")
        for name, content in sections.items():
            excerpt = re.sub(r"\s+", " ", str(content)).strip()
            if len(excerpt) > 500:
                excerpt = excerpt[:497] + "..."
            lines.append(f"### {name}")
            lines.append(excerpt)
            lines.append("")
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="Extract brand context")
    parser.add_argument("file", help="Markdown brand guideline file")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    data = extract(Path(args.file))
    if args.json:
        print(json.dumps(data, indent=2, ensure_ascii=False))
    else:
        print(markdown(data))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
