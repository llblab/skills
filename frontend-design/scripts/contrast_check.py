#!/usr/bin/env python3
"""Check WCAG contrast ratio for two hex colors.

Usage:
  python scripts/contrast_check.py '#111827' '#ffffff'
  python scripts/contrast_check.py '#777' '#fff' --large
"""

from __future__ import annotations

import argparse
import re


def parse_hex(value: str) -> tuple[int, int, int]:
    raw = value.strip().lstrip("#")
    if not re.fullmatch(r"[0-9a-fA-F]{3}|[0-9a-fA-F]{6}", raw):
        raise ValueError(f"Invalid hex color: {value}")
    if len(raw) == 3:
        raw = "".join(ch * 2 for ch in raw)
    return int(raw[0:2], 16), int(raw[2:4], 16), int(raw[4:6], 16)


def channel(v: int) -> float:
    x = v / 255
    return x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4


def luminance(rgb: tuple[int, int, int]) -> float:
    r, g, b = [channel(v) for v in rgb]
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def ratio(fg: str, bg: str) -> float:
    l1 = luminance(parse_hex(fg))
    l2 = luminance(parse_hex(bg))
    lighter = max(l1, l2)
    darker = min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)


def main() -> int:
    parser = argparse.ArgumentParser(description="Check WCAG contrast ratio")
    parser.add_argument("foreground")
    parser.add_argument("background")
    parser.add_argument("--large", action="store_true", help="Evaluate as large text")
    args = parser.parse_args()
    value = ratio(args.foreground, args.background)
    aa = value >= (3.0 if args.large else 4.5)
    aaa = value >= (4.5 if args.large else 7.0)
    ui = value >= 3.0
    print(f"Contrast: {value:.2f}:1")
    print(f"UI components AA (3:1): {'PASS' if ui else 'FAIL'}")
    print(f"Text AA ({'3' if args.large else '4.5'}:1): {'PASS' if aa else 'FAIL'}")
    print(f"Text AAA ({'4.5' if args.large else '7'}:1): {'PASS' if aaa else 'FAIL'}")
    return 0 if aa else 1


if __name__ == "__main__":
    raise SystemExit(main())
