# Rovo Prompt — Restructure Existing DDD Observability Confluence Page

Copy the text below into Atlassian Rovo while viewing the existing Confluence page **Observability Framework for DDD API Pattern – v2**. If Rovo cannot access the full page or edit it, ask it to produce a complete draft for review rather than claiming changes were made.

---

You are acting as a principal software architect and observability reviewer. Analyze the FULL CURRENT CONTENT of this Confluence page, **Observability Framework for DDD API Pattern – v2**, including all five observability layers, indicator tables, formulas, statuses, dashboard lists, alerts, tool mappings, conditional sections, and SLO policies.

**Task:** Create a new, review-ready Confluence draft titled **Enterprise Observability & Traceability Pattern — DDD API** using the target structure below. This is an intelligent restructuring and technical normalization exercise, NOT a verbatim reformatting exercise. Do not overwrite the original page without my explicit approval. Prefer creating a new draft or child page if your permissions support it; otherwise return the complete Confluence-ready content.

## Context and constraints

- Existing organization tools: OpenTelemetry, AWS CloudWatch, Dynatrace, Nobl9.
- Engineering environment: DDD API services, transactional outbox, publishers, consumers, reconciliation, AWS Lambda, DynamoDB, DynamoDB Streams, SQS, EventBridge, EventBridge Scheduler as applicable.
- Implementation boundaries: DDD Skill Library (developer guidance and templates), DDD Shared Library (approved reusable runtime instrumentation and context propagation), CDK Construct Library / application CDK (infrastructure), application repositories (business instrumentation), observability platforms (metrics/traces/SLOs/alert routing).
- These are PROPOSED responsibility boundaries; do not claim repository code or integrations exist without evidence.
- Treat the original labels EXISTING, ENHANCED, NEW as **source-document labels**, not verified deployment status.
- Do not claim all workloads have every AWS component. Keep optional infrastructure conditional.
- Do not assume OpenTelemetry exports directly to Nobl9 or that Nobl9 is a trace collector. Explicitly validate telemetry export, metric ingestion and SLO integration paths.

## Required page hierarchy

1. Overview, scope and objectives
2. Architecture and telemetry flow
3. **Table 1 — Metrics, SLI and SLO definitions**
4. **Table 2 — Dashboard and visualization mapping**
5. **Table 3 — Alerting, criticality and trigger conditions**
6. Implementation responsibility mapping
7. End-to-end traceability examples (at least two)
8. Master relationship and delivery matrix
9. Implementation status, validation gaps and architecture decisions
Appendix A. Source-to-target traceability and disposition
Appendix B. Optional/conditional indicators

## How to transform the original data

