# Enterprise Observability & Traceability Framework — DDD API Pattern

**Status:** Proposed **requirements baseline for business, engineering, architecture and AI-assisted review** — not implementation sign-off  
**Version:** 1.0-review | **Reviewed:** 09 November 2026  
**Coverage:** DDD APIs and applicable domain transactions, outbox, messaging, schedulers, reconciliation, and AWS dependencies  
**Platform selection:** Open. AWS-native, Dynatrace and Nobl9 options appear **only in the final decision appendix**.  
**Evidence status:** Catalog definitions are **proposed requirements**, not verified deployed telemetry or approved production thresholds.

> **Review decision requested:** Approve the functional measurement catalog, applicability rules, dashboard/alert contracts, and validation criteria. Approve numeric SLOs, service-specific exclusions, routing and platform configuration separately using the decision register. No unspecified value is implied to be approved.

## 1. Purpose, stakeholders and decisions

This standard specifies **what to observe, how to calculate it, how it should be displayed, when someone should respond, and how conformity is proved**. It is deliberately independent of the final monitoring supplier or infrastructure-as-code implementation.

| Review group | What they need to approve |
|---|---|
| **Business/capability owner** | Critical journeys, correct/incorrect outcomes, acceptable deadlines, data quality, business importance and success criteria |
| **Service engineering** | Accurate event definitions, identity/correlation, implementation interfaces, diagnostic coverage and scenario tests |
| **Architecture/platform** | Layer boundaries, portability, security, integration feasibility and standardized application profiles |
| **Operations/SRE** | Approved SLOs, meaningful alerts, non-paging policy, routing, runbooks and operational acceptance |
| **AI/automation reviewers** | Stable identifiers, deterministic rules, unresolved-decision states and machine-checkable acceptance evidence |

**Non-goals at this stage:** selecting a product; claiming that instrumentation is already deployed; assigning invented numerical SLOs; forcing every metric into every service; replacing detailed architecture decisions or implementation runbooks with this catalog.

### 1.1 Five complementary observability views

1. **Business outcomes:** customer/business journeys complete correctly, on time and with current data.
2. **Application behavior:** APIs, commands, outbox, publishers, consumers, schedulers and reconciliation work as designed.
3. **Infrastructure health:** resources and AWS integrations are available and behave within capacity.
4. **Traceability/diagnostics:** support teams can follow causality across synchronous and asynchronous stages.
5. **Reliability management:** approved SLIs/SLOs, error budgets, incidents and alert quality guide operational decisions.

These are **analytical views, not sequential deployment layers**. A measurement may be visualized in multiple dashboards but has one canonical definition and identity.

### 1.2 Applicability and minimum baseline

| Rule | Scope | What is required |
|---|---|---|
| **Core API baseline** | Every deployed service exposing a production API | Metrics 101–105; basic service identity, time correlation, diagnostic access and telemetry-health checks where instrumented |
| **Business journey** | Service owns business result | Metrics 001, 004 and the relevant deadline/correctness indicators; choose Metric-002 or 003 according to distinct stage boundaries |
| **Capability-specific** | Component or behavior exists | Only its relevant metrics, dashboard panels and alerts: e.g. outbox, consumer, SQS, stream, EventBridge or scheduler |
| **Traceability** | Any service with cross-boundary handoffs | Applicable Metrics 301–310; 311 and 312 govern the telemetry path and sensitive-data controls |
| **SLO governance** | Approved objectives and operating processes exist | Metrics 501–506, with separately assigned service and governance owners |

**Adoption rule:** For each service, record every indicator as `Required`, `Conditional—applicable`, or `Not applicable (reason)`. A disabled or missing data source is **not** evidence that a required metric is not applicable. A capability that does not exist must not generate meaningless empty widgets or alerts.

### 1.3 Business and engineering success measures

A pilot succeeds only when it can (a) detect failed/late customer journeys, (b) explain the responsible stage with traceable evidence, (c) provide an actionable and correctly routed incident when required, and (d) reproduce its measured SLI from known test events. Adoption rate, mean detection time, investigation success and alert actionability are evaluated after the pilot; **no improvement percentage is promised in advance**.

## 2. Architecture and shared contracts

**Logical flow:** `Business and application operations → validated runtime measurements/events → telemetry transport → approved measurement source(s) → SLI calculation → dashboards and alert evaluation → investigation/incident response`.

Trace correlation runs **across** the flow. The telemetry store is not automatically the SLO evaluator; a specialized SLO platform, if chosen, consumes an authoritative, reproducible measurement source. A telemetry export outage is not the same event as application failure.

### 2.1 Identity, timestamps and event boundaries

| Concern | Required contract |
|---|---|
| Service identity | Stable service name, environment, logical operation, deployment revision, owning team and cloud resource identity where applicable |
| Request identity | Separate request/attempt identity from logical transaction identity; normalized route and contract outcome |
| Trace context | Standard trace/span context, including standardized HTTP carriers; message metadata and asynchronous span links where appropriate |
| Business correlation | Stable permitted business correlation ID; domain IDs must not be leaked into unbounded metric dimensions |
| Messaging identity | Event/message ID, logical delivery identity, publish attempt, consumer attempt and idempotency key as distinct concepts |
| Time | Consistent UTC event timestamps and documented timezone for schedules, synchronized clocks, explicit start/finish/deadline event definitions |
| Outcome state | Each logical work item has an authoritative outcome at the evaluation cutoff; state changes and retries must not inflate the denominator |
| Schema/version | Versioned telemetry/event contract with change review, compatible parsing and validation tests |

**Privacy:** Credentials, raw personal identifiers, business payloads and secrets must not be logged by default. Use approved redacted/pseudonymous identifiers and restrictive search access; a correlation key need not be a metric label. Production telemetry retention, access control and filtering require security approval.

### 2.2 Signal implementation boundaries (tool-independent)

| Responsibility | Producer/owner | Acceptance evidence |
|---|---|---|
| Domain outcomes, business state and lifecycle | Application and business capability team | Golden-event fixtures and lifecycle transition tests |
| Standard HTTP, error, dependency and trace instrumentation | Approved reusable runtime capability or application adapter | Cross-runtime contract tests and version-compatibility evidence |
| Outbox, publication, consumption, job and reconciliation signals | Owning application component | Durable IDs, attempts vs logical outcomes, failure/retry test evidence |
| AWS resource signals | Infrastructure/service owner | Verified service metric availability, owner and resource binding |
| Telemetry transport and backend availability | Platform/observability owner | Export/rejection/lag checks, loss test and isolation evidence |
| SLI calculation and SLO policy | SRE with business/service sign-off | Reproducible queries against controlled fixture data |
| Dashboard and alert response | Service operations with product/service owner | View walkthrough, trigger/routing test and runbook |

> Implementation repositories, SDK vendors, CDK modules, collectors and monitoring tools are **not selected in this requirement specification**. The chosen solution must satisfy the contract above without requiring a rewrite of business outcome semantics.

## 3. Measurement and SLO calculation rules

### 3.1 Universal counting principles

