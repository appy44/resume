# Enterprise Observability & Traceability Framework — DDD API Pattern

**Status:** Proposed framework for architecture and stakeholder review  
**Scope:** DDD APIs, business transactions, transactional outbox, asynchronous messaging, schedulers, reconciliation, and applicable AWS-managed services  
**Purpose:** Agree on *what must be observed*, *how reliability is measured*, *which dashboards and alerts are required*, and *who owns them* **before selecting a monitoring/SLO platform**.  
**Decision status:** SLI/SLO catalog, dashboard views, and alert requirements are proposals. Numeric targets, evaluation windows, platform selection, and final operational routing require approval.

> **Scope of this document:** This is a consolidated and revised functional/architectural specification, not evidence of deployed instrumentation. It is based on the 28-page source capture, with corrected calculation semantics and clearer adoption rules. Implementation status is intentionally not inferred from the example catalog. Tool-specific data-source and implementation assignments are deferred; tool candidates are compared only in the final section.

---

## 1. Overview and objectives

The framework organizes observability into **five complementary views**, not five sequential telemetry-processing stages:

1. **Business outcomes** — Did the business transaction finish correctly and within the expected time?
2. **Application behavior** — Are API endpoints, commands, outbox publishers, consumers, schedulers, and reconciliation processes working?
3. **Infrastructure health** — Are the AWS components and integrations supporting the workload healthy?
4. **Traceability and diagnostics** — Can a transaction be followed reliably across synchronous and asynchronous boundaries?
5. **Reliability management** — Are approved SLOs being achieved, are error budgets being consumed appropriately, and are incidents detected and resolved effectively?

**Expected outcomes:**

- Identify failures that affect customers or business transactions, even when infrastructure appears healthy.
- Distinguish user-facing reliability indicators from supporting diagnostics and operational KPIs.
- Make every monitored outcome traceable to an indicator, dashboard, alert/response, and accountable owner.
- Establish a reusable baseline while permitting service-specific and capability-specific observability.
- Select tools based on demonstrated ability to implement the approved requirements, not on the tools already available.

### 1.1 Applicability

| Requirement class | Applies to | Examples |
|---|---|---|
| **Core baseline** | Every applicable API/service | Request volume, availability, latency, server errors, correlation context, telemetry health |
| **Business-specific** | Services owning business journeys | Business success, processing deadlines, correctness, freshness, reconciliation |
| **Capability-conditional** | Only where the component/pattern exists | Outbox, publisher, consumer, scheduler, SQS, DynamoDB Streams, DLQ, EventBridge |
| **Operational governance** | Services and central operating teams according to ownership | SLO status, alert effectiveness, incident recovery, coverage and data quality |

The 52 indicators in this catalog are **not all mandatory for every service**. An applicability review determines which rows are required for each application.

### 1.2 High-level telemetry flow (tool-neutral)

`Business and application activity → instrumented events/measurements → validated collection and storage → SLI calculation → dashboards and alerts → investigation and incident response`

Cross-cutting trace and business correlation data must be carried through applicable HTTP calls, durable outbox records, events/messages, retries, consumers, and reconciliation operations. The final data ingestion path and monitoring products will be selected later.

---

## 2. Measurement standards and SLO rules

### 2.1 Indicator types

| Type | Definition | Appropriate treatment |
|---|---|---|
| **User-facing SLI** | Quantifies reliability experienced by a customer or business journey | Eligible for an approved SLO and error-budget policy |
| **Service SLI** | Quantifies a meaningful internal service or processing contract | SLO candidate when breach has clear service/business impact |
| **Operational KPI** | Shows the health or efficiency of a process | Dashboard and operational thresholds; SLO only if justified |
| **Diagnostic metric** | Helps explain or isolate a fault | Dashboard, drill-down, and targeted alarms; not automatically an SLO |
| **Governance KPI** | Shows monitoring completeness and operational readiness | Review reporting, quality controls, and management actions |

### 2.2 Calculation requirements

Every approved SLI must define **good events**, **total eligible events**, **bad events**, **exclusions**, **evaluation window**, **missing-data behavior**, **measurement owner**, and a reproducible query/test.

For request- or event-based objectives:

`SLI (%) = (good eligible events / all eligible events) × 100`

For failure-rate diagnostics:

`Failure rate (%) = (relevant failed eligible events / all eligible events) × 100`

For deadline-based business outcomes, *eligible initiated transactions that never complete* must remain in the evaluated population after their deadline. A completed-only denominator can understate failures. Retries must not cause the same logical transaction to be counted multiple times.

**Important conventions:**

- Declare the event at which an operation becomes eligible, and when its result is final or overdue.
- Count logical transactions/messages separately from processing attempts when both exist.
- Specify whether expected business rejections, HTTP 4xx, cancellations and conditional-write failures count as good, bad or excluded, according to the actual contract.
- Record latency distributions (p50/p95/p99) for diagnosis; a “99% within X seconds” SLO requires its own good/total-event calculation.
- Evaluate SLOs over an approved rolling or calendar window. **No numeric examples in the source are approved targets by default.**
- Missing telemetry is **unknown**, not automatically success or application failure; surface it as a separate monitoring-data-quality condition.
- Alert windows and severity must consider traffic volume, impact, recovery behavior, and the risk of duplicate incidents.

### 2.3 Approval data required for every SLO

