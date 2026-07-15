# Legacy Course Migration Audit

## Finding

The original catalogue contains nine courses, 48 modules, and 178 lesson
titles. Course-card metadata declares 170 lessons. Eight of nine course counters
do not match their module content.

| ID | Course | Declared | Actual titles | Modules | Wave |
|---:|---|---:|---:|---:|---:|
| 1 | Kişisel Finans | 12 | 15 | 5 | 2 |
| 2 | Finansal Piyasalar | 18 | 17 | 5 | 1 |
| 3 | Temel Ekonomi | 15 | 18 | 5 | 2 |
| 4 | Temel Analiz | 20 | 20 | 5 | 2 |
| 5 | Teknik Analiz | 25 | 25 | 6 | 1 |
| 6 | Türev Piyasalar | 22 | 22 | 6 | 3 |
| 7 | Risk Yönetimi | 16 | 20 | 6 | 1 |
| 8 | İşlem Psikolojisi | 14 | 18 | 5 | 1 |
| 9 | Algoritmik İşlemler | 28 | 23 | 6 | 3 |
| **Total** |  | **170** | **178** | **48** |  |

The old `progress`, `rating`, and `enrolled` values are mock presentation data.
They must not be migrated as real learner or product analytics.

## Migration rules

The legacy catalogue is retained as research and content inventory, not as the
future Learn navigation.

Every legacy lesson is processed through:

1. Verify factual accuracy and source freshness.
2. Assign a curriculum domain and stable concept key.
3. Define one measurable competency.
4. Select Foundation, Intermediate, or Advanced stage.
5. Split broad titles into three-to-six-minute micro lessons.
6. Merge duplicated risk, stop, hedging, and timing material.
7. Add misconception, practical task, assessment, source, and disclaimer.
8. Mark the result draft until owner review.

## Migration waves

### Wave 1 — first Turkish path material

- Financial Markets
- Technical Analysis
- Risk Management
- Trading Psychology

These courses provide the strongest source material for the first market
literacy path. Their current course-level difficulty labels are unreliable. For
example, Technical Analysis is marked Advanced even though chart types, trends,
and support/resistance begin at Foundation level.

### Wave 2 — breadth after engine validation

- Personal Finance
- Economics
- Fundamental Analysis

These become separate financial literacy, macro/news, investing, and company
analysis paths rather than one large catalogue row each.

### Wave 3 — advanced and higher-risk material

- Derivatives
- Algorithmic Trading

These require stronger prerequisites, risk warnings, source review, simulation,
and explicit separation between education and executable trading behavior.

## Duplication and safety hotspots

- Stop-loss, take-profit, position sizing, and risk limits appear in Technical
  Analysis, Risk Management, Derivatives, and Algorithmic Trading.
- Hedging appears in Derivatives and Risk Management.
- Liquidity appears as both a market property and a risk category; the lessons
  need distinct competencies and cross-links.
- Entry/exit timing language must not become a recommendation or signal.
- Leverage and derivatives require scenario-based loss and liquidation risk.
- Algorithmic Trading must add data leakage, overfitting, fees, slippage,
  survivorship bias, and monitoring failure before publication.

## Wave 1 target

Wave 1 will produce one coherent Turkish path of 20 to 25 approved micro
lessons. It will not mechanically convert all 80 legacy titles from the four
source courses. Quality, coverage, and measured understanding take precedence
over preserving the old count.