- **Event-based SLI:** `100 × good eligible logical events / all eligible logical events`. A zero denominator is **no valid measurement**, not 100%.
- **Failure rate:** `100 × distinct failed eligible events / distinct eligible events` using the same event population and outcome precedence.
- **Deadline SLI:** Select a cohort by **event initiation time** (or a documented alternate cohort rule), evaluate only once the event’s deadline has matured; good = successful completion at/before deadline. Late, failed and incomplete events are bad. Backfilled late telemetry must not silently rewrite closed reports without a versioned correction process.
- **Period-based SLI:** Count healthy/eligible time slices under an approved slice definition; do **not** apply the request/event denominator formula to time-slice SLOs.
- **Latency percentile:** p50/p95/p99 are descriptive distribution statistics and are not by themselves evidence that a request-based on-time SLO was met.
- **Retries and replays:** Logical business outcomes count once; attempt-level diagnostics may count every attempt. Define consistent idempotency keys and dispositions.
- **Expected behavior:** Client rejections, conditional updates, user cancellations and other legitimate outcomes require a written classification; never assume all non-success HTTP codes are outages.
- **Missing/late telemetry:** Track as data-quality state `Unknown`; it is not counted as good. Alerting and reporting must distinguish `breach`, `healthy`, `unknown`, and `not applicable`.
- **No traffic:** Use known expected-traffic schedules or independent probes where necessary; idle traffic alone is not an outage.
- **Low sample size:** Set a minimum-sample or statistical policy for alerting and SLO evaluation; small samples must not silently create misleading confidence.
- **Conflicting definitions:** An indicator has only one canonical formula and authoritative source in an approved service implementation; dashboards reuse it rather than recomputing inconsistent variants.

### 3.2 Required fields for every approved SLO

| Field | Approval evidence |
|---|---|
| ID and critical journey/operation | Exact service, environment, owner and customer-facing contract |
| Eligible event/cutoff | Initiation, eligibility, deadline, and terminal outcome semantics |
| Good/bad/excluded outcomes | Complete mutually exclusive categorization with reason codes |
| Formula and calculation mode | Event-, request- or time-slice-based equation and reproducible query |
| Target and review period | Business-approved objective, rolling/calendar window, timezone, revision |
| Low traffic / no data | Minimum observations, absence semantics and measurement failure pathway |
| Data authority | Validated metric/event source, completeness controls and backfill rule |
| Owner / runbook / alert | Named service owner, business approver, SRE reviewer, canonical paging rule |
| Validation | Unit + integration fixture, golden result, dashboard and alert drill-down |

**Error budget for request/event SLOs:** `allowed_bad = eligible × (1 − target_fraction)` and `observed_bad = eligible − good`; compute over the **approved** evaluation window. Define rounding and data correction policies before implementation. For time-slice objectives use a separate allowed-bad-period formula. **Targets, deadlines, rolling windows, error-budget alert policy and source queries are intentionally pending approval**, not inferred from illustrative values.

### 3.3 Status of every catalog entry

The metric tables intentionally omit a `Type` column (such as “User-facing SLI”). Whether an indicator becomes an official SLO is a **separate approval decision**, not a property implied by its label. The final column states the needed decision. Operational diagnostics and business measurements may inform an SLO without each becoming a redundant objective.

## 4. Layer 1 — Business outcomes

**Question:** Did the customer/business journey complete correctly and in time?

### 4.1 Indicators and measurement contracts
| ID | Indicator | Applies when | Measurement contract | Decision / objective |
|---|---|---|---|---|
| **Metric-001** | Business success rate | Business journey | One record per eligible logical business journey accepted; good = approved successful terminal outcome by its outcome cutoff; denominator = accepted journeys whose cutoff or final state falls in the evaluation cohort. Reject/cancel rules require approval. De-duplicate retries by stable journey ID. | Approve business outcome taxonomy, success objective, evaluation window and cutoff. |
| **Metric-002** | Transaction processing deadline | Owned transaction processor | For the *owned processing stage* only: good = accepted eligible jobs/transactions successfully finishing local processing within T_process; denominator = stage entries whose deadline has matured. Failed or stuck work is bad, not omitted. Also display completed-stage latency percentiles. | Approve local stage boundaries, T_process and objective. Do not duplicate Metric-003 when boundaries coincide. |
| **Metric-003** | End-to-end business journey deadline | Multi-stage business journey | Good = eligible initiated journeys that reach the agreed final business-visible state within T_journey, including asynchronous downstream steps; denominator = initiated journeys whose deadline has matured. Failed, late or unfinished journeys are bad. | Approve customer-visible start/end events, T_journey and objective; mark not applicable if identical to Metric-002. |
| **Metric-004** | Transaction lifecycle counts | Business journey | Count unique logical journeys by started, in-progress, succeeded, failed, rejected, cancelled, timed-out and recovered state. Reconcile mutually exclusive terminal states; attempts are a separate dimension/count. | Define the authoritative lifecycle state machine and expected-traffic detector. |
| **Metric-005** | Business domain event health | Domain events | Count unique domain events produced by type and domain disposition; track missing expected events and invalid event state transitions using application semantics. This is not a duplicate of transport publication in Metric-109. | Approve event taxonomy, expected event production rules and diagnostic limits. |
| **Metric-006** | Business data freshness | Downstream business view | Good = eligible source changes represented correctly in the agreed downstream read model within T_fresh; denominator = source changes whose freshness deadline has matured; include missing/stale projections. | Approve source timestamp, read-model availability definition and T_fresh. |
| **Metric-007** | Transaction abandonment and timeout | Business journey | Compute technical timeout rate = eligible technical expirations / due initiated journeys. Separately report user-initiated cancellation/abandonment; it is *not* automatically a technical failure. Never combine the two into one error numerator. | Approve terminal-state precedence and business treatment of cancellations. |
| **Metric-008** | Reconciliation match accuracy | Reconciliation | Matched, correctly linked records / eligible records due for reconciliation at a fixed cutoff, with unmatched and aged records visible. Distinguish matching accuracy from independently verified value correctness (Metric-009). | Approve join keys, cutoff, tolerated mismatches and denominator reconciliation. |
| **Metric-009** | Business data correctness | Business data validation | Correct outcomes / all eligible business outcomes scheduled for independent correctness assessment; unassessable or missing outcomes are reported separately and must fail a measurement-coverage gate, never silently count as correct. | Approve independent truth/validation rules, audit cohort, minimum coverage and tolerance. |
| **Metric-010** | Unintended duplicate business outcomes | Side-effecting business operation | Eligible logical journeys with at least one unintended extra business side effect / all eligible journeys; separately count duplicate effects. Use stable idempotency/business keys and avoid counting harmless duplicate delivery as bad. | Approve business-side-effect definition, uniqueness keys and escalation threshold. |

### 4.2 Dashboards and actions

**Dashboard conventions:** All production views must show service/environment/time, units, selected time window, last-data timestamp, an explicit `No data / Unknown` state, accountable owner and link to the appropriate investigation/runbook. Use bounded route/service dimensions, never unrestricted raw IDs. Views must expose how their SLI values map back to the canonical metric definition. Correlated cross-layer metrics may appear in more than one view without creating new metric definitions.

**Shared dashboard acceptance:** Correct sample fixture gives the expected value; drill-down reaches the incident/transaction evidence with only authorized data; absent components render `Not applicable`, not a misleading flat zero.
| ID | View | Related metric IDs | Required content | Investigation / test |
|---|---|---|---|---|
| **Dashboard-001** | Business outcome overview | Metric-001, Metric-002, Metric-003, Metric-004, Metric-005, Metric-006, Metric-007, Metric-008, Metric-009, Metric-010 | Journey throughput and lifecycle state, completed/late/failed counts, correctness, duplicates and freshness; trends by critical journey. | Select failed or late journey → linked stage/operation, trace search and owner. |
| **Dashboard-002** | Reconciliation and recovery | Metric-008, Metric-116, Metric-117, Metric-505 | Run deadlines, unmatched/aged record counts, mismatch reasons, recovery backlog and incident timing. | Mismatch → specific reconciliation run, source batches, controlled recovery record. |