| Field | Required decision |
|---|---|
| Indicator ID / business operation | What exact behavior is covered? |
| Eligible population | Which requests, transactions or messages enter the denominator? |
| Good and bad outcome rules | Which results meet or violate the contract? |
| SLI formula/query | How can the result be reproduced and independently tested? |
| Target and evaluation window | What objective is justified by business criticality and historical data? |
| Threshold and deadline | What latency/freshness/processing boundary applies? |
| Measurement source of truth | Which validated source/query will be authoritative after tool selection? |
| Missing data and low traffic | How are absent observations and low sample sizes handled? |
| Owner, runbook and evidence | Who accepts the objective, investigates breaches, and validates implementation? |

---

## 3. Layer 1 — Business outcomes

**Intent:** Measure the success, timeliness and correctness of customer/business transactions independently of infrastructure health.

### 3.1 Business metrics, SLIs and SLO candidates

| ID | Metric / indicator | Type | Measurement definition / eligible population | Objective / decision required |
|---|---|---|---|---|
| **Metric-001** | Business success rate | User-facing SLI | Unique eligible business transactions reaching an approved successful terminal state ÷ all eligible initiated transactions whose outcome is due; define expected rejections, cancellations and exclusions. | Approve success target and window per business journey. |
| **Metric-002** | Transaction processing time | User-facing SLI | Elapsed time from transaction initiation to successful completion. For deadline attainment: eligible transactions completed successfully within `T` ÷ all eligible initiated transactions whose deadline has elapsed. | Approve `T`, SLO percentage and evaluation window; report percentile latency separately. |
| **Metric-003** | End-to-end business latency | User-facing SLI | Time across the defined end-to-end journey, including relevant processing and asynchronous stages; deadline attainment must include expired/unfinished eligible journeys. | Agree start/end boundaries, deadline and objective. |
| **Metric-004** | Transaction lifecycle counts | Tracking metric | Counts of started, processing, completed, failed, rejected, recovered and timed-out transactions by agreed lifecycle state. | No separate SLO; monitor state changes, stuck items and anomalies. |
| **Metric-005** | Business event health | Tracking metric | Domain-event counts by event type and lifecycle status: created, completed, failed, delayed or rejected. | No separate SLO unless events represent an explicit reliability contract. |
| **Metric-006** | Business freshness | User-facing SLI | Eligible business results made available within an agreed delay from a source event ÷ all eligible source events whose freshness deadline has elapsed. | Approve freshness deadline and attainment target. |
| **Metric-007** | Transaction abandonment / timeout rate | User-facing SLI or diagnostic | Abandoned, expired or timed-out eligible logical transactions ÷ all eligible initiated transactions; distinguish user abandonment from technical timeout. | Set impact-based threshold and precise classification. |
| **Metric-008** | Transaction reconciliation accuracy | Operational KPI | Correctly matched records across defined checkpoints ÷ all eligible records checked; also track unmatched, duplicate and aging records. | Approve tolerance, reconciliation cutoff and investigation threshold. |
| **Metric-009** | Business data correctness | Operational KPI | Correct eligible business outcomes ÷ all eligible outcomes evaluated for correctness, including invalid or unprocessable outcomes rather than silently excluding them. | Approve data-quality criteria, tolerance and window. |
| **Metric-010** | Duplicate business outcome rate | Diagnostic metric | Unique unintended duplicate business outcomes ÷ eligible logical transactions, using an agreed business/idempotency key. | Define investigation threshold and deduplication semantics. |

### 3.2 Business dashboards

| ID | Dashboard / view | Related indicators | Required display and investigation purpose |
|---|---|---|---|
| **Dashboard-001** | Business outcomes | Metric-001–Metric-010 | Started/completed/failed/rejected/recovered transactions; success and deadline attainment; freshness, correctness, duplicates and reconciliation. Filter by journey, service, environment and time. |
| **Dashboard-002** | Reconciliation and recovery | Metric-008, Metric-116, Metric-117, Metric-505 | Scheduled execution, reconciliation success/failure, unmatched items, recovered transactions, backlog and recovery time. |

### 3.3 Business alerts and actions

| ID | Alert condition | Related indicators | Priority guidance | Owner and expected response |
|---|---|---|---|---|
| **Alert-001** | Critical business flow stopped or degraded: no eligible completions when traffic is expected, or success SLI breaches an approved condition. | Metric-001, Metric-004, Metric-007 | P1/P2 by journey criticality | Business capability/service on-call: validate ingestion, failures, dependencies and recovery path. |
| **Alert-002** | Business latency or freshness contract breached for eligible transactions. | Metric-002, Metric-003, Metric-006 | Usually P2; escalate by impact | Business capability on-call: inspect stage latency, outbox, queue and consumer delay. |
| **Alert-003** | Sustained reconciliation mismatch or correctness degradation. | Metric-008, Metric-009 | Usually P2 | Service/data owner: inspect mismatches, perform correction or controlled replay as approved. |
| **Alert-004** | Duplicate outcome or idempotency anomaly exceeds approved threshold. | Metric-010, Metric-114 | P3; P2 when customer-impacting | Service owner: inspect keys, retries, replay and deduplication behavior. |

---

## 4. Layer 2 — Application behavior

**Intent:** Monitor API handlers, commands, aggregates, outbox state, event publication, consumption, schedulers and reconciliation execution.

### 4.1 Application metrics, SLIs and diagnostics

