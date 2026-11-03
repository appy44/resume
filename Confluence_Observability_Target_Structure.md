# Enterprise Observability & Traceability Pattern — DDD API

**Status:** Proposed structure for architecture review  
**Scope:** DDD APIs, transactional outbox, asynchronous processing, AWS services  
**Approved platform products in use:** OpenTelemetry, AWS CloudWatch, Dynatrace, Nobl9  
**Source page to restructure:** Observability Framework for DDD API Pattern – v2

> This is a target **information architecture**, not a replacement for the source catalog. Populate all sections from the actual Confluence page. Example thresholds are illustrative, not approved SLOs. A source label of EXISTING does not independently verify deployment.

## 1. Overview, scope and objectives

Explain the five complementary perspectives: business outcomes, application behavior, infrastructure health, traceability/diagnostics, and reliability management. Clarify that these are analytical perspectives, not sequential telemetry pipeline stages. Define in-scope DDD components and conditional infrastructure.

## 2. Architecture and telemetry flow

Illustrative architecture (verify actual integrations and routes):

`Application + DDD Shared Library → OpenTelemetry instrumentation / application metrics → approved telemetry export paths → Dynatrace / CloudWatch → validated SLI sources → Nobl9 SLO evaluation → policy-based alerts and dashboards`

Distinguish tracing from custom business metrics, CloudWatch infrastructure telemetry, and Nobl9 SLO evaluation. Document actual trace backend, collector/exporter, metric ingress, sampling, identity propagation, and routing only after verification.

## 3. Table 1 — Metrics, SLI and SLO definitions

**Purpose:** What is measured, how it is calculated, and where the data comes from. Every indicator receives a stable `M-###` ID. Include user-facing SLIs, operational KPIs, diagnostic metrics and governance metrics, but do not automatically promote them to SLOs.

| ID | Observability layer | Metric / indicator | Source status | Type | What to track | Formula / eligible population | Proposed target / window | Data source | Measurement owner | Implementation owner |
|---|---|---|---|---|---|---|---|---|---|---|
| M-001 | Application / Reliability | API availability | To verify | User-facing SLI | Successful eligible API requests | Good eligible requests ÷ all eligible requests; define status exclusions | Illustrative ≥99.9%, rolling 30 days | Dynatrace or CloudWatch (choose authoritative source) | Service owner | Shared instrumentation + application configuration |
| M-002 | Traceability | Context propagation success | NEW in source | Operational KPI | Preserved trace context across eligible handoffs | Successful validated handoffs ÷ eligible handoffs; requires explicit handoff telemetry | Illustrative ≥99%, measurement window TBD | OpenTelemetry-derived metrics / approved backend | Service owner | DDD Shared Library + application integration |

**Required metric definition:** Unit; good/bad event semantics; numerator/denominator; exclusions; minimum traffic; evaluation window; missing-data behavior; dimensions; source metric/query; accountable owner; review status. If a metric is only a capability (e.g., search by correlation ID), document a testable acceptance criterion rather than inventing a mathematical SLI.

## 4. Table 2 — Dashboard and visualization mapping

**Purpose:** Show where the metric is visible and what action the view supports. Every dashboard entry references `M-###` and has stable `D-###` ID.

| ID | Related metric IDs | Dashboard / widget | Displayed data | Visualization | Platform | User / diagnostic purpose |
|---|---|---|---|---|---|---|
| D-001 | M-001 | API health and availability | Successful/eligible requests, availability trend, target | Time series + SLO scorecard | Dynatrace + Nobl9 (depending on actual integration) | Detect service degradation and review SLO status |
| D-002 | M-002 | Trace continuity | Successful/eligible handoffs, broken boundaries | Percentage trend + trace drill-down | Dynatrace / approved trace backend | Identify propagation gaps between API, publisher, queue and consumer |

**Dashboard groups:** Business outcomes; API/application health; outbox/publisher/consumer/reconciliation; AWS infrastructure; traceability and diagnostics; SLO and error budgets. Keep dashboard details mapped to actual source metrics, not generic widgets.

## 5. Table 3 — Alerting, criticality and triggers

**Purpose:** Describe actionable triggers, severity, owner and response. Every alert has stable `A-###` ID and references a measurable `M-###` indicator. Diagnostic views need not generate direct alerts.

| ID | Related metric IDs | Alert | Proposed severity | Illustrative trigger | Evaluation / minimum volume | Routing owner | Expected response |
|---|---|---|---|---|---|---|---|
| A-001 | M-001 | Availability fast burn | Critical / P1, subject to policy | Approved multiwindow burn-rate condition on API availability SLO | Both short and long windows; traffic guardrail | Service on-call / SRE | Follow incident and SLO runbook; investigate service failures |
| A-002 | M-002 | Context propagation degradation | Warning / P3, subject to policy | Successful handoffs below 99% | Example 15 min; minimum handoff count TBD | Application/platform instrumentation owner | Identify failing boundary and verify injection/extraction |