### 4.3 Alert requirements
| ID | Trigger contract (parameterized) | Metric IDs | Responsible response | Approval needed before activation |
|---|---|---|---|---|
| **Alert-001** | Critical business flow has no eligible completions despite independently expected and mature workload, or its final outcomes fail a separately approved hard-failure rule. | Metric-001, Metric-004, Metric-007 | Business/service on-call: verify expected traffic, ingress and last good transition; open or join customer-impact incident. | Expected workload definition; hard-failure threshold; W001; impact severity; correlation with Alert-501. |
| **Alert-002** | Mature business journeys breach local/e2e deadline or projection freshness threshold; use signal-specific checks and one shared incident per customer impact. | Metric-002, Metric-003, Metric-006 | Business capability on-call: locate slow stage, outbox, consumer and downstream path. | T_process/T_journey/T_fresh, breach percentage or count, W002, low-traffic policy. |
| **Alert-003** | Reconciliation mismatch/aged-unmatched backlog or independent correctness failures breach approved tolerance. | Metric-008, Metric-009 | Service/data owner: investigate source-of-truth, reconciliation cutoff, corrections and approved replay. | Mismatch count/rate, cutoff, coverage floor, W003 and governance escalation. |
| **Alert-004** | Confirmed unintended duplicate side effects or idempotency regression exceed approved business-impact condition. | Metric-010, Metric-114 | Service owner: inspect idempotency records, replay behavior and containment. | Duplicate definition, count threshold, W004 and severity by business risk. |

## 5. Layer 2 — Application behavior

**Question:** Does the service process requests, domain commands and asynchronous work according to its contract?

### 5.1 Indicators and measurement contracts
| ID | Indicator | Applies when | Measurement contract | Decision / objective |
|---|---|---|---|---|
| **Metric-101** | API availability | Exposed API | Good = eligible ingress requests receiving a contract-acceptable result; denominator = all eligible ingress attempts at the chosen service boundary, including server faults and timeouts. Define expected 4xx/validation outcomes; a failed gateway response must not disappear from service visibility. | Approve ingress boundary, route grouping, classification, target and window. Metric-104 is diagnostic, not a second availability SLO. |
| **Metric-102** | API request volume and outcomes | Exposed API | Request-attempt counts by bounded normalized route, operation, service, environment and outcome class. Ensure outcome categories are mutually exclusive; expected business rejections are reported explicitly. | Tracking and expected-traffic baseline; no independent SLO. |
| **Metric-103** | API latency and deadline compliance | Exposed API | Latency SLI good = eligible ingress requests with contract-acceptable response within T_api / all eligible ingress requests whose observation is final; failures/timeouts are not silently dropped. Show p50/p95/p99 of observed duration separately, with their measurement scope stated. | Approve T_api, objective/window and precedence with availability; avoid double paging. |
| **Metric-104** | API server failure rate | Exposed API | Distinct service/server failure attempts / all eligible ingress attempts, using the *same population* as Metric-101. Timeouts are classified once in outcome counts even when they count as availability failures. | Diagnostic root-cause measure for Metric-101; no duplicate standalone SLO unless explicitly approved. |
| **Metric-105** | API timeout rate | Exposed API | Requests exceeding the defined response timeout / all eligible ingress attempts. Identify gateway, application and downstream timeout boundary and source; timeout is a subset of failed availability, not an additional request. | Approve timeout boundary and diagnostic threshold; do not sum with Metric-104 to infer unique failures. |
| **Metric-106** | Command and aggregate health | Command/domain model | Count commands accepted, succeeded, rejected by contract, failed unexpectedly and retried; track domain aggregate transitions and invariant violations. Each logical command and each attempt use separate identifiers. | Approve domain state taxonomy, required events and anomaly triggers. |
| **Metric-107** | Outbox lifecycle and backlog | Transactional outbox | Track committed records by pending, claimed, retrying, successfully published and permanently failed status; show oldest pending age and retry counts. Reconcile records to immutable outbox identifiers. | Approve stale/failed state definitions, queue aging and review thresholds. |
| **Metric-108** | Outbox publication freshness | Transactional outbox | Good = committed eligible outbox records confirmed published within T_outbox / records whose publication deadline matured. Failed, unpublished and late records are bad; count logical records rather than attempts. | Approve outbox start/ack events, T_outbox and SLO applicability. |
| **Metric-109** | Event publication success | Event publisher | Successfully accepted logical publications / all eligible logical publications due for a final outcome; retries are attempt diagnostics, not extra eligible publications. Separate broker acceptance from downstream consumption. | Approve broker/target acceptance semantics and whether a distinct SLO adds value beyond Metric-108. |
| **Metric-110** | Event publication latency | Event publisher | Distribution of elapsed time from durable event readiness to confirmed broker acceptance; optionally compute on-time publications over due logical events. Use only when boundary differs usefully from Metric-108. | Approve source timestamp, ack timestamp and any distinct latency objective. |
| **Metric-111** | Consumer processing success | Message consumer | Eligible logical messages applied successfully by the agreed finalization cutoff / all eligible logical messages due for disposition; include messages failed after retries and dead-lettered. Count delivery attempts separately. | Approve successful business application, finalization cutoff and optional reliability objective; Metric-205 measures speed. |
| **Metric-112** | Consumer processing health | Message consumer | Received, processed, retried, rejected, deduplicated and dead-lettered attempts/counts, along with concurrency and attempt duration. Keep logical message outcomes distinct from attempts. | Approve retry policy, failure classes and saturation thresholds. |
| **Metric-113** | Dependency failure rate | Downstream dependency | Unexpected downstream failures and timeouts / eligible downstream attempts, grouped by approved dependency and operation. Report expected rejections and fallback outcomes separately. | Approve dependency boundaries, tolerated errors and resilience threshold. |
| **Metric-114** | Idempotency correctness | Idempotent operation | Correct behavior for eligible duplicate/replay test cases / all eligible repeated-operation cases; also record unintended side effects. Distinct from production duplicate outcome rate Metric-010. | Approve idempotency contract and deterministic replay tests. |
| **Metric-115** | Schema validation failures | Message schema validation | Invalid, incompatible or unparseable received eligible messages / all eligible received messages at ingress; missing schema/version is a failure category rather than an exclusion. | Approve version compatibility rules, rejections and investigation threshold. |
| **Metric-116** | Scheduler deadline attainment | Scheduler | Scheduled occurrences successfully finished before their approved job deadline / all expected occurrences whose deadline matured; includes absent, missed-start and failed occurrences. | Approve schedule, calendar, timezone, holidays, maintenance exclusions and job deadline. |
| **Metric-117** | Reconciliation run reliability | Reconciliation job | Expected reconciliation runs completed with a valid result by cutoff / all due scheduled runs, including missed and incomplete runs. Metric-008 separately assesses matching accuracy of the records. | Approve calendar, cutoff, run success criteria and exception backlog policy. |