| ID | Metric / indicator | Type | Measurement definition / eligible population | Objective / decision required |
|---|---|---|---|---|
| **Metric-101** | API availability | User-facing SLI | Successful eligible API requests ÷ all eligible API requests; specify route boundaries, expected client errors, gateway failures and exclusions. | Approve route/service target, window and outcome classification. |
| **Metric-102** | API request volume and outcomes | Tracking metric | Request counts by normalized route, method and outcome category (success, client rejection, server failure, timeout). | No SLO; baseline traffic and breakdown. |
| **Metric-103** | API latency distribution | User-facing SLI + diagnostic | p50/p95/p99 of eligible request durations; separately calculate requests meeting latency limit `T` ÷ all eligible requests. | Approve `T`, attainment target, operation selection and window. |
| **Metric-104** | API server error rate | User-facing SLI | Eligible server-side failed requests ÷ all eligible requests; define treatment of upstream errors and faults. | Approve error budget and classification; avoid double-counting with timeout. |
| **Metric-105** | API timeout rate | User-facing SLI | Timed-out eligible requests ÷ all eligible requests, with consistent timeout categories and precedence. | Set contract deadline and target. |
| **Metric-106** | Command and aggregate health | Diagnostic metric | Command volume, successful handling, failures, rejected domain operations, aggregate state changes and business-rule failures. | Define domain states/events and operational thresholds. |
| **Metric-107** | Outbox health | Diagnostic metric | Outbox records by created, pending, retrying, published, failed and dead/stuck states; backlog and oldest-pending age. | Define stuck-record, retry and backlog thresholds. |
| **Metric-108** | Outbox freshness | Service SLI | Eligible outbox records published successfully within `T` of committed creation ÷ all eligible records whose deadline elapsed. | Approve delay target and handling of permanently failed items. |
| **Metric-109** | Publication success | Service SLI candidate | Successfully published eligible logical events ÷ eligible events due for publication; count retries separately. | Decide whether SLO is needed or retain as operational KPI. |
| **Metric-110** | Publication latency | Service SLI candidate | Publication delay from committed event/outbox creation to confirmed publication; distinguish attempted vs confirmed delivery. | Approve deadline and candidate target where critical. |
| **Metric-111** | Consumer success | Service SLI | Eligible logical messages completed successfully ÷ eligible logical messages due for successful processing; account for retries and DLQ outcomes. | Approve deadline, success meaning and SLO target. |
| **Metric-112** | Consumer health | Diagnostic metric | Message lifecycle counts: received, succeeded, failed, retried, deduplicated, rejected and dead-lettered; processing concurrency. | Define operational thresholds and failure categories. |
| **Metric-113** | Dependency failure rate | Diagnostic metric | Failed/timeout downstream calls ÷ eligible dependency calls, grouped by approved dependency name and operation. | Define expected errors, fallback behavior and warning threshold. |
| **Metric-114** | Idempotency correctness | Operational KPI | Correct idempotent outcomes on eligible repeated operations ÷ all eligible repeated operations; track incorrect side effects separately. | Approve required correctness level and test duplicate/replay scenarios. |
| **Metric-115** | Schema validation failure | Diagnostic metric | Invalid, incompatible or unparseable eligible received messages ÷ all eligible received messages; do not use only successfully validated messages in denominator. | Define rejection severity and sustained-failure threshold. |
| **Metric-116** | Scheduler execution reliability | Operational KPI / SLI candidate | Jobs completing successfully by their deadline ÷ eligible scheduled occurrences, including missed/unstarted occurrences. | Approve required deadline, allowable delays and objective. |
| **Metric-117** | Reconciliation health | Operational KPI | Successful completed reconciliation runs ÷ eligible scheduled reconciliation runs; include missed, incomplete and late runs. | Agree operational threshold and unresolved-item aging. |

### 4.2 Application dashboards

| ID | Dashboard / view | Related indicators | Required display and investigation purpose |
|---|---|---|---|
| **Dashboard-101** | API health and availability | Metric-101, Metric-102, Metric-103, Metric-104, Metric-105, Metric-501 | Request throughput/outcome breakdown, success, availability, p50/p95/p99, timeout rate and approved SLO status. |
| **Dashboard-102** | Command and domain behavior | Metric-106, Metric-113, Metric-114, Metric-115 | Command lifecycle, aggregate state changes, validation failures, idempotency errors and downstream failures. |
| **Dashboard-103** | Outbox, relay and publisher health | Metric-107, Metric-108, Metric-109, Metric-110, Metric-203, Metric-207 | Pending/failed/retry counts, oldest age, publication success and latency, stream delay and event-routing failures. |
| **Dashboard-104** | Consumer and queue health | Metric-111, Metric-112, Metric-113, Metric-114, Metric-115, Metric-204, Metric-205, Metric-206 | Consumer success/failure/retry, queue depth, in-flight messages, oldest-message age, processing lag, DLQ counts and growth. |

### 4.3 Application alerts and actions

| ID | Alert condition | Related indicators | Priority guidance | Owner and expected response |
|---|---|---|---|---|
| **Alert-101** | API availability/error-budget fast burn. | Metric-101, Metric-501, Metric-502 | P1 when critical and confirmed | Service on-call/SRE: open incident, inspect failures, dependencies, changes, error budget. Coordinate with Alert-501 so one incident is paged once. |
| **Alert-102** | Sustained API latency, server error, timeout or dependency degradation. | Metric-103, Metric-104, Metric-105, Metric-113 | P2, escalate by impact | Service on-call: inspect affected routes, dependency errors and recent deploys. |
| **Alert-103** | Outbox backlog, stuck records or freshness breach. | Metric-107, Metric-108 | P1/P2 by business criticality | Service on-call: inspect transaction writer, relay/publisher, retries and downstream path. |
| **Alert-104** | Publication failures or publication-reliability breach. | Metric-109, Metric-110, Metric-207 | P1/P2 by impact | Service on-call: inspect publisher, routing, permissions, delivery attempts and retry policy. |
| **Alert-105** | Consumer reliability degradation or sustained retry/schema failures. | Metric-111, Metric-112, Metric-113, Metric-115 | P1/P2 by criticality | Consumer-service on-call: inspect message types, processing failures, downstream dependencies and idempotency state. |
| **Alert-106** | Scheduler or reconciliation process fails or misses deadline. | Metric-116, Metric-117 | Usually P2 | Service owner: validate scheduling, execution, permissions, retry state and approved manual fallback. |