**Alert policy:** Severity and threshold are not universally fixed. Include routing, suppression/deduplication, maintenance windows, missing-data handling, runbook, notification platform and escalation. Distinguish SLO paging from diagnostic notifications. Document 30-day multiwindow burn-rate policies only after validation against organizational policy.

## 6. Implementation responsibility mapping

| Capability | Primary implementation | Supporting layer | Verification / boundary |
|---|---|---|---|
| Standard HTTP instrumentation | DDD Shared Library (if approved) | DDD Skill Library + application | Shared runtime package; no domain-specific rules |
| Trace context inject/extract | DDD Shared Library | Application adapters + Skill Library | Verify async carrier, serialization and cross-account boundaries |
| Business transaction and outbox metrics | Application repository | DDD Skill Library | Domain semantics stay in application |
| CloudWatch alarms, log groups, retention | CDK Construct Library / application CDK | Platform configuration | Reuse approved constructs; avoid duplicate wrappers |
| Collector infrastructure (if needed) | CDK / platform infrastructure | Shared Library SDK configuration | Do not assume a collector is required |
| Dashboard provisioning | Platform-specific integration / IaC | CDK where supported | Verify platform APIs and ownership |
| SLO definitions, burn policies | Nobl9 configuration / platform integration | SRE + service owners | Validate source connectivity and ownership |
| Alert routing / escalation | Monitoring and incident-management configuration | Service operations | Avoid competing pages from multiple platforms |
| Implementation instructions, templates | DDD Skill Library | Repository scaffolding / PDP | Guidance and code generation, not runtime functionality |

**Architecture guardrail:** Skill Library = instructions and patterns; Shared Library = reusable runtime utilities; CDK = provisioned infrastructure; Application = business semantics. Do not add another shared package without a reviewed ownership boundary and reuse assessment.

## 7. End-to-end traceability examples

### Example A — API availability: measurement → dashboard → alert

`API request → standard HTTP instrumentation → validated Dynatrace/CloudWatch metric → M-001 → D-001 → Nobl9 SLO evaluation → A-001 → service on-call`

Traceable relationships: **M-001 ↔ D-001 ↔ A-001**. Confirm the authoritative numerator, denominator, SLO window and Nobl9 integration before implementation.

### Example B — Async trace context: instrumentation → diagnostic dashboard → warning

`API → outbox/publisher → SQS/EventBridge (where used) → consumer → trace-context validation → M-002 → D-002 → A-002`

Traceable relationships: **M-002 ↔ D-002 ↔ A-002**. Verify that `traceparent` is injected/extracted across actual carriers and that context handoff success is measured explicitly. A visible trace is not proof of 100% trace coverage or context propagation.

## 8. Master relationship and delivery matrix

| Metric ID | Dashboard ID | Alert ID | Owning component | Telemetry platform | Status / next action |
|---|---|---|---|---|---|
| M-001 | D-001 | A-001 | Shared Library + application + SLO configuration | Dynatrace/CloudWatch → Nobl9, route TBD | Validate metric and SLO source |
| M-002 | D-002 | A-002 | Shared Library + application | OpenTelemetry → trace/metric backend, route TBD | Validate async handoff instrumentation |

**Scale-out rule:** Every in-scope source indicator must be mapped to a metric row, a dashboard or diagnostic view where useful, an alert only when actionable, an implementation owner, and a disposition. Use `N/A — rationale` rather than inventing a dashboard or alert.

## 9. Implementation status, validation and architecture decisions

Record: source status (EXISTING/ENHANCED/NEW), verified deployment state (Verified/Unverified/Not implemented), decision owner, target approval, integration dependencies, and priority. Preserve source-target vs proposed-target differences explicitly. Capture duplicate metrics and conflicting formulas in a decision log.

## Appendix A — Source-to-target traceability

| Original layer / section / indicator | New metric ID | Dashboard ID(s) | Alert ID(s) | Disposition / reason |
|---|---|---|---|---|
| [Populate from source] | [M-### or N/A] | [D-### or N/A] | [A-### or N/A] | Retained / merged / conditional / deferred |

## Appendix B — Conditional capabilities

Include only where deployed: JVM/thread/connection pools, EC2, load balancers, S3/file processing, caches, region-specific policies, and other source-page conditional rows. Explain applicability, do not silently delete.
