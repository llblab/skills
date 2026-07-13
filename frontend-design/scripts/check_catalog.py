#!/usr/bin/env python3
"""Validate frontend-design catalog contracts and generator smoke paths.

Checks catalog presence, required columns, required row values, unregistered CSVs,
and representative execution of every generate_*.py entrypoint.
"""

from __future__ import annotations

import csv
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
SCRIPTS = ROOT / "scripts"

SCHEMAS: dict[str, tuple[str, ...]] = {
    "app-interface-guidelines.csv": ("Category", "Issue", "Keywords", "Description", "Do", "Don't", "Severity"),
    "banner-specs.csv": ("surface", "type", "size", "aspect_ratio", "safe_zone"),
    "chart-selection.csv": ("Data Type", "Keywords", "Best Chart Type", "When to Use", "When NOT to Use", "Accessibility Grade"),
    "color-psychology.csv": ("color", "signals", "common_fit", "caution", "pairings"),
    "copy-formulas.csv": ("formula", "use_for", "structure", "template", "emotion"),
    "icon-generation-styles.csv": ("name", "description", "stroke_width", "fill", "best_for", "keywords"),
    "icon-library-map.csv": ("Category", "Icon Name", "Keywords", "Library", "Usage", "Best For"),
    "icon-styles.csv": ("style", "best_for", "stroke", "fill", "checks"),
    "identity-deliverables.csv": ("Deliverable", "Category", "Keywords", "Description", "File Format"),
    "identity-industries.csv": ("Industry", "Keywords", "CIP Style", "Primary Colors", "Typography", "Key Deliverables"),
    "identity-mockup-contexts.csv": ("Context Name", "Category", "Keywords", "Scene Description", "Lighting", "Environment"),
    "identity-styles.csv": ("Style Name", "Category", "Keywords", "Description", "Primary Colors", "Typography"),
    "landing-patterns.csv": ("Pattern Name", "Keywords", "Section Order", "Primary CTA Placement", "Conversion Optimization"),
    "logo-color-palettes.csv": ("Palette Name", "Category", "Keywords", "Primary Hex", "Secondary Hex", "Accent Hex"),
    "logo-industries.csv": ("Industry", "Keywords", "Recommended Styles", "Primary Colors", "Typography", "Common Symbols"),
    "logo-styles.csv": ("Style Name", "Category", "Keywords", "Primary Colors", "Typography", "Best For", "Avoid For"),
    "product-color-palettes.csv": ("Product Type", "Primary", "On Primary", "Secondary", "On Secondary", "Accent", "On Accent", "Background", "Foreground", "Card", "Card Foreground", "Muted", "Muted Foreground", "Border", "Destructive", "On Destructive", "Ring"),
    "product-patterns.csv": ("product_category", "pattern_bias", "visual_bias", "must_have", "avoid"),
    "product-reasoning.csv": ("UI_Category", "Recommended_Pattern", "Style_Priority", "Color_Mood", "Typography_Mood", "Decision_Rules", "Anti_Patterns"),
    "product-ui-patterns.csv": ("Product Type", "Keywords", "Primary Style Recommendation", "Secondary Styles", "Landing Page Pattern", "Dashboard Style (if applicable)", "Color Palette Focus", "Key Considerations"),
    "slide-backgrounds.csv": ("slide_type", "image_category", "overlay_style", "text_placement", "search_keywords"),
    "slide-charts.csv": ("chart_type", "keywords", "best_for", "data_type", "when_to_use", "when_to_avoid", "accessibility_notes"),
    "slide-color-logic.csv": ("emotion", "background", "text_color", "accent_usage", "card_style"),
    "slide-copy.csv": ("formula_name", "keywords", "components", "use_case", "example_template", "emotion_trigger", "slide_type"),
    "slide-layout-logic.csv": ("goal", "emotion", "layout_pattern", "direction", "visual_weight", "break_pattern"),
    "slide-layouts.csv": ("layout_name", "keywords", "use_case", "content_zones", "visual_weight", "cta_placement"),
    "slide-strategies.csv": ("strategy_name", "keywords", "structure", "goal", "audience", "tone", "narrative_arc"),
    "slide-typography.csv": ("content_type", "primary_size", "secondary_size", "weight_contrast", "line_height"),
    "style-catalog.csv": ("Style Category", "Type", "Keywords", "Primary Colors", "Effects & Animation", "Best For", "Do Not Use For", "Accessibility", "Implementation Checklist"),
    "style-matrix.csv": ("style", "use_for", "core_moves", "avoid", "implementation_checks"),
    "terminology.csv": ("canonical", "kind", "aliases", "definition", "notes"),
    "typography-pairings.csv": ("Font Pairing Name", "Category", "Heading Font", "Body Font", "Mood/Style Keywords", "Best For"),
    "ux-guidelines.csv": ("Category", "Issue", "Platform", "Description", "Do", "Don't", "Severity"),
}