### 5.2 Dashboards
| ID | View | Related metric IDs | Required content | Investigation / test |
|---|---|---|---|---|
| **Dashboard-101** | API reliability | Metric-101, Metric-102, Metric-103, Metric-104, Metric-105, Metric-501 | Requests, mutually exclusive status classes, server faults, timeouts, p50/p95/p99, request-based deadline attainment and SLO budget. | Filter by normalized operation/environment; select failure → correlated trace/dependency. |
| **Dashboard-102** | Commands and domain behavior | Metric-106, Metric-113, Metric-114, Metric-115 | Accepted/rejected commands, invariants, dependency failures, schema violations and idempotency test failures. | Command failure → business event and affected downstream operation. |
| **Dashboard-103** | Outbox and publication | Metric-107, Metric-108, Metric-109, Metric-110, Metric-203, Metric-207 | Outbox state/oldest age, timely publication, eventual publication results, stream lag and routing errors. | Stuck record → publisher attempts, event destination and source transaction. |
| **Dashboard-104** | Consumers and queues | Metric-111, Metric-112, Metric-113, Metric-114, Metric-115, Metric-204, Metric-205, Metric-206 | Logical consumer outcomes vs attempts, retry rates, processing deadlines, visible/in-flight backlog and DLQ arrival. | Queue or DLQ → message group, failure type, owner and safe replay runbook. |

### 5.3 Alert requirements
| ID | Trigger contract (parameterized) | Metric IDs | Responsible response | Approval needed before activation |
|---|---|---|---|---|
| **Alert-101** | Independent availability probe or known-expected ingress fails critically while ordinary SLO calculation is delayed or not usable; avoid the same trigger as Alert-501. | Metric-101, Metric-102, Metric-311 | Service on-call: validate customer reachability and monitoring pipeline; join existing incident if correlated. | Probe coverage, expected-traffic test, hard-outage threshold, W101 and suppression rule. |
| **Alert-102** | API diagnostic symptom breach: latency, server-failure, timeout or downstream-dependency condition exceeds its diagnostic threshold and is not already explained by a higher-priority incident. | Metric-103, Metric-104, Metric-105, Metric-113 | Service on-call: inspect affected route, dependency, deployment and traced failure. | Per-operation threshold, W102, low traffic and nonduplicate paging policy. |
| **Alert-103** | Outbox unpublished/late records or stuck backlog breach outbox-specific age/deadline threshold. | Metric-107, Metric-108 | Publishing service on-call: inspect commit-to-relay flow, attempts and storage state. | Oldest-age, late-record rate/count, W103 and escalation threshold. |
| **Alert-104** | Publication acknowledgement failure, retry exhaustion or EventBridge delivery failure exceeds approved transport contract. | Metric-109, Metric-110, Metric-207 | Publisher/integration on-call: inspect target, routing rules, permission and retry destination. | Publication status source, retry exhaustion, W104 and overlap suppression with Alert-103. |
| **Alert-105** | Finalized logical consumer failures, repeated schema rejection or materially elevated processing retries breach consumer condition. | Metric-111, Metric-112, Metric-113, Metric-115 | Consumer-service on-call: inspect poison messages, dependency failures and schema compatibility. | Failure count/rate, W105, per-message finalization and overlap policy with queue backlog. |
| **Alert-106** | Expected scheduled occurrence fails/misses completion deadline or reconciliation run is missing/invalid. | Metric-116, Metric-117 | Job owner: validate trigger, execution, inputs and approved recovery procedure. | Job calendar, deadline, excluded maintenance, W106 and severity. |

## 6. Layer 3 — Infrastructure health

**Question:** Are the platform components supporting the actual service workload healthy? AWS signals are **diagnostic**, and native metrics must not be assumed to represent logical business success or accurate per-message completion.

### 6.1 Indicators and measurement contracts
| ID | Indicator | Applies when | Measurement contract | Decision / objective |
|---|---|---|---|---|
| **Metric-201** | Lambda execution health | AWS Lambda | Invocation, error, throttle, duration and concurrent-execution signals, with cold starts/timeout subcategories when instrumented; verify the native availability and dimensions of each signal. Avoid counting one timeout twice. | Set service impact thresholds, deployment context and source validation. |
| **Metric-202** | DynamoDB operation health | DynamoDB table | Throttled requests, latency, consumed capacity and request failures. Report conditional-check failures separately; expected conditional rejections are application outcomes, not evidence of database unavailability. | Approve capacity/latency policies and abnormal-conditional-failure classification. |
| **Metric-203** | DynamoDB Streams processing health | DynamoDB Streams consumer | Observe iterator age and stream consumer errors/failed batches; processed-record counts, checkpoint progress and delivery correctness require verified consumer instrumentation. | Approve lag/recovery thresholds and source availability per component. |
| **Metric-204** | SQS backlog and queue state | SQS queue | Visible, in-flight and delayed message estimates, oldest-visible-message age and backlog trends. AWS queue metrics are approximate; oldest age may omit repeatedly retried poison messages and must not be treated as the exact end-to-end SLI. | Approve backlog risk thresholds by queue, traffic pattern and DLQ state. |
| **Metric-205** | SQS processing deadline attainment | SQS consumer with message-level correlation | Good = eligible logical messages successfully applied/acknowledged within T_queue of original enqueue / all eligible logical messages whose deadline matured. Include unprocessed, failed, expired and dead-lettered messages according to the agreed contract; requires application correlation. | Approve original enqueue timestamp, meaning of success, T_queue, retries and missing-message reconciliation. |
| **Metric-206** | Dead-letter queue health | DLQ | DLQ arrivals, visible depth, growth and processing disposition. Distinguish time in DLQ from original message age; original age requires preserved application metadata. | Approve zero-tolerance versus threshold policy, retention and controlled redrive rules. |
| **Metric-207** | EventBridge delivery health | EventBridge rule/bus/scheduler | Applicable rule/bus/scheduler invocation, failure, throttle and retry signals; validate metric availability by EventBridge component and supplement with producer/consumer outcome measurements. | Approve supported service scope and failed-delivery ownership. |
| **Metric-208** | AWS quotas and cross-account access | AWS quota or cross-account dependency | Supported quota-utilization measures and failed/successful authorized cross-account operations; when a quota or permission does not expose a metric, use an approved diagnostic audit/test signal rather than invent a service metric. | Approve per-resource quota watch, integration probes and responsibility. |

### 6.2 Dashboard
| ID | View | Related metric IDs | Required content | Investigation / test |
|---|---|---|---|---|
| **Dashboard-201** | AWS infrastructure and integration | Metric-201, Metric-202, Metric-203, Metric-204, Metric-205, Metric-206, Metric-207, Metric-208 | Applicable Lambda, DynamoDB, Streams, SQS, DLQ, EventBridge and quota signals with resource-to-service mapping. | Resource anomaly → affected operation and incident context; no nonexistent resources. |

