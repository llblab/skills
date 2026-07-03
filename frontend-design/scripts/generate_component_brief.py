#!/usr/bin/env python3
"""Generate a component implementation brief.

Usage:
  python scripts/generate_component_brief.py button
  python scripts/generate_component_brief.py table --context admin
"""

from __future__ import annotations

import argparse
from _catalog import rank_csv, pick, md_bullet

COMPONENTS = {
    "button": {
        "anatomy": "leading icon → label → trailing icon/loading",
        "variants": "primary, secondary, outline, ghost, link, destructive",
        "states": "default, hover, active, focus, disabled, loading",
        "a11y": "Use <button>; explicit type in forms; icon-only buttons need accessible names; loading prevents duplicate submit.",
        "content": "Keep label stable and action-oriented; preserve width during loading when possible.",
    },
    "input": {
        "anatomy": "label → control → helper/error text",
        "variants": "text, textarea, select/combobox, checkbox, radio, switch",
        "states": "default, hover, focus, error, disabled, read-only, loading",
        "a11y": "Visible label, semantic input type, autocomplete, associated error text.",
        "content": "Placeholder is example text, not the label; preserve entered value on errors.",
    },
    "card": {
        "anatomy": "header → title/meta → content → footer/actions",
        "variants": "default, elevated, outline, interactive, metric, pricing, avatar",
        "states": "default, hover, focus, selected, disabled, loading, empty",
        "a11y": "Clickable card has one clear action and keyboard focus; avoid nested competing targets.",
        "content": "Use consistent padding and hierarchy; handle long titles and missing media.",
    },
    "dialog": {
        "anatomy": "overlay → panel → title/description → content → actions",
        "variants": "modal, alert, drawer/sheet, popover-like contextual panel",
        "states": "opening, open, closing, loading, error, destructive confirmation",
        "a11y": "Trap focus, expose title, restore focus on close, support Escape/close affordance.",
        "content": "Keep primary and cancel actions distinct; scroll long content predictably.",
    },
    "table": {
        "anatomy": "toolbar/filters → header → rows → pagination/status → bulk action bar",
        "variants": "simple, sortable, filterable, selectable, virtualized, comparison",
        "states": "loading, empty, filtered-empty, error, selected, hover, focus, stale",
        "a11y": "Header scopes, keyboard row/action access, non-color status indicators.",
        "content": "Align numeric columns; manage horizontal overflow intentionally; preserve filters/back state.",
    },
    "navigation": {
        "anatomy": "brand → primary nav → secondary/actions → current state",
        "variants": "top bar, sidebar, tabs, bottom nav, breadcrumbs, command/search nav",
        "states": "active, hover, focus, collapsed, expanded, disabled, pending count",
        "a11y": "Current page exposed; keyboard traversal logical; labels for icon nav.",
        "content": "Top-level items are stable and few; back behavior preserves state.",
    },
}


def closest(name: str) -> tuple[str, dict[str, str]]:
    lowered = name.lower()
    for key, value in COMPONENTS.items():
        if lowered in key or key in lowered:
            return key, value
    return "custom", {
        "anatomy": "define regions/slots before styling",
        "variants": "list finite variants based on product need",
        "states": "default, hover, active, focus, disabled, loading, error, empty as applicable",
        "a11y": "choose semantic element/role, label, keyboard behavior, focus behavior",
        "content": "test long, missing, loading, and localized content",
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate component brief")
    parser.add_argument("component")
    parser.add_argument("--context", default="")
    args = parser.parse_args()
    key, spec = closest(args.component)
    query = " ".join(part for part in [args.component, args.context] if part)
    ux = rank_csv("ux-guidelines.csv", query, 5)
    print(f"# Component Brief: {args.component}\n")
    print(f"- **Matched pattern:** {key}")
    print(md_bullet("Anatomy", spec["anatomy"]))
    print(md_bullet("Variants", spec["variants"]))
    print(md_bullet("States", spec["states"]))
    print(md_bullet("Accessibility", spec["a11y"]))
    print(md_bullet("Content behavior", spec["content"]))
    print("\n## State Matrix\n")
    for state in spec["states"].split(", "):
        print(f"- [ ] {state}: visual treatment, interaction behavior, accessibility semantics")
    if ux:
        print("\n## Relevant UX Checks\n")
        for row in ux:
            print(f"- **{pick(row, 'Category')} / {pick(row, 'Issue')}** — Do: {pick(row, 'Do')} | Don't: {pick(row, "Don't")}")
    print("\n## Implementation Rules\n")
    print("- Use project-native component and styling conventions.")
    print("- Tokenize repeated semantic values and component contracts.")
    print("- Test keyboard, touch, responsive width, long content, and loading/error states.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