---

## 5. Layer 3 — Infrastructure health

**Intent:** Observe underlying resources and integration constraints. **Only apply a component's indicators where that component exists in the service design.** Infrastructure health supports diagnosis; it should not replace customer-facing SLIs.

### 5.1 Infrastructure metrics and diagnostics

| ID | Metric / indicator | Type | Measurement definition / eligible population | Objective / decision required |
|---|---|---|---|---|
| **Metric-201** | Lambda health | Diagnostic metric | Invocations, error count/rate, duration, concurrency, throttles, timeout and cold-start behavior where observable. | Service-specific thresholds; correlate with business/API impact. |
| **Metric-202** | DynamoDB health | Diagnostic metric | Consumed/provisioned capacity, throttles, request latency and conditional-check failures. **Expected conditional rejections are not automatically infrastructure incidents.** | Define throttling, latency and capacity thresholds; distinguish expected business conditions. |
| **Metric-203** | DynamoDB stream health | Diagnostic metric | Iterator age, records received/processed, failed batches, retry behavior and stream-consumer progress. | Define lag/failure thresholds and recovery expectations. |
| **Metric-204** | SQS queue health | Diagnostic metric | Visible, in-flight and delayed message counts; oldest visible message age, queue depth and backlog change. | Define workload-specific backlog/oldest-message boundaries. |
| **Metric-205** | SQS processing lag | Service SLI candidate | Eligible logical messages successfully processed within `T` of enqueue ÷ all eligible messages whose deadline passed; denominator must include failed, expired and DLQ-directed messages under the agreed contract. | Approve end-to-end deadline, eligibility and any SLO target. |
| **Metric-206** | DLQ health | Diagnostic metric | Messages arriving in the DLQ, total DLQ depth and growth rate, plus age where available. | Unexpected arrivals or sustained growth trigger investigation; policies by criticality. |
| **Metric-207** | EventBridge health | Diagnostic metric | Invocations, failed invocations, throttled rules, delivery retry/failure indicators and routing success where measurable. | Approve delivery-failure threshold and verify service-specific metrics. |
| **Metric-208** | AWS quota and cross-account integration health | Operational KPI | Capacity/quota utilization and authorized cross-account operation success/failure for relevant dependencies. | Define capacity planning, permission and integration-risk thresholds. |

### 5.2 Infrastructure dashboard

| ID | Dashboard / view | Related indicators | Required display and investigation purpose |
|---|---|---|---|
| **Dashboard-201** | AWS infrastructure health | Metric-201–Metric-208 | Lambda, DynamoDB, stream, queue, DLQ, EventBridge and quota/integration health in the context of affected application services. |

### 5.3 Infrastructure alerts and actions

| ID | Alert condition | Related indicators | Priority guidance | Owner and expected response |
|---|---|---|---|---|
| **Alert-201** | Sustained critical Lambda errors, throttling, or timeout conditions. | Metric-201 | P1/P2 depending on impact | Service/platform on-call: inspect capacity, timeout, dependency latency and deploys. |
| **Alert-202** | Sustained DynamoDB throttling or unhealthy stream processing lag. | Metric-202, Metric-203 | Usually P2 | Service/platform on-call: inspect capacity, partitions, consumer retries and stream progress. |
| **Alert-203** | SQS backlog or processing-age contract breached. | Metric-204, Metric-205 | Usually P2 | Consumer-service on-call: scale/repair consumers, check poison messages and failures. |
| **Alert-204** | Unexpected critical DLQ arrivals or sustained DLQ growth. | Metric-206 | P1/P2 by queue criticality | Service on-call: prevent data loss, inspect failed payload classes and approved remediation/replay. |
| **Alert-205** | Quota pressure or cross-account integration failures. | Metric-208 | P1/P2 by impact | Platform owner: inspect quotas, policies, permission boundaries and integration settings. |

*EventBridge failures (Metric-207) are primarily connected to Alert-104 and Dashboard-103; avoid introducing a redundant alert without a distinct operational action.*

---

## 6. Layer 4 — Traceability and diagnostics

**Intent:** Make it possible to follow requests and business transactions across API, domain, outbox, message, consumer and reconciliation boundaries, and to identify where observability itself has gaps.

### 6.1 Traceability metrics and capabilities