### 6.3 Alert requirements
| ID | Trigger contract (parameterized) | Metric IDs | Responsible response | Approval needed before activation |
|---|---|---|---|---|
| **Alert-201** | Sustained Lambda throttling, errors, high duration or other verified execution-health condition. | Metric-201 | Function/service on-call: inspect concurrency, changes and related business/API impact. | Service-specific thresholds, W201 and fault-correlation suppression. |
| **Alert-202** | DynamoDB capacity throttling or application stream lag persists above service-specific risk tolerance. | Metric-202, Metric-203 | Storage/consumer owner: inspect capacity/partition pressure and consumer progress. | Throttle/lag threshold, W202 and expected-conditional-failure exclusion. |
| **Alert-203** | Queue backlog exceeds workload-derived limit or message completion deadline breaches, without duplicating consumer failure incident. | Metric-204, Metric-205 | Queue/consumer on-call: investigate drain rate, consumer availability and oldest logical message. | Backlog/lag threshold, W203, traffic seasonality and incident grouping. |
| **Alert-204** | Critical DLQ receives an unexpected item or sustained arrival/growth exceeds accepted policy. | Metric-206 | Consumer service on-call: protect retained messages, diagnose and follow controlled redrive. | Zero-tolerance services versus allowed count, W204 and redrive authorization. |
| **Alert-205** | Capacity/quota approaches service budget or cross-account call authorizations fail persistently. | Metric-208 | Platform + integration owner: inspect quotas, access policies and cross-account route. | Quota threshold, failure criteria, W205 and fallback route. |

## 7. Layer 4 — Traceability and diagnostics

**Question:** Can an authorized engineer trace the complete causal story for a transaction and tell when monitoring itself is unreliable?

### 7.1 Indicators and measurement contracts
| ID | Indicator | Applies when | Measurement contract | Decision / objective |
|---|---|---|---|---|
| **Metric-301** | Trace-context handoff integrity | Instrumented boundary | Controlled cross-boundary test handoffs preserving valid W3C context / eligible tested handoffs; report boundary-specific failures. Production estimates require known instrumentation/sampling population. | Approve carriers, required spans and regression test target. |
| **Metric-302** | Diagnostic investigation success | Operational diagnostic scenario | Controlled incidents/test journeys that can be located and explained through permitted identifiers, traces and relevant diagnostics / all eligible investigation test cases. Record search time separately. | Approve test scenarios, time-to-find requirement and representative data. |
| **Metric-303** | Correlation identifier continuity | Correlation-required boundary | Eligible test handoffs preserving stable, sanctioned correlation ID / all eligible tested handoffs requiring this ID. Correlation ID is distinct from trace/span identifiers. | Approve identifier creation, lifecycle and allowed carriers. |
| **Metric-304** | Business-journey correlation | Business journey | Test business journeys resolvable to sanctioned business/aggregate identifiers in permitted trace or logs / eligible tested journeys. Do not place raw transaction/user identifiers in high-cardinality metric attributes. | Approve privacy-safe identifier approach and lookup coverage. |
| **Metric-305** | Trace availability and coverage | Tracing-enabled test journey | Controlled test transactions producing a searchable, usable trace / controlled eligible test transactions. Production sampled traffic must be reported with the sampling strategy, not treated as failed instrumentation. | Approve usable-trace criteria and sampling-aware validation method. |
| **Metric-306** | Trace completeness | Observed trace/test scenario | Observed, eligible test traces containing required spans or valid linked asynchronous segments / all observed test traces in the defined test cohort. | Approve required stage map, missing-stage test and handling of spans dropped in export. |
| **Metric-307** | Asynchronous trace linkage | Async messaging | Eligible controlled messaging handoffs with demonstrably linked origin/consumer segments using approved propagation and span links / all eligible tested async handoffs. Include batches, retries and redrives. | Approve context-carrier/version policy and test matrix. |
| **Metric-308** | Telemetry ingestion/search delay | Telemetry pipeline | Measured searchable timestamp minus event occurrence timestamp for controlled samples; validate clock synchronization and report missing samples separately, never as zero delay. | Approve measurement method, lag threshold and no-data policy. |
| **Metric-309** | Diagnostic event completeness | Diagnostic event contract | Expected required diagnostic events present and searchable for validated test cases / required expected events from the scenario manifest. Extra log volume does not imply completeness. | Approve mandatory event manifest and automated checks. |
| **Metric-310** | Trace sampling-policy compliance | Tracing/sampling policy | Retained/traceable controlled test cases by approved sampling category relative to expected cases; distinguish head sampling, downstream sampling and ingestion loss. | Approve sampling priority, budget, policy exceptions and evidence. |
| **Metric-311** | Telemetry delivery integrity | Telemetry pipeline | Where instrumentation provides counters: accepted/exported/rejected/dropped telemetry batches or signals; loss rate = known rejected/dropped ÷ known attempted delivery. Unknown missing upstream signals must be flagged as unknown, not zero. | Approve pipeline observability, delivery-health thresholds and platform owner. |
| **Metric-312** | Sensitive-data observability controls | All telemetry producers and stores | Controlled tests for prohibited data in logs, spans and metric attributes; violations recorded as policy findings with separate security incident handling. Never use production sensitive values as test fixtures. | Approve sensitive-field policy, scanners, prevention controls, retention and security response. |

**Design correction:** The original combined telemetry integrity with sensitive-data handling. This version retains **Metric-311 for delivery health** and adds **Metric-312 for security/privacy controls**. These require different owners, detection rules and responses; this is a deliberate expansion from 52 to 53 indicators.

### 7.2 Dashboards
| ID | View | Related metric IDs | Required content | Investigation / test |
|---|---|---|---|---|
| **Dashboard-301** | Trace continuity | Metric-301, Metric-303, Metric-304, Metric-305, Metric-306, Metric-307, Metric-310 | Propagated vs broken context by boundary, coverage under controlled tests, complete stages and link validity. | Broken handoff → specific sampled scenario, carrier and missing boundary. |
| **Dashboard-302** | Diagnostic quality and telemetry | Metric-302, Metric-308, Metric-309, Metric-310, Metric-311, Metric-312 | Investigation success, ingestion delay, expected diagnostic events, sampling compliance, export losses and security policy findings as separate panels. | Known failed trace/fixture → searchable evidence; sensitive findings route to restricted view. |

### 7.3 Alert requirements
| ID | Trigger contract (parameterized) | Metric IDs | Responsible response | Approval needed before activation |
|---|---|---|---|---|
| **Alert-301** | Controlled propagation probe finds regression or repeated production context failures against approved baseline. | Metric-301, Metric-303, Metric-307 | Engineering/platform owner: locate carrier or missing messaging link; non-page by default. | Test cohort, percentage floor, W301; page only if it blocks active incident response. |
| **Alert-303** | Known telemetry export drops/ingestion lag or no-data health check exceeds approved pipeline condition. | Metric-308, Metric-311 | Observability platform owner: restore collection/export; mark affected SLIs unknown until validated. | Loss count/rate or delay, W303, outage detection and no-data escalation. |
| **Alert-304** | Sensitive-data control detects a prohibited telemetry field/value pattern or a confirmed inappropriate exposure. | Metric-312 | Security owner: restrict access, contain and investigate using approved data incident process. | Security finding taxonomy, secure routing, response SLA and authorized test evidence. |

**Action-302 — scheduled diagnostics quality review (not an alert):** Assess Metric-302, Metric-305, Metric-306, Metric-308, Metric-309 and Metric-310 through canary tests, dashboard inspection and a periodic work item. This action **replaces the original non-paging `Alert-302` entry** so the alert inventory contains only conditions that produce a real operational or governance notification. It has no on-call route by default.

## 8. Layer 5 — Reliability management

**Question:** Are approved objectives being met, and are incident response and measurement quality improving?