1. Read every original section before drafting. Inventory ALL indicators, existing dashboards, alerts, recommended tools and optional indicators. Do not rely on the currently visible screen section alone.
2. Normalize duplicated or overlapping rows into one canonical metric when they genuinely measure the same thing. Preserve original names and locations in Appendix A. Do not merge distinct concepts such as API request success vs eventual business transaction completion, trace coverage vs context propagation success, or SLI vs SLO.
3. Preserve meaningful domain details: commands, aggregates, transactional outbox, publisher, consumer, reconciliation, event IDs, correlation IDs, business transaction IDs, trace IDs, asynchronous handoffs, DLQ and AWS service health.
4. For each measurable indicator, assign a stable `M-###` ID, observability layer, original status, indicator type, purpose, exact numerator/denominator or units, eligibility and exclusions, target/window, source system, metric owner and implementation component. Use `TBD — validation required` for missing facts. Distinguish the ORIGINAL example target from a NEW proposal if they differ.
5. Distinguish actual user-facing SLIs from diagnostic metrics, operational KPIs, tracking metrics, governance KPIs and testable diagnostic capabilities. Do not invent SLOs for every metric. When a capability cannot be expressed as a defensible ratio, provide an acceptance test instead.
6. Create dashboard rows with stable `D-###` IDs. Each row MUST reference one or more existing `M-###` IDs, define displayed data, chart/view type, platform and user purpose. Group logically: business; API/application; outbox/publisher/consumer; infrastructure; trace diagnostics; reliability/SLO.
7. Create alert rows with stable `A-###` IDs. Each MUST reference a metric ID and include severity, measurable trigger, evaluation window, traffic/sample guardrail, owner, route, response and runbook placeholder. Include alerts only when actionable; for diagnostic-only items state `No direct alert — diagnostic view` where appropriate.
8. Provide a **master relationship matrix** joining `M-### → D-### → A-### (or N/A) → source → implementation owner → current verification status`. Ensure all references exist; never leave dangling IDs.
9. Allocate each implementation responsibility to the most appropriate mechanism. Skill Library = instructions/boilerplate; Shared Library = reusable runtime code; CDK = infrastructure; application repository = business semantics; Nobl9/platform configuration = SLOs and policies. Avoid duplication across libraries, especially new shared packages without clear ownership.
10. Reconcile the source's example SLO and alert thresholds with the proposed new structure. Do NOT silently replace source targets. Label every unapproved threshold as `Illustrative — pending approval`. Include good/bad event semantics, rolling window, error-budget policy and missing-data policy where available; otherwise mark TBD.
11. Preserve all conditional indicators in Appendix B with applicability rules, including JVM, EC2, caches, S3, load balancers, file processing, multi-region policies, etc., only where found in the source.
12. Create a source-to-target audit table: original section + indicator → canonical M ID / D ID / A ID → retained, merged, conditional or deferred → justification. Do not omit rows silently.
13. Flag inaccuracies, ambiguity or contradictions in a concise `Review decisions / validation gaps` section. In particular, verify AWS native metric semantics, DynamoDB Stream lag measurement, SQS timing denominators, EventBridge delivery failure definitions, and trace sampling limitations before treating calculations as production-ready.

## Minimum examples to demonstrate connected design

**Example 1 — API availability**
- `M-001` API availability: good eligible HTTP requests / eligible requests; illustrative 99.9% over 30 days; choose one authoritative metric source.
- `D-001` API availability trend and SLO scorecard, linked to `M-001`.
- `A-001` SLO fast-burn alert linked to `M-001`, evaluated by approved Nobl9 policy, routed to on-call.
- Show shared HTTP instrumentation, application configuration, metric ingestion and SLO configuration ownership.

**Example 2 — Async trace context propagation**
- `M-002` successful validated handoffs / eligible handoffs; illustrative ≥99%; requires instrumentation of handoffs, not just presence of sampled traces.
- `D-002` propagation success trend + broken-handoff trace diagnostics, linked to `M-002`.
- `A-002` warning when propagation drops below an approved threshold for a specified window and sufficient sample volume.
- Show API → outbox/publisher → SQS/EventBridge (only if applicable) → consumer, with Shared Library inject/extract utilities and application-specific integrations.

The two examples are **illustrative IDs**. If canonical numbering changes while incorporating all original indicators, update ALL references consistently.

## Output and quality bar

- Produce polished, readable Confluence headings, real tables and concise explanatory text; do not generate hundreds of isolated repeated mini-tables.
- Keep the three main tables the center of the document. Add summary matrices and appendices without obscuring them.
- Preserve all original information of engineering significance while consolidating duplicates and correcting misleading classifications. Explain every correction or meaningful change.
- Do not invent deployed dashboards, alarms, library exports, metric names, routes, thresholds, runbooks or approved architecture decisions.
- Show at least two fully connected end-to-end examples and their IDs.
- Before finalizing, self-check: all source rows accounted for; every dashboard/alert ID references valid metric IDs; every indicator has a status and owner or explicit TBD; original and proposed targets are distinguished; no conflicting ownership; no unverified claim presented as fact.
- Finish with a short **Architecture Review Checklist** and **Open Decisions** section.

**Execution:** First analyze the entire source page. Then create the complete new draft. If page creation/editing is available, create the new draft and provide its link; otherwise return the full Confluence-ready draft. Do not alter or delete the original page without explicit approval.