| ID | Metric / indicator | Type | Measurement definition / eligible population | Objective / decision required |
|---|---|---|---|---|
| **Metric-301** | Context propagation success | Operational KPI | Validated cross-boundary handoffs preserving the required trace context ÷ eligible handoffs. | Define required context, supported carriers, target and test paths. |
| **Metric-302** | Trace and diagnostic capability | Diagnostic capability | Ability to investigate an eligible transaction using correlated trace, application events, errors and relevant state. | Define minimum investigation fields and diagnostic acceptance tests. |
| **Metric-303** | Correlation ID propagation | Operational KPI | Eligible handoffs preserving the expected correlation ID ÷ eligible handoffs requiring that ID. | Approve identifier policy and propagation validation. |
| **Metric-304** | Business ID correlation | Operational KPI | Eligible traceable transactions correctly linked to a business transaction/aggregate identity ÷ applicable transactions. | Define safe identifier representation, scope and coverage target. |
| **Metric-305** | Trace coverage | Operational KPI | Eligible transactions with **usable** traces ÷ eligible transactions in the observation population, measured using controlled test traffic or sampling-aware methods. | Define what counts as a usable trace; avoid treating unsampled traffic as instrumentation failure. |
| **Metric-306** | Trace completeness | Operational KPI | Traces containing the required stages/spans or documented asynchronous relationships ÷ eligible observed traces. | Approve required stages and trace model. |
| **Metric-307** | Async trace linkage | Operational KPI | Eligible message/event handoffs linked to their origin by parent context and/or appropriate trace links ÷ eligible asynchronous handoffs. | Define messaging context propagation, batch handling, retries and linking rules. |
| **Metric-308** | Telemetry ingestion delay | Diagnostic metric | Difference between event/span occurrence time and availability in the searchable destination, for measured samples. | Agree acceptable delay and clock-skew handling. |
| **Metric-309** | Diagnostic event completeness | Operational KPI | Required diagnostic events emitted and available ÷ expected events for a validated transaction/test scenario. | Define mandatory events and automated verification. |
| **Metric-310** | Trace sampling effectiveness | Operational KPI | Whether critical/important traces are retained and usable under the approved sampling policy; compare expected vs retained sampled categories. | Approve sampling policy, cost/coverage trade-off and validation method. |
| **Metric-311** | Telemetry delivery integrity and sensitive-data controls | Operational/governance KPI | Track telemetry loss/drop/rejection separately from detection of prohibited sensitive data in emitted logs/traces/metrics. | **Implement as two independently evaluated controls** with different owners; do not combine into one percentage or SLO. |

### 6.2 Traceability dashboards

| ID | Dashboard / view | Related indicators | Required display and investigation purpose |
|---|---|---|---|
| **Dashboard-301** | Trace continuity | Metric-301, Metric-303, Metric-304, Metric-305, Metric-306, Metric-307, Metric-310 | Successful and missing propagation by boundary; trace coverage, incomplete stages, asynchronous links and sampling effectiveness. |
| **Dashboard-302** | Traceability and diagnostics workbench | Metric-302, Metric-308, Metric-309, Metric-310, Metric-311 | Search by approved identifiers; view trace completeness, diagnostic events, ingestion delay, telemetry drops and security-quality findings. |

### 6.3 Traceability alerts and actions

| ID | Alert or response | Related indicators | Priority guidance | Owner and expected response |
|---|---|---|---|---|
| **Alert-301** | Context propagation rate falls below the approved validation baseline. | Metric-301 | Warning/P3; escalate if diagnosis or business operations are materially affected | Engineering/platform owner: test inject/extract behavior and locate the broken carrier/boundary. |
| **Alert-302** | **No default direct page.** Diagnose coverage/completeness and sampling gaps through dashboards, automated acceptance tests and periodic review. | Metric-302, Metric-305, Metric-306, Metric-308, Metric-309, Metric-310 | Non-paging governance/diagnostic action | Observability/platform owner: repair quality gaps and verify testing evidence. |
| **Alert-303** | Telemetry drops/ingestion failures or confirmed sensitive-data exposure. | Metric-311 | P2 for monitoring loss; severity for sensitive-data incidents follows security policy | Platform/security owner: restore telemetry path or execute the approved security response. Separate signals and routes. |

---

## 7. Layer 5 — Reliability management

**Intent:** Use approved SLIs and SLOs to govern reliability, error budgets, alert quality, incident recovery and monitoring completeness. This layer consumes measurements from the other layers; it does not replace them.

### 7.1 Reliability metrics and governance indicators

| ID | Metric / indicator | Type | Measurement definition / eligible population | Objective / decision required |
|---|---|---|---|---|
| **Metric-501** | SLO status and error budget | Reliability objective | Approved SLI attainment, target, remaining/consumed error budget and observed burn rate, calculated using one approved source of truth. | Agree SLO definitions, evaluation periods and error-budget policy. |
| **Metric-502** | Rolling-window compliance and burn-rate policy | Reliability policy | Compliance against the approved rolling/calendar evaluation window, fast/slow burn conditions and policy actions. | Approve multi-window detection thresholds and ownership. |
| **Metric-503** | SLO breach duration and frequency | Operational KPI | Number of SLO breaches and time spent in breach within a review period. | Establish reporting windows and follow-up triggers. |
| **Metric-504** | SLO data and ownership governance | Governance KPI | Coverage of approved SLOs with valid measurement data, named owners and scheduled reviews; measure these dimensions separately. | Define ownership completeness, data-quality threshold and review cadence. |
| **Metric-505** | Incident detection and recovery time | Operational KPI | Incident onset-to-detection time and detection-to-recovery time for eligible incidents. | Define onset/detection/recovery timestamps and operating targets. |
| **Metric-506** | Alert effectiveness | Operational KPI | Actionable vs non-actionable alerts, repeated pages, false positives, escalation gaps and alert-to-incident quality. | Approve actionable-alert criteria and review cadence. |

### 7.2 Reliability dashboards