SMOKE_CASES: dict[str, tuple[tuple[str, ...], str]] = {
    "generate_banner_brief.py": (("linkedin", "header", "product launch"), "# Banner Brief"),
    "generate_chart_brief.py": (("analytics", "trend"), "# Chart Brief"),
    "generate_component_brief.py": (("dialog", "--context", "mobile destructive confirmation"), "# Component Brief"),
    "generate_copy_formula.py": (("landing", "conversion"), "# UI / Landing Copy"),
    "generate_design_brief.py": (("crypto", "analytics", "dashboard"), "## Chosen Direction"),
    "generate_icon_brief.py": (("dashboard", "settings"), "# Icon Brief"),
    "generate_identity_brief.py": (("finance",), "# Identity Package Brief"),
    "generate_logo_brief.py": (("fintech",), "# Logo Brief"),
    "generate_palette_brief.py": (("healthcare", "dashboard"), "# Palette Brief"),
    "generate_slide_brief.py": (("investor", "pitch", "traction"), "# Slide / Section Brief"),
    "generate_tokens.py": (("--starter",), ":root"),
    "generate_typography_brief.py": (("healthcare", "dashboard"), "# Typography Brief"),
    "generate_ux_checklist.py": (("mobile", "form", "accessibility"), "# UX Checklist"),
}


def check_catalogs(errors: list[str]) -> None:
    actual = {path.name for path in DATA.glob("*.csv")}
    expected = set(SCHEMAS)
    for name in sorted(expected - actual):
        errors.append(f"missing catalog: data/{name}")
    for name in sorted(actual - expected):
        errors.append(f"unregistered catalog: data/{name}; add a schema contract before use")
    for name, required in SCHEMAS.items():
        path = DATA / name
        if not path.exists():
            continue
        with path.open(newline="", encoding="utf-8") as handle:
            reader = csv.DictReader(handle)
            headers = set(reader.fieldnames or [])
            missing = [column for column in required if column not in headers]
            if missing:
                errors.append(f"data/{name}: missing columns: {', '.join(missing)}")
                continue
            rows = list(reader)
        if not rows:
            errors.append(f"data/{name}: catalog has no rows")
            continue
        for index, row in enumerate(rows, start=2):
            empty = [column for column in required if not (row.get(column) or "").strip()]
            if empty:
                errors.append(f"data/{name}:{index}: empty required values: {', '.join(empty)}")


def check_generators(errors: list[str]) -> None:
    actual = {path.name for path in SCRIPTS.glob("generate_*.py")}
    expected = set(SMOKE_CASES)
    for name in sorted(actual - expected):
        errors.append(f"missing smoke case for scripts/{name}")
    for name in sorted(expected - actual):
        errors.append(f"missing generator: scripts/{name}")
    for name, (args, marker) in SMOKE_CASES.items():
        path = SCRIPTS / name
        if not path.exists():
            continue
        try:
            result = subprocess.run(
                [sys.executable, str(path), *args],
                cwd=ROOT,
                capture_output=True,
                text=True,
                timeout=15,
                check=False,
            )
        except subprocess.TimeoutExpired:
            errors.append(f"scripts/{name}: smoke test timed out")
            continue
        if result.returncode != 0:
            detail = (result.stderr or result.stdout).strip().splitlines()
            errors.append(f"scripts/{name}: smoke test failed: {detail[-1] if detail else f'exit {result.returncode}'}")
            continue
        if marker not in result.stdout:
            errors.append(f"scripts/{name}: smoke output missing marker {marker!r}")
        if not result.stdout.strip():
            errors.append(f"scripts/{name}: smoke output is empty")


def main() -> int:
    errors: list[str] = []
    check_catalogs(errors)
    check_generators(errors)
    print(f"Checked {len(SCHEMAS)} catalog contracts and {len(SMOKE_CASES)} generator smoke paths")
    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        print(f"Catalog check failed with {len(errors)} error(s)")
        return 1
    print("Catalog check passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
