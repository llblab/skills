# Data Visualization

Data UI should answer a question, not merely display a chart. Start from the decision the user must make.

## Chart Selection

| Question | Best Fits | Avoid |
|---|---|---|
| Compare categories | Bar, sorted bar, dot plot | Pie with many slices |
| Show trend over time | Line, area, sparkline | Unordered bars |
| Show part-to-whole | Stacked bar, 100% bar, treemap, limited pie | 3D pie, many tiny slices |
| Show distribution | Histogram, box plot, violin, beeswarm | Average-only cards |
| Show relationship | Scatter, bubble, correlation matrix | Dual-axis unless necessary |
| Show status | KPI, gauge with caution, status list, heatmap | Decorative radial charts |
| Show flow | Sankey, funnel, step timeline | Dense node spaghetti |
| Show geography | Choropleth, proportional symbols, map + table | Map when location is irrelevant |

## Dashboard Types

### Executive Summary

- 4-6 top KPIs.
- Large values, clear trend, timeframe.
- One-page scan.
- Minimal filter complexity.
- Print/share friendly when needed.

### Operational Monitoring

- Live status and freshness.
- Alerts ranked by severity/actionability.
- Realtime indicators and connection state.
- Recovery action near failure.
- Stable layout under frequent updates.

### Analytics / Drilldown

- Summary to detail path.
- Visible filters and breadcrumb/context.
- Save/share/export options.
- Detail panels preserve chart context.
- Empty/no-result states explain active filters.

### Comparative Analysis

- Side-by-side layout.
- Delta indicators with timeframe.
- Clear baseline or benchmark.
- Winning/losing states supported by text/icon.
- Mobile stacks comparison without losing labels.

### Predictive / Forecast

- Actual and predicted lines are visually distinct.
- Confidence interval is visible and explained.
- Anomalies are marked with reason/context.
- Prediction date/freshness shown.
- Avoid false certainty in color and copy.

## Accessibility

- Do not rely on color alone.
- Add direct labels where possible.
- Legends must be close and readable.
- Tooltips should not be the only source of critical values.
- Use colorblind-safe palettes for categorical data.
- Provide tables or summaries for key chart data when stakes are high.
- Keyboard access matters for interactive charts.

## Visual Scale Integrity

- Bar charts should usually start at zero.
- Truncated axes must be clearly labeled.
- Log scale must be labeled.
- Dual-axis charts require strong justification.
- Area/volume encoding can mislead; use sparingly.
- Sort bars when rank matters.
- Keep time intervals consistent.

## Metric Card Anatomy

- `Label`: What is measured.
- `Value`: Current number, formatted consistently.
- `Unit`: Currency, percent, count, duration.
- `Trend`: Direction and magnitude.
- `Timeframe`: Compared to when.
- `Freshness`: Last updated when, if relevant.
- `Action`: Drilldown or recovery if the metric indicates a problem.

## Color Semantics

- Sequential scale: low → high intensity.
- Diverging scale: negative → neutral → positive.
- Categorical scale: distinct hues with enough separation.
- Severity scale: neutral/info/success/warning/danger.
- Reserve red for actual problems when possible.

## Interaction Patterns

- Hover/focus reveals details without moving layout.
- Click drills down; breadcrumb or back restores context.
- Brushing/zooming has reset.
- Filters show active state and result count.
- Streaming charts avoid distracting full redraws.
- Export includes applied filters and timestamp.

## Data Empty/Error States

| State | Design |
|---|---|
| No data yet | Explain source and first step |
| Filtered out | Show active filters and reset |
| Loading | Preserve layout, show skeleton/progress |
| Stale | Show last update and refresh/reconnect |
| Partial data | Mark missing series and explain impact |
| Error | Name failed source and recovery action |

## Chart Polish

- Prefer direct labels over distant legends for small series counts.
- Use gridlines lightly; they support reading, not decoration.
- Use tabular numerals.
- Align decimals and units.
- Round intentionally; do not imply false precision.
- Annotate important events on trend charts.
- Keep dashboard cards equal enough to scan, not necessarily identical.