| ID | Dashboard / view | Related indicators | Required display and investigation purpose |
|---|---|---|---|
| **Dashboard-501** | SLO and error-budget scorecard | Metric-501, Metric-502, Metric-503, Metric-504 | SLO attainment/target, remaining budget, burn rate, breach duration/frequency, measurement completeness and owner coverage. |
| **Dashboard-502** | Operational response and alert health | Metric-505, Metric-506 | Detection/recovery trends, actionable vs noisy alerts, repeated alarms, escalations and missing runbook/owner coverage. |

### 7.3 Reliability alerts and actions

| ID | Alert condition | Related indicators | Priority guidance | Owner and expected response |
|---|---|---|---|---|
| **Alert-501** | Approved SLO fast/slow burn-rate condition breached. | Metric-501, Metric-502 | P1/P2/P3 by SLO policy | Service on-call/SRE: follow SLO incident runbook, assess budget and mitigation/release decisions. Deduplicate with Alert-101 when they represent the same breach. |
| **Alert-502** | SLO data completeness or ownership falls below governance baseline. | Metric-504 | P3 / governance notification | SRE/platform governance: assign ownership, repair missing measurements and schedule review. |
| **Alert-503** | Incident detection/recovery or alert-effectiveness indicators deteriorate. | Metric-505, Metric-506 | P3 / operations improvement | SRE/service operations: improve routing, runbook coverage, escalation and false-positive reduction. |

---

## 8. Cross-layer traceability: examples

The catalog must remain linked from signal to action. These examples are **design mappings**, not claims that a particular tool is already configured.

| Scenario | Primary requirement / indicator | Supporting measurements | Dashboard | Alert / action |
|---|---|---|---|---|
| **A. API availability degrades** | Metric-101 availability; Metric-501 SLO budget | Metric-102 volume, 104 server errors, 105 timeouts, 113 dependency failures, 201 Lambda | Dashboard-101, 501 | Alert-101 **or** Alert-501 as one authoritative page; Alert-102 for distinct diagnostic conditions |
| **B. Transaction commits but event is not published** | Metric-108 outbox freshness; Metric-109 publication success | Metric-107 pending/failed records, 110 publication latency, 203 stream progress, 207 event delivery | Dashboard-103 | Alert-103 for stalled outbox; Alert-104 for publication/routing failure |
| **C. Queue grows and consumers fall behind** | Metric-111 consumer success; Metric-205 processing deadline | Metric-112 consumer outcomes, 204 queue depth, 206 DLQ | Dashboard-104, 201 | Alert-105 for consumer failures; Alert-203 backlog breach; Alert-204 critical DLQ |
| **D. Business outcome is delayed** | Metric-002/003 deadline attainment; Metric-006 freshness | Metrics 107–112, 204–205 when relevant | Dashboard-001, 002, 103, 104 | Alert-002; use linked infrastructure/application views for diagnosis |
| **E. Trace breaks at an asynchronous boundary** | Metric-301 propagation; Metric-307 async linkage | Metric-303 correlation, 305 coverage, 306 completeness, 308 ingestion delay | Dashboard-301, 302 | Alert-301 or non-paging Alert-302 validation action |

### 8.1 End-to-end correlation example

`API request → domain command → committed business transaction → outbox record → event publication → message queue/event bus → consumer → downstream state/reconciliation`

Across eligible stages, preserve the standardized trace context and a separate stable business correlation identifier where required. Retries, batch processing and asynchronous boundaries may require **trace links rather than always a single parent-child chain**. The business transaction ID must not become an unrestricted metric dimension because high cardinality can create cost and data-protection problems.

---

## 9. Ownership and governance (independent of tool selection)

| Responsibility | Proposed accountable role | Expected evidence |
|---|---|---|
| Business journey definition, eligibility and outcome semantics | Business capability owner + application service owner | Approved journey and outcome contract |
| Application events and business-specific measurements | Application engineering team | Application behavior tests, sample events and reviewed metric definitions |
| Shared conventions for HTTP, logging, trace context and telemetry fields | Engineering/platform standards owners | Versioned standard, compatibility matrix and automated tests |
| Cloud infrastructure signals and AWS resource monitoring requirements | Platform + service infrastructure owners | Resource inventory, sample measurements and failure tests |
| Dashboard content, filters and drill-down contract | Service owner + operations/SRE | Reviewed dashboard specification and pilot screenshots |
| SLI query validation, SLO target and burn policy | SRE + service/business owner | Approved calculations, windows, evidence and policy |
| Alert severities, deduplication, routing and incident procedures | SRE/service operations | Test alert, incident route and runbook |
| Monitoring data security, privacy and retention | Security + platform governance | Approved data classification and controls |
| Architecture decisions and exception handling | Architecture/platform governance | Decision record, deviations and review expiry |

**Operating rules:** One authoritative owner for each SLI; one authoritative source for each production SLI after tool selection; no duplicate paging for the same failure; every actionable alert must link to a runbook; capability-specific requirements apply only when the capability exists.

---

## 10. Validation and acceptance criteria

A catalog entry is not considered adopted until it has evidence. Proposed acceptance criteria:

| Category | Acceptance evidence |
|---|---|
| **SLI correctness** | Good/total definitions, exclusions, timeouts, retries and low-traffic handling tested against known sample events. |
| **Business journey** | At least one normal, failed, delayed, retry and incomplete transaction scenario reproduced and correctly measured. |
| **API telemetry** | Request volume, server errors, latency, timeouts and selected service SLIs visible for a representative endpoint. |
| **Async traceability** | Context and correlation preserved across applicable HTTP, outbox, event routing, queue and consumer boundaries. |
| **Infrastructure coverage** | Applicable AWS service diagnostic signals are present and tied to the affected service. |
| **Dashboards** | All required views show expected values, correct filters, and links between business impact and technical diagnosis. |
| **Alerts** | Threshold, evaluation window, no-data behavior, deduplication, severity, route and runbook validated by controlled tests. |
| **Telemetry reliability** | Collector/export or ingestion failures and sensitive-data controls tested separately. |
| **Operational ownership** | Named owner, escalation contact, incident response runbook and review cadence approved. |
| **Cost/performance** | Metric cardinality, telemetry volume, runtime overhead, sampling and projected cost reviewed. |

### 10.1 Decisions pending approval

- Which indicators are mandatory baseline vs business-specific vs capability-conditional for each application profile?
- Which business journeys require customer-facing SLOs, and what are the approved event eligibility rules?
- Which thresholds, evaluation windows, burn policies, escalation levels and missing-data behaviors should be approved?
- Which platform can implement **all required SLI calculations**, not just display operational metrics?
- Can the candidate platform support the requested dashboard cross-links, asynchronous correlation and source-of-truth controls?
- What existing instrumentation/platform capabilities can be reused, and what requires verified extension?
- What pilot application and failure scenarios will be used to prove feasibility before standardization?

---

## 11. Tool evaluation — options and feasibility (decision appendix)

**No product is selected by this document.** This comparison follows the approved measurement/dashboard/alert requirements above; it must not be used to retroactively redefine the requirements to fit a preferred tool.

### 11.1 Roles of the options

- **AWS-native:** A potential end-to-end AWS-centric approach using relevant AWS telemetry, dashboards, tracing, alarms and CloudWatch Application Signals SLO features. Business metrics still require domain instrumentation.
- **Dynatrace:** A potential observability backend for application performance, traces, logs, AWS resource monitoring, dashboards, custom-query SLOs and alerting. Coverage depends on actual tenant features and deployed instrumentation.
- **Nobl9:** A specialized **SLO management and error-budget** layer that consumes measurements from backends such as CloudWatch and Dynatrace. It is **not a replacement for application tracing, log investigation or the primary APM dashboards**.
- **Combined architecture:** A monitoring backend for signals and diagnostic dashboards plus a separate SLO/governance system, if the split delivers demonstrable value and does not create competing incident sources.

### 11.2 Capability fit matrix

**Legend:** **Strong** = documented capability; **Conditional** = possible but depends on ingestion, integration or custom implementation; **Not primary** = not the tool's core function. All grades require pilot verification in the organization's environment.

| Requirement | AWS-native approach | Dynatrace | Nobl9 |
|---|---|---|---|
| AWS infrastructure signals (201–208) | **Strong:** native service metrics and logs | **Strong:** AWS integration; validate exact metrics and cadence | **Not primary:** consumes metric data through a source |
| API health, latency and availability (101–105) | **Strong/conditional:** Application Signals and/or custom instrumentation | **Strong/conditional:** APM instrumentation and queries | **Conditional:** SLO calculations from a connected source, not full API diagnostics |
| Business-specific success/freshness (001–010) | **Conditional:** publish domain measurements and construct approved SLIs | **Conditional:** ingest domain metrics/events and define queries | **Conditional:** requires business SLIs available in a supported source |
| Outbox/publisher/consumer indicators (107–117) | **Conditional:** application metrics plus AWS signals | **Conditional:** custom business/runtime signals plus traces | **Conditional:** consumes derived SLIs; not a runtime instrumenter |
| Trace continuity and investigation (301–310) | **Conditional/strong:** supported tracing and service telemetry; test all async boundaries | **Strong/conditional:** distributed tracing and correlation; test async boundaries | **Not primary:** not the trace backend |
| SLO evaluation and error budgets (501–503) | **Strong/conditional:** CloudWatch Application Signals supports service SLOs, custom CloudWatch-metric SLIs and burn-rate alarms; verify per-SLI query fit | **Strong:** custom DQL-based SLOs and error budgets | **Strong:** dedicated SLO management and policies |
| Operational dashboards (001–502) | **Strong:** CloudWatch dashboards/Application Signals; custom composition required | **Strong:** configurable dashboards and SLO views | **Partial:** strong SLO reporting; not the full technical dashboard replacement |
| Alert evaluation and response routing | **Strong/conditional:** alarms plus organization routing | **Strong/conditional:** events/workflows plus routing | **Strong for SLO policy events;** external incident routing still needs integration |
| Single view across several telemetry backends | **Conditional:** integrations and federation design required | **Conditional/strong:** depends on connected environments | **Strong for consolidated SLO management**, not consolidated technical tracing |
| Automation / configuration lifecycle | **Strong for AWS-native resources**; review SLO/IaC coverage | **Conditional:** confirm supported configuration-as-code/API mechanisms | **Conditional:** API/YAML/CLI and governance process; verify existing platform access |
| Cost and operational complexity | AWS request/metric/log/trace/SLO charges; model based on telemetry volume | Licensing/ingestion/retention and operational setup; confirm contract | Additional SLO platform and integration/governance costs; confirm contract |

### 11.3 Feasible solution patterns