### 8.1 Indicators and measurement contracts
| ID | Indicator | Applies when | Measurement contract | Decision / objective |
|---|---|---|---|---|
| **Metric-501** | Approved SLO attainment and error budget | Approved SLO | For each approved request/event SLO: compute good/eligible attainment; allowed bad = eligible × (1 − target), consumed bad = eligible − good. For period-based SLOs use approved time-slice semantics instead. Handle missing/low-traffic independently. | Approve one authoritative SLI, window, target, exclusion policy and error-budget method per SLO. |
| **Metric-502** | Error-budget burn alert policy | Approved SLO with burn policy | Derive fast/slow burn from approved SLO budget consumption with explicitly selected short/long evaluation windows and minimum sample/data-quality gates; this is a *policy on Metric-501*, not a second SLI. | Approve window pairs, burn thresholds, action levels and canonical alert rule. |
| **Metric-503** | SLO breach history | Approved SLO | Count distinct SLO breach episodes and their elapsed duration in a review period using stable breach-open/close rules; never count every alarm evaluation as a new incident. | Approve time-to-clear and historical review cadence. |
| **Metric-504** | SLO governance coverage | SLO governance | Report separately: SLOs with valid telemetry / applicable approved SLOs; SLOs with named owners / approved SLOs; SLOs reviewed on schedule / due reviews. Never blend them into one percentage. | Approve coverage floors, responsible roles and review cadence. |
| **Metric-505** | Incident detection and recovery | Incident-management process | For eligible incidents: onset→detection and onset→recovery durations, with detection→response optionally tracked; specify priority, clock, owner and resolution semantics. | Approve the incident population, timestamp policy and retrospective goals. |
| **Metric-506** | Alert actionability and noise | Alert-management process | Reviewed actionable alerts / eligible evaluated alerts; additionally report duplicate pages, false positives, false negatives discovered by reviews, and missed escalation. | Approve sample method, ownership and non-paging improvement threshold. |

### 8.2 Dashboards
| ID | View | Related metric IDs | Required content | Investigation / test |
|---|---|---|---|---|
| **Dashboard-501** | SLO and error-budget scorecard | Metric-501, Metric-502, Metric-503, Metric-504 | Approved objectives, observed attainment, allowed/consumed error budget, fast/slow burn, breach history and separately reported governance coverage. | SLO → canonical query, applicable service/journey, budget detail and action runbook. |
| **Dashboard-502** | Incident and alert quality | Metric-505, Metric-506 | Detection and recovery distribution, incident severity, duplicate pages, actionable rate, routing and runbook coverage. | Incident/alert → case review, owning team and improvement action. |

### 8.3 Alert requirements
| ID | Trigger contract (parameterized) | Metric IDs | Responsible response | Approval needed before activation |
|---|---|---|---|---|
| **Alert-501** | Canonical approved service SLO fast/slow error-budget burn policy is crossed on valid source data. | Metric-501, Metric-502 | Service on-call/SRE: follow the relevant SLO incident policy; this is the authoritative SLO-budget page. | Target, short/long windows, burn threshold, samples, no-data, severity and route. |
| **Alert-502** | Approved SLO lacks data quality, an accountable owner or due review beyond governance tolerance. | Metric-504 | SRE/platform governance: assign owner or repair data; governance notification, not a default on-call page. | Coverage floor, governance window, ticket route and exception expiry. |
| **Alert-503** | Incident response or alert noise degrades beyond agreed operational baseline. | Metric-505, Metric-506 | SRE/service operations: improvement backlog and periodic review, not immediate paging by default. | Incident cohort, actionability floor, review period and owner. |

## 9. Operational rules across all five layers

### 9.1 Dashboard-to-alert-to-owner consistency

- **One definition:** Every metric ID names one authoritative contract. A dashboard references that ID rather than defining a new or silently conflicting formula.
- **One SLO-budget page:** Alert-501 is the canonical error-budget page. Alert-001 detects absence of expected business completions; Alert-101 detects independent hard API reachability failure where normal SLO evaluation may be unavailable; Alert-102 reports distinct diagnostic conditions. Deduplication joins correlated notifications into **one incident per common root cause**.
- **Symptom versus cause:** Infra, consumer and business alerts may observe the same outage. Suppression is only permitted when the higher-level incident remains visible and routed, and the lower-level signal stays available for diagnosis.
- **No-data separation:** Lack of telemetry must trigger pipeline/data-quality handling (Alert-303, Metric-311), not a false SLO success or application outage. An independent health check may still establish a real outage.
- **Non-paging quality work:** Action-302 and governance Alert-502/Alert-503 are default ticket/review actions. Any exception for paging requires approved operational justification.
- **Runbook coverage:** Every active page must identify owning rotation, evidence URL/search procedure, safe mitigation options, escalation and recovery confirmation.

### 9.2 Alert configuration schema (mandatory before activation)

| Field | Required rule |
|---|---|
| Alert ID / affected service | Stable catalog ID, service/environment, critical user journey and owner |
| Detection expression | Exact threshold and mathematical direction; denominator where ratio; source-query version |
| Evaluation | Window `W`, number of required breaching points, data freshness, missing-data and low-traffic behavior |
| Priority and page policy | P1/P2/etc **only after organization policy approval**, severity by measured impact, no duplicate pages |
| Correlation/deduplication | Incident grouping key, suppressor/child rules and aggregation interval |
| Response | Owner, destination, runbook, validation steps, safe mitigation and escalation |
| Verification | Passing normal, breach, restored, no-traffic, missing-telemetry and replay test cases |

Every `W###` parameter in an alert table is **unapproved** and must be assigned from an explicit alert configuration record. It is a named decision dependency, not a hidden default threshold. Hard-failure conditions that require fast response must define their own short evaluation independent of any SLO window.

### 9.3 Prioritized cross-layer incident mappings
| Incident journey | Customer outcome / SLO | Supporting metrics | Primary dashboard | Canonical alert / deduplication |
|---|---|---|---|---|
| API availability breach | Metric-101 and approved Metric-501 | Metric-102, Metric-104, Metric-105, Metric-113, Metric-201, Metric-311 | Dashboard-101, Dashboard-501 | Alert-501 for SLO burn; Alert-101 for independently detected hard reachability; group into one incident |
| Business journey stalls | Metric-001, Metric-002 or Metric-003; Metric-006 when view freshness matters | Metric-004, Metric-107, Metric-108, Metric-109, Metric-110, Metric-111, Metric-112, Metric-204, Metric-205 | Dashboard-001, Dashboard-103, Dashboard-104 | Alert-001 or Alert-002 based on distinct trigger; join correlated transport incidents |
| Outbox commit succeeds; no publish | Metric-108 for deadline; Metric-109 for confirmed publication | Metric-107, Metric-110, Metric-203, Metric-207 | Dashboard-103 | Alert-103 for stuck outbox; Alert-104 for publication/routing, deduplicated |
| Queue backlog and retries | Metric-111 for final consumer success, Metric-205 for queue completion deadline | Metric-112, Metric-115, Metric-204, Metric-206 | Dashboard-104, Dashboard-201 | Alert-203 backlog; Alert-105 consumer failure; Alert-204 DLQ, grouped by affected workload |
| Incorrect or duplicate business result | Metric-008, Metric-009, Metric-010 | Metric-114, Metric-115, Metric-117 | Dashboard-001, Dashboard-002 | Alert-003 accuracy or Alert-004 duplicate side effect; distinct business impact |
| Broken async correlation | Metric-301, Metric-303, Metric-307 plus trace quality | Metric-302, Metric-305, Metric-306, Metric-308, Metric-311 | Dashboard-301, Dashboard-302 | Alert-301 or Action-302; use Alert-303 only for actual telemetry loss |
| SLO budget exhausted too quickly | Metric-501 with Metric-502 policy | Metric-503, Metric-504, Metric-505, Metric-506 | Dashboard-501, Dashboard-502 | Alert-501 only for error-budget paging; underlying fault alerts are symptoms |

