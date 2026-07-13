#!/usr/bin/env python3
"""Heuristic frontend design validator.

Scans text frontend files for common design/accessibility issues. It is intentionally
framework-light and should be treated as a review aid, not a compiler.

Usage:
  python scripts/validate_frontend_design.py src
  python scripts/validate_frontend_design.py index.html Component.svelte
"""

from __future__ import annotations

import argparse
import re
from pathlib import Path

EXTS = {".html", ".css", ".scss", ".sass", ".js", ".jsx", ".ts", ".tsx", ".svelte", ".vue", ".astro"}
SKIP_DIRS = {"node_modules", ".git", "dist", "build", ".svelte-kit", ".next", "coverage"}

CHECKS = [
    ("raw-hex", re.compile(r"#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?\b"), "Raw hex color found; prefer existing tokens/variables for repeated semantic values."),
    ("important", re.compile(r"!important\b"), "!important found; check cascade/token/component boundary."),
    ("outline-none", re.compile(r"outline\s*:\s*none|outline-none"), "Focus outline removed; ensure visible focus replacement."),
    ("fixed-px-width", re.compile(r"width\s*:\s*\d{3,}px|min-width\s*:\s*\d{3,}px"), "Large fixed width may break responsive layout."),
    ("placeholder", re.compile(r"placeholder\s*=|::placeholder"), "Placeholder usage found; verify a visible/persistent label exists."),
    ("img-alt", re.compile(r"<img\b(?![^>]*\balt=)", re.I), "Image without alt attribute."),
    ("button-type", re.compile(r"<button\b(?![^>]*\btype=)", re.I), "Button without explicit type; forms may submit accidentally."),
]

GLOBAL_CHECKS = [
    ("reduced-motion", "prefers-reduced-motion", "No reduced-motion handling found in scanned files."),
    ("focus-visible", "focus-visible", "No focus-visible styling found in scanned files."),
]


def files(paths: list[str]) -> list[Path]:
    result: list[Path] = []
    for raw in paths:
        path = Path(raw)
        if path.is_file() and path.suffix in EXTS:
            result.append(path)
        elif path.is_dir():
            for child in path.rglob("*"):
                if any(part in SKIP_DIRS for part in child.parts):
                    continue
                if child.is_file() and child.suffix in EXTS:
                    result.append(child)
    return sorted(set(result))


def line_no(text: str, index: int) -> int:
    return text.count("\n", 0, index) + 1


def main() -> int:
    parser = argparse.ArgumentParser(description="Heuristic frontend design validator")
    parser.add_argument("paths", nargs="+", help="Files or directories to scan")
    parser.add_argument("--max", type=int, default=80, help="Maximum findings to print")
    args = parser.parse_args()
    scanned = files(args.paths)
    if not scanned:
        print("Heuristic evidence unavailable: scanned 0 frontend files")
        print("Check the input paths and supported extensions; no validation was performed.")
        return 2
    findings: list[tuple[str, int, str, str]] = []
    corpus = []
    for path in scanned:
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        corpus.append(text)
        for code, pattern, message in CHECKS:
            for match in pattern.finditer(text):
                findings.append((str(path), line_no(text, match.start()), code, message))
    joined = "\n".join(corpus)
    if scanned:
        for code, needle, message in GLOBAL_CHECKS:
            if needle not in joined:
                findings.append(("<global>", 0, code, message))
    print(f"Heuristic evidence: scanned {len(scanned)} frontend files")
    if not findings:
        print("No heuristic findings; this does not replace framework checks or visual review.")
        return 0
    for path, line, code, message in findings[: args.max]:
        loc = f"{path}:{line}" if line else path
        print(f"{loc}: [{code}] {message}")
    remaining = len(findings) - args.max
    if remaining > 0:
        print(f"... {remaining} more findings")
    print("Heuristic findings require review; confirm them with project checks and rendered behavior.")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