| Pattern | When it is a reasonable candidate | Main risk / proof needed |
|---|---|---|
| **A — AWS-native only** | Most workloads are AWS-based, business SLIs can be expressed in validated AWS metric sources, and AWS dashboards/alarms meet operating needs. | Prove complex business and async SLIs, end-to-end traces, multi-account visibility, request-based SLO fit and total cost. |
| **B — Dynatrace as primary observability and SLO platform** | The organization needs richer cross-service investigation and already has a well-supported Dynatrace operating model. | Prove business-event metrics and custom SLOs, trace completeness, infrastructure coverage, cost and integration ownership. |
| **C — AWS-native telemetry + Nobl9 for SLO governance** | AWS-native diagnostics are sufficient but centralized SLO policy, reporting or cross-source governance adds value. | Prove source queries, data freshness, missed data, alert routing and avoid conflicting SLO dashboards/pages. |
| **D — Dynatrace telemetry + Nobl9 for SLO governance** | Dynatrace is the preferred technical backend and independent organization-wide SLO workflows are required. | Prove ingestion/query consistency, operating overhead, duplicated alert risk and incremental value of the separate SLO layer. |

**Provisional engineering preference, not an architecture decision:** Test **Pattern A first** when the workload is substantially AWS-native, because the current AWS service SLO offering includes more than basic alarms. Compare against **Pattern B** if the required cross-boundary diagnosis, integrations or developer experience cannot be met economically. Add **Nobl9 only when centralized, platform-independent SLO governance has a demonstrated requirement**, not merely because it is already available.

### 11.4 Proposed tool-selection proof of concept

Use the *same* representative DDD journey and test data for every candidate. Validate **at least** the following:

1. **Business SLI:** Metric-001 and one deadline SLI (Metric-002 or 006), including a failed and never-completed transaction.
2. **API SLI:** Metric-101 and latency compliance from Metric-103, with precisely defined eligibility.
3. **Asynchronous reliability:** Metric-108, Metric-111 and Metric-205, including retries and DLQ outcomes.
4. **Traceability:** Metric-301, 305, 307 and a realistic trace search by business/correlation identifier.
5. **Dashboards:** Dashboard-001, Dashboard-101, Dashboard-103/104 and Dashboard-501, with usable drill-downs.
6. **Alerting:** Alert-001, 101/501 (deduplicated), 103 or 105, 204 and 303, including no-data conditions.
7. **Automation:** Repeatable configuration, access controls, version changes and resource cleanup.
8. **Nonfunctional quality:** Telemetry overhead, ingestion latency, cardinality, retention, security and cost projection.

#### Suggested decision scorecard

| Evaluation dimension | Proposed weight | Evidence required |
|---|---:|---|
| SLI formula coverage and SLO correctness | 25% | Passed golden-event calculations, deadline and missing-data tests |
| Dashboard usefulness and drill-down | 15% | Operations review of required cross-layer views |
| Alerting, routing and deduplication | 15% | Trigger/routing/incident tests |
| End-to-end async tracing and diagnostics | 15% | Captured controlled transaction traces |
| Automation and onboarding effort | 10% | Repeatable deployment and migration demonstration |
| Governance, security and ownership | 10% | Controls and operating-policy verification |
| Total cost and runtime overhead | 10% | Comparable workload/retention cost and performance test |
| **Total** | **100%** | **Architecture and operational sign-off** |

Weights are proposed and should be approved by architecture, platform operations and product stakeholders before scoring tools.

### 11.5 Official capability references (for tool evaluation only)

- AWS — [CloudWatch Application Signals SLOs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-ServiceLevelObjectives.html) (includes custom metric-based SLIs and burn-rate alarms).
- AWS — [CloudWatch Application Signals on Lambda](https://docs.aws.amazon.com/lambda/latest/dg/monitoring-application-signals.html) (check exact runtime/platform support).
- AWS — [CloudWatch dashboard widgets](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/create-and-work-with-widgets.html) and [AWS CDK CloudWatch constructs](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cloudwatch-readme.html).
- Dynatrace — [Service-Level Objectives](https://docs.dynatrace.com/docs/analyze-explore-automate/service-level-objectives) and [custom SLO definitions](https://docs.dynatrace.com/docs/analyze-explore-automate/service-level-objectives/create-slo).
- Dynatrace — [AWS Lambda monitoring](https://docs.dynatrace.com/docs/ingest-from/amazon-web-services/aws-lambda-integration).
- Nobl9 — [Supported data sources](https://docs.nobl9.com/sources/) and [CloudWatch SLO integration](https://docs.nobl9.com/sources/create-slo/amazon-cloudwatch/).

---

## 12. Architecture review and sign-off

| Decision | Status | Approver / owner |
|---|---|---|
| Five-layer model and catalog scope | Proposed | Technical Architecture + Product |
| Baseline versus conditional indicator policy | Pending | Architecture + Service Owners |
| SLI eligibility, formulas and target windows | Pending | Business/Service Owner + SRE |
| Dashboard scope and drill-down requirements | Pending | Service Operations + Architecture |
| Alerts, on-call ownership, no-data and deduplication | Pending | SRE / Incident Management |
| Approved telemetry source-of-truth and platform(s) | **Not selected** | Architecture + Platform + Security + Operations |
| End-to-end pilot results and implementation contracts | Pending | Engineering + Platform |
| Organizational rollout and governance acceptance | Pending | Delivery + Architecture Governance |

**Recommended review outcome:** Approve the **measurement scope and required views** after the indicated definitions are refined; then evaluate candidate products against the agreed specification. Do **not** treat “tool is available” as proof of SLI/SLO coverage, and do not create competing authoritative SLO or paging paths for the same service objective.