### 9.4 Representative end-to-end scenario

`API request → command/aggregate → committed business outcome → durable outbox → publication → event broker/queue → consumer → downstream business view → reconciliation (when applicable)`.

A controlled test must preserve an authorized stable journey identifier, compatible trace context or links for each relevant async hop, and distinct IDs for event creation, processing attempts and final outcomes. Inject a success, failure, retry, delayed completion, duplicate/replay and never-completed transaction. Validate that:

1. Each logical customer journey changes the business denominator **once**, even if retried.
2. Metric-002 records local processing time while Metric-003 records the longer customer-visible journey **only when those boundaries differ**.
3. Metric-108 includes records not published by the deadline; Metric-109 uses eventual publication outcome with a separately defined cutoff.
4. Metric-111 counts final application outcome; Metric-205 records whether that outcome met the queue-to-completion deadline, and neither is derived solely from approximate queue age.
5. Traces are searchable under the approved sampling policy; missing spans, trace links, telemetry and sensitive values are assessed independently.
6. SLO status, alerts, dashboard widgets and incident evidence agree with one approved calculation.

## 10. Acceptance evidence and delivery governance

### 10.1 Service-level requirement record

Each onboarded service must publish the following versioned record (format may be YAML, Markdown or an approved service catalog):

| Required field | Expected content |
|---|---|
| Service and business owner | Service ID, environment, support rotation, owning business capability |
| Application profile | API, consumer, outbox, scheduler, reconciliation and infrastructure capabilities actually used |
| Applicability | Each applicable catalog Metric ID, Dashboard ID, Alert ID; non-applicable items with reason |
| SLO approvals | Journey, SLI formula/query, source, target, window, exclusions, approver and effective version |
| Alert approvals | Alert ID, threshold, window, route, no-data, severity, runbook and dedup rules |
| Diagnostic model | Required spans, log/event names, trace/correlation carriers, controlled test cohort |
| Telemetry controls | Retention, allowed fields, restricted search, sampling, budget, pipeline-health test |
| Verification | Evidence links, passed scenarios, deployment revision, last test, open exceptions |

### 10.2 Production-readiness verification

| Gate | Pass criterion | Accountable sign-off |
|---|---|---|
| **G1 — Requirements** | Business boundaries, indicator applicability, outcome rules and deadline decisions are explicit | Business owner + service owner |
| **G2 — Definitions** | All proposed production SLIs reproduce known correct results under success, late, failure, retry, zero traffic and no-data fixtures | Service engineering + SRE |
| **G3 — Traceability** | Representative multi-stage test and async boundaries produce searchable, linked diagnostics; sampling expectations documented | Engineering + observability owner |
| **G4 — Dashboards** | Required dashboards render appropriate values, units, filters, owner, last-data state and drill-down; absent capabilities show N/A | Service operations |
| **G5 — Alert routing** | Normal, critical, suppressed duplicate, restored, no-data and slow-burn cases route to the expected owner/runbook | SRE + operations |
| **G6 — Privacy/overhead** | Sensitive-data tests, access restrictions, telemetry overhead and volume/cost projection pass review | Security + platform |
| **G7 — Operability** | Deployment, upgrade, reversal and source failure have documented procedures; monitoring loss is visible | Platform + service owner |
| **G8 — Pilot/rollout** | One representative journey is validated end-to-end; adopted services retain versioned acceptance evidence | Architecture + delivery lead |

An untested proposed metric is **not** recorded as implemented. An approved business requirement may remain `Pending implementation` until tested. An exception requires an owner, reason, compensating control, expiry date and review decision.

### 10.3 Delivery sequence

| Gate | Deliverable | Exit condition |
|---|---|---|
| 1. Define | Approved core/conditional catalog, customer journeys, thresholds pending list, reference event contracts | Architecture and business agree on definitions |
| 2. Demonstrate | Instrumented representative API and async business journey; golden fixtures and recorded failures | Metrics, trace path, key dashboards and sample alerts agree |
| 3. Automate | Reusable configuration, test contracts, deployment controls and security checks | A second service can adopt without manual reconstruction |
| 4. Operate | Owners, runbooks, incident dedup, governance cadence and exception workflow | Operations accepts platform/service handoff |
| 5. Extend | More service profiles and incremental business objectives | Each new profile passes the same gates |

### 10.4 Explicit decision register (no assumed approvals)

| ID | Decision required | Proposed accountable reviewers | Evidence needed | Status |
|---|---|---|---|---|
| **DEC-01** | Approve critical journeys and expected traffic schedules | Business + service owner | Journey map, outcome taxonomy, customer impact | **Pending** |
| **DEC-02** | Approve mandatory and conditional metric applicability by application profile | Architecture + service owners | Workload/profile matrix and exceptions | **Pending** |
| **DEC-03** | Finalize SLO targets, event eligibility, deadlines, windows and low-traffic rules | Business + SRE | Baseline data and approved business tolerances | **Pending** |
| **DEC-04** | Select authoritative source/query for each SLO and correct missing-data treatment | Architecture + observability owner | Golden data result comparison across candidates | **Pending** |
| **DEC-05** | Approve alerts: parameterized trigger, urgency, owner, route and deduplication | SRE + service operations | Controlled alert validation and runbook | **Pending** |
| **DEC-06** | Approve telemetry signal contract, propagation, identity and sampling | Platform + engineering + security | Cross-language async trace and privacy tests | **Pending** |
| **DEC-07** | Select tool/combination following feasibility matrix and cost/overhead comparison | Architecture + platform + product | Identical pilot evidence for each shortlisted pattern | **Pending** |
| **DEC-08** | Approve rollout, supported runtime matrix, exceptions and operational handoff | Delivery lead + service operations | Pilot sign-off and versioned onboarding checklist | **Pending** |

**Interpretation:** The specification is **complete as a proposed requirements catalog and review process**, not as a production configuration. A missing approval is visible in this register and does not imply arbitrary values can be selected by an implementation tool or AI agent.

## 11. Architecture review and AI validation safeguards

AI assistants, code generators and human reviewers must apply the same controls:

1. Do not infer `Existing`/`New` or deployment status from a source example.
2. Do not silently create numerical SLOs, burn thresholds, windows, business exclusions, platform assignments or paging destinations.
3. Use catalog IDs exactly; do not invent a metric because a view mentions a failure symptom.
4. Validate that every dashboard or alert references defined metric IDs; retain one formula and source for each approved SLI.
5. Keep request-based, time-slice-based and diagnostic computations distinct.
6. Distinguish successful *logical* operations from retries/attempts and from downstream delivery stages.
7. Do not treat expected conditional-write rejection, expected HTTP client rejection or voluntary cancellation as a failure without an explicit business contract.
8. Use controlled synthetic traces/fixtures where sampling prevents an exact population coverage calculation.
9. Detect unsupported tooling claims, missing AWS resource dimensions, and security-sensitive identifiers before rollout.
10. Fail review with a named exception/decision when evidence is unavailable; do not generate a green status from missing telemetry.

### 11.1 Catalog inventory and intentional changes from the draft

| Collection | Current count | Notes |
|---|---:|---|
| Business indicators | 10 | Metric-001–010 |
| Application indicators | 17 | Metric-101–117 |
| Infrastructure indicators | 8 | Metric-201–208 |
| Traceability/diagnostic indicators | 12 | Metric-301–312; split former Metric-311 responsibilities |
| Reliability/governance indicators | 6 | Metric-501–506 |
| **Total canonical indicators** | **53** | No `Type` column; no `Existing/New` status |
| Dashboard definitions | 11 | 2 business, 4 application, 1 infrastructure, 2 tracing, 2 reliability |
| **Alert/notification contracts** | **21** | Former Alert-302 becomes independent Action-302; Alert-304 handles security |
| Non-paging diagnostic actions | 1 | Action-302, separate from alerts |

The source PDF contained **52** indicators and **21** entries under alerts, including a non-alert quality action and a combined security/telemetry metric. The corrected inventory has **53** separate indicators, **21** real alert/notification definitions and **1** diagnostic action. Original IDs are retained wherever possible, with additions/renaming explicitly identified.

## 12. Tool evaluation and feasibility — decision appendix only

**No monitoring/SLO product has been selected.** Tool choices must be tested against the *approved* metric, dashboard and alert contracts, not vice versa. AWS CloudWatch, CloudWatch Application Signals, X-Ray, Dynatrace and Nobl9 serve different purposes; Nobl9 in particular is an SLO-management layer rather than a full distributed-tracing backend.

### 12.1 Candidate capability mapping

| Capability required | AWS-native stack | Dynatrace | Nobl9 |
|---|---|---|---|
| AWS infrastructure metrics/logs/alarms | Native AWS resource measurements and CloudWatch alarms/dashboards; verify dimensions per resource | AWS monitoring integration and diagnostics; verify account permissions/feature entitlement | Consumes data from monitored source; **not** native AWS signal generation |
| API latency, volume, availability, failure views | Application Signals and CloudWatch metrics/diagnostics; instrumentation and supported runtimes must be confirmed | Application monitoring and custom queries/visuals after supported instrumentation | Can evaluate an SLO from an available connected SLI source; not complete API troubleshooting |
| Business transaction success, deadlines and data correctness | Custom domain measurements and validated CloudWatch queries/metrics required | Custom domain events/metrics/logs and validated queries required | A connected reliable source must calculate or expose the business SLI |
| Outbox, publisher, consumer and queue journeys | AWS signals **plus** application logical-outcome/correlation measurements | Ingest application signals and traces; logical outcomes still require app semantics | SLO management of trustworthy upstream outcomes, not instrumentation |
| Cross-async tracing and searchable diagnostics | X-Ray/CloudWatch-supported trace paths and selected instrumentation; full boundaries must be piloted | Distributed tracing with context/async support; validate tenant and runtime | Not a primary trace store or APM workbench |
| SLO attainment and error-budget monitoring | CloudWatch Application Signals includes SLOs and burn-rate alarms; **verify custom business SLI and window fit** | Custom SLO definitions/query capabilities; verify input type, query cost and policy fit | Core SLO/error-budget/policy role; verify each data source and polling behavior |
| Required business, diagnostic and reliability dashboards | CloudWatch dashboards/Application Signals; build required business views | Dashboards and SLO views; build required business views | SLO-focused reporting; does not replace all diagnostic dashboards |
| Alert routing/incident integration | Alarms/actions plus organization-approved routing; dedup requires design | Problems/automation/alert integrations; verify routes and suppression | SLO policy notifications/exports; requires defined external routing |
| Portability, governance and infrastructure automation | Strong AWS integration; cross-account/multi-region and versioning need proof | Platform APIs/integrations; validate tenancy and automation | Declarative/API-managed SLO workflow; check integration/tenant restrictions |
| Cost/latency and retention | AWS ingest, request, logs, metrics, traces, SLO and data transfer costs | Entitlement, storage/retention, ingest and runtime costs | Separate platform/integration costs; check overlap and SLI freshness |

**Interpretation:** Cells state capabilities/categories, not a vendor winner or an assertion that any feature is licensed, enabled or correctly configured in the organization. A failed proof must be recorded against the exact required catalog ID.

### 12.2 Architecture alternatives to validate

| Pattern | Candidate composition | Why to test | Primary proof needed |
|---|---|---|---|
| A | AWS-native observability + AWS-native SLO evaluation | Single cloud stack may reduce integration surface for mostly AWS services | Complex domain SLIs, async tracing, budget alarms, multi-account dashboards and cost |
| B | Dynatrace for observability + SLO evaluation | Consolidated technical diagnostics and business SLI querying may be useful | SLO query semantics, domain-event ingestion, async trace completeness and operational fit |
| C | AWS-native diagnostics + Nobl9 SLO governance | Separates AWS investigation from cross-service SLO policy | CloudWatch source queries, latency, no-data policies, ownership and paging duplication |
| D | Dynatrace diagnostics + Nobl9 SLO governance | Separates APM from central SLO reporting across teams/platforms | Dynatrace→Nobl9 source fidelity, incremental governance value and duplicated alerts |

### 12.3 Comparative proof-of-concept and scoring

Run **the same** controlled test journey, fixtures, ingress/async traffic, dashboard use cases and alert scenarios on shortlisted patterns. Record whether each supports the minimum contract **natively**, via **verified configuration**, through **additional custom development**, or **not at all**. A product that cannot meet a mandatory requirement needs an approved exception or must be excluded.

| Dimension | Proposed weight | Evidence |
|---|---:|---|
| Exact SLI and SLO calculations | 25% | Golden queries match event/period fixtures, including unfinished and no-data cases |
| Business and technical dashboards | 15% | All required widgets, drill-downs and source-of-truth representation |
| Alert evaluation and incident dedup | 15% | Breach, recovery, no-data, routing and false-duplicate tests |
| Async tracing and debugging | 15% | End-to-end recorded test including outbox, retries and consumer |
| Automation/onboarding/portability | 10% | Versioned deployment and reconfiguration on a second service |
| Security, ownership and governance | 10% | Policies, permissions, audit and exception controls |
| Total cost and runtime impact | 10% | Comparable ingest/storage/licensing/retention and overhead measurements |
| **Total** | **100%** | **Score only after evidence; all weights subject to stakeholder approval** |

**Decision rule:** Apply a mandatory-requirements pass/fail gate first. Then compare weighted scores, operational ownership, security and realistic total cost. No preference is recorded before the pilot evidence.

### 12.4 Official capability references (validation inputs; checked November 2026)

- [AWS — CloudWatch Application Signals](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Monitoring-Sections.html)
- [AWS — Application Signals SLO concepts and burn-rate alarms](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-ServiceLevelObjectives.html)
- [AWS — SQS metric approximations and oldest-message semantics](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-available-cloudwatch-metrics.html)
- [Dynatrace — Custom SLO creation and queries](https://docs.dynatrace.com/docs/analyze-explore-automate/service-level-objectives/create-slo)
- [Dynatrace — AWS Lambda monitoring](https://docs.dynatrace.com/docs/ingest-from/amazon-web-services/aws-lambda-integration)
- [Nobl9 — Supported data sources](https://docs.nobl9.com/sources/)
- [OpenTelemetry — Messaging spans and context propagation](https://opentelemetry.io/docs/specs/semconv/messaging/messaging-spans/)

**Final architecture approval remains pending** until DEC-01 through DEC-08 have the required owners and evidence, including the selected toolchain's demonstrated ability to implement the standards above.
