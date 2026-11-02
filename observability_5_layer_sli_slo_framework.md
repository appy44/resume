# Five-Layer Observability Framework — Existing and Proposed Indicators

> Based on the 12-page uploaded *Observability Framework for DDD API Pattern* and the expanded indicator catalog discussed in this conversation.
>
> **Classification note:** The PDF consists of photographs of a screen. `Existing` denotes concepts visible in that document, not an independently verified verbatim inventory. `Enhanced` means an existing concept has been made more measurable. `New` denotes a proposed addition. All numeric SLOs below are **illustrative starting points**, not universal standards.

## 1. Framework overview

| Layer | Existing layer name | Question answered |
|---|---|---|
| 1 | Business Observability | Did the business transaction succeed? |
| 2 | Application Observability | Did APIs and processing components behave correctly? |
| 3 | Infrastructure Observability | Were AWS and platform resources healthy? |
| 4 | Traceability and Diagnostics | Where did processing slow or fail? |
| 5 | Reliability Management — SLO & SLA | Did reliability meet its objective? |

### SLI, SLO, SLA, and error budget

- **SLI:** Measured service behavior, such as successful eligible requests / all eligible requests.
- **SLO:** Internal target for an SLI over a stated window, such as 99.95% over rolling 30 days.
- **SLA:** Formal service commitment; terms are contract-specific.
- **Error budget:** Allowed fraction of bad events, `1 − SLO target`.

An SLO definition should include the eligible population, good-event criteria, exclusions, measurement source, owner, evaluation window, and missing-data handling.

## 2. Layer 1 — Business Observability

**Purpose:** Measure business outcomes, independently of HTTP status codes.

| Indicator | Status | What to measure | Example SLO / treatment |
|---|---|---|---|
| Transaction started | Existing | Valid business transactions initiated | Tracking metric |
| Transaction completed | Existing | Transactions completed successfully | Tracking metric |
| Transaction failed | Existing | Transactions ending unsuccessfully | Tracking metric |
| Transaction rejected | Existing | Transactions rejected by business rules | Tracking metric |
| Transaction processing time | Existing | Initiation-to-completion time | 99% within 30 seconds |
| Business event health | Existing | Started, completed, failed, rejected events | Tracking metric |
| Business success rate | Enhanced | Successful completions / eligible transactions | ≥99.9% |
| End-to-end business latency | Enhanced | Time across processing stages | 99% within 60 seconds |
| Transaction abandonment rate | New | Transactions without terminal outcome / eligible transactions | ≤0.1% |
| Transaction timeout rate | New | Transactions exceeding deadline / eligible transactions | ≤0.1% |
| Duplicate transaction rate | New | Duplicate business outcomes / eligible transactions | ≤0.01% |
| Transaction reconciliation accuracy | New | Matching records / checked records | ≥99.99% |
| Business data correctness | New | Correct outcomes / validated outcomes | ≥99.99% |
| Business event completeness | New | Expected lifecycle events present / expected events | ≥99.9% |
| Business processing backlog | New | Transactions awaiting completion | Workload-specific alert |
| Business freshness | New | Source event to business availability delay | 99% within 5 minutes |

**Existing dashboard views:** Transactions started vs completed; failures; end-to-end latency; delayed business events.

**Add:** Success rate, timeouts, reconciliation mismatches, duplicate outcomes, and backlog age.

**Alert examples:** P1 for critical widespread transaction failures; P2 for sustained backlog or reconciliation mismatches; P3 for noncritical anomalies.

**Interpretation:** Valid business-rule rejections should not automatically count as reliability failures.

## 3. Layer 2 — Application Observability

**Purpose:** Measure APIs, applications, integrations, and processing correctness.

| Indicator | Status | What to measure | Example SLO / threshold |
|---|---|---|---|
| API request count | Existing | Incoming requests | Tracking metric |
| API success and failure | Existing | Successful, failed, rejected requests | Tracking metric |
| API response time | Existing | Request duration | 99% within 1 second |
| Application errors | Existing | Exceptions and processing failures | Tracking metric |
| Consumer health | Existing | Consumer status and failures | Operational threshold |
| Publisher health | Existing | Publication and delivery behavior | Operational threshold |
| Database operations | Existing | Database processing and errors | Operational threshold |
| Cache health | Existing | Cache operations | Operational threshold |
| API availability | Enhanced | Good eligible requests / eligible requests | ≥99.95% |
| API latency distribution | Enhanced | p50, p95, p99 latency | 99% within 1 second |
| API server error rate | New | Server failures / eligible requests | ≤0.05% |
| API timeout rate | New | Timed-out requests / eligible requests | ≤0.1% |
| Dependency failure rate | New | Failed downstream calls / eligible calls | ≤0.1% |
| API retry rate | New | Retried operations / initial operations | Diagnostic threshold |
| Circuit breaker state | New | Open, half-open, closed transitions | Alert on sustained open |
| Thread-pool saturation | New | Busy threads / available threads | Sustained capacity threshold |
| Connection-pool saturation | New | Active connections / capacity | Sustained capacity threshold |
| JVM garbage collection pause | New | Pause duration and frequency | Workload-specific |
| Memory leak indicators | New | Post-GC heap growth and allocation trends | Trend-based |
| Application startup health | New | Readiness within deadline | 99% within deadline |
| Application restart rate | New | Unexpected restarts | Operational threshold |
| Idempotency correctness | New | Correct outcomes on duplicate requests | ≥99.99% |
| Schema validation failure | New | Invalid or incompatible messages | Diagnostic threshold |
| Authentication service reliability | New | Valid authentication attempts succeeding | ≥99.95% |
| Rate-limiting correctness | New | Correct admission and throttling decisions | ≥99.99% |
| File processing success | New | Successfully processed accepted files | ≥99.9% |
| Scheduler execution reliability | New | Scheduled jobs completed by deadline | ≥99.9% |

**Existing dashboard views:** API Health, Publisher Health, Consumer Health, Database Health.

**Add:** SLO compliance, latency percentiles, dependency health, retries, timeouts, JVM pools, and job processing.

**Alerts:** P1 for critical API unavailability; P2 for sustained degradation or pool exhaustion; P3 for unusual noncritical trends.

## 4. Layer 3 — Infrastructure Observability

**Purpose:** Monitor AWS and platform resources that support the application.

| Indicator | Status | What to measure | Example threshold |
|---|---|---|---|
| Lambda invocation count | Existing | Invocations | Tracking metric |
| Lambda errors | Existing | Failed executions | Workload-specific |
| Lambda duration | Existing | Execution duration | Below timeout with margin |
| DynamoDB capacity | Existing | Read/write utilization | Capacity threshold |
| DynamoDB throttling | Existing | Throttled operations | Sustained throttling alert |
| DynamoDB stream health | Existing | Stream processing health | Operational threshold |
| SQS queue depth | Existing | Visible queued messages | Workload-specific |
| SQS dead-letter queue | Existing | DLQ messages | Unexpected arrivals alert |
| EventBridge health | Existing | Event routing and processing | Operational threshold |
| S3 processing health | Existing | Object and processing activity | Operational threshold |
| Event routing health | Existing | Routing and delivery failures | Operational threshold |
| Lambda concurrency utilization | Enhanced | Concurrency / quota | Capacity threshold |
| Lambda throttling rate | New | Throttled invocations / requests | ≤0.1% |
| Lambda cold-start latency | New | Initialization duration | Diagnostic threshold |
| Lambda timeout rate | New | Timed-out invocations / invocations | ≤0.1% |
| SQS oldest message age | New | Oldest unprocessed message age | Within deadline |
| SQS processing lag | New | Enqueue-to-completion time | 99% within 60 seconds |
| SQS DLQ growth rate | New | DLQ count increase | Sustained growth alert |
| DynamoDB latency | New | Successful request latency | Workload-specific |
| DynamoDB conditional failures | New | Conditional write failures | Unexpected increase alert |
| EventBridge delivery failures | New | Failed target invocations | ≤0.1% |
| S3 processing delay | New | Object arrival to processing | 99% within 5 minutes |
| EC2 CPU utilization | New | CPU usage | Sustained capacity threshold |
| EC2 memory utilization | New | Memory usage | Sustained capacity threshold |
| Disk utilization | New | Used storage / capacity | Capacity threshold |
| Network errors | New | Drops and connection failures | Diagnostic threshold |
| Load balancer target health | New | Healthy / registered targets | All required targets healthy |
| AWS quota utilization | New | Usage / service quota | Capacity planning |
| Infrastructure change failures | New | Failed infrastructure deployments | Operational KPI |
| Cross-account integration health | New | Successful authorized cross-account operations | ≥99.9% |

**Existing dashboard views:** Lambda, DynamoDB, Streams, SQS, EventBridge Health.

**Add:** Capacity forecasting, quota use, throttling, queue age, concurrency, and cross-account integration.

**Interpretation:** CPU and memory are generally diagnostic signals, not user-facing SLIs.

## 5. Layer 4 — Traceability and Diagnostics

**Purpose:** Follow a transaction across synchronous and asynchronous processing boundaries.

| Indicator | Status | What to measure | Example objective |
|---|---|---|---|
| End-to-end transaction trace | Existing | Full transaction path | Diagnostic capability |
| Business transaction view | Existing | Trace correlated to business operation | Diagnostic capability |
| Consumer processing view | Existing | Consumer processing in trace | Diagnostic capability |
| Async processing view | Existing | Asynchronous execution relationships | Diagnostic capability |
| Structured application logs | Existing | Investigation-ready logs | Operational requirement |
| Request tracing | Existing | API and service traces | Operational requirement |
| Correlation ID propagation | Enhanced | Events/requests carrying required IDs | ≥99.9% |
| Trace coverage | New | Eligible transactions with usable traces | Defined coverage target |
| Trace completeness | New | Traces containing required stages | ≥99% |
| Context propagation success | New | Cross-service trace context preserved | ≥99.9% |
| Async trace linkage | New | Queue/event work linked to origin | ≥99% |
| Business ID correlation | New | Traces linked to transaction IDs | ≥99.9% |
| Trace ingestion delay | New | Trace creation to searchability | 99% within 2 minutes |
| Log ingestion delay | New | Log creation to searchability | 99% within 2 minutes |
| Diagnostic event completeness | New | Expected diagnostic events available | ≥99% |
| Trace sampling effectiveness | New | Important error traces retained | Sampling policy |
| Root-cause localization time | New | Time to identify likely failing component | Operational KPI |
| Telemetry loss rate | New | Dropped / emitted telemetry | ≤0.1% |
| Sensitive-data exposure | New | Prohibited sensitive data in telemetry | Zero confirmed violations |

**Existing dashboard views:** Transaction, Business Transaction, Consumer, Async.

**Add:** Trace coverage, missing links and IDs, ingestion lag, sampling, dropped spans.

**Implementation guidance:** Use W3C Trace Context and OpenTelemetry semantic conventions where supported.

## 6. Layer 5 — Reliability Management: SLO & SLA

**Purpose:** Convert observed behavior into reliability targets and operational decisions.

| Indicator | Status | What to measure | Example objective |
|---|---|---|---|
| SLI measurement | Existing | Observed reliability | Service-specific |
| SLO target | Existing | Expected reliability | Example 99.95% |
| SLA compliance | Existing | Contractual service commitment | Contract-defined |
| Error budget | Existing | Allowed bad events/time | Based on SLO |
| Burn rate | Existing | Rate of budget consumption | Multiwindow alerting |
| Current SLO status | Existing | Objective compliance | Dashboard |
| Remaining error budget | Existing | Available reliability budget | Dashboard |
| Publication success trend | Existing | Successful publication behavior | Tracking metric |
| Publication latency trend | Existing | Publication delay | Tracking metric |
| Rolling-window compliance | Enhanced | Compliance across evaluation period | 7/28/30-day policy |
| Fast burn-rate alert | Enhanced | Rapid budget consumption | Policy-defined |
| Slow burn-rate alert | Enhanced | Sustained budget consumption | Policy-defined |
| SLO breach duration | New | Time objective remains breached | Incident reporting |
| SLO breach frequency | New | Breaches per period | Reliability review |
| SLO compliance by journey | New | Reliability per critical journey | Journey-specific |
| SLO compliance by region | New | Regional reliability | Region-specific |
| Error-budget forecast | New | Projected budget exhaustion | Planning metric |
| SLO data completeness | New | Valid measurement coverage | ≥99.9% |
| SLO ownership coverage | New | Objectives with accountable owners | 100% |
| SLO review compliance | New | Scheduled reviews completed | 100% |
| Alert effectiveness | New | Actionable alerts / all alerts | Operational KPI |
| Incident detection time | New | Onset to detection | Operational KPI |
| Incident recovery time | New | Onset to recovery | Operational KPI |
| Recovery objective compliance | New | Recovery within RTO | Service-specific |
| Data recovery compliance | New | Data loss within RPO | Service-specific |
| Change-related incident rate | New | Incidents attributable to changes | Engineering KPI |

**Existing dashboard views:** Current SLO Status, Error Budget Remaining, Burn Rate, Publication Success Trend, Publication Latency Trend.

**Add:** Compliance history, budget forecasts, journey/region breakdowns, breach trends, and ownership.

### Reference multiwindow burn-rate alert policy

For a rolling 30-day SLO, a common starting policy is:

| Severity | Burn rate | Long window | Short window |
|---|---:|---:|---:|
| Critical | 14.4× | 1 hour | 5 minutes |
| High | 6× | 6 hours | 30 minutes |
| Warning | 3× | 1 day | 2 hours |
| Warning | 1× | 3 days | 6 hours |

Require both windows to breach their thresholds. Validate against traffic, business criticality, and alert fatigue.

## 7. How the five layers connect

1. **Business:** Did the intended transaction complete?
2. **Application:** Did the APIs, consumers, and publishers work?
3. **Infrastructure:** Did AWS resources and platform dependencies work?
4. **Traceability:** Where did the transaction fail or slow down?
5. **Reliability:** Did the measured behavior meet its objective?

This is a diagnostic and management model, **not** a literal sequential telemetry pipeline. Reliability management uses measurements from other layers.

## 8. Master indicator specification template

Retain the original document's mapping structure and extend it as follows:

| Field | Meaning |
|---|---|
| Indicator ID | Unique ID such as `APP-SLI-001` |
| Observability layer | One of the five layers |
| Meaning | Why this layer/indicator matters |
| What is observed | System or business behavior |
| What is tracked | Metric, event, log, trace, or calculated ratio |
| Alert source | CloudWatch alarm, SLO monitor, log-based alert, etc. |
| Recommended tool | CloudWatch, OpenTelemetry, tracing, dashboards, etc. |
| Status | Existing / Enhanced / New |
| Indicator type | User-facing SLI / diagnostic metric / operational KPI |
| Formula | Numerator, denominator, exclusions |
| Target | SLO or diagnostic threshold, if applicable |
| Window | Rolling 30 days or other defined period |
| Severity | P1 / P2 / P3 |
| Owner | Accountable team |
| Dashboard | Location of indicator |

### Worked example — APP-SLI-001

| Field | Value |
|---|---|
| Indicator | API Availability |
| Layer | Application Observability |
| Status | Enhanced |
| Type | Service SLI |
| Definition | Share of eligible API requests receiving a valid response |
| Formula | `good_eligible_requests / eligible_requests * 100` |
| SLO | 99.95% over rolling 30 days |
| Data source | API Gateway / ALB / application telemetry |
| Alerting | Multiwindow error-budget burn rate |
| Owner | Application team |

## 9. Implementation phases

| Phase | Priority | Scope |
|---|---|---|
| 1 | Critical | Business success, API availability, latency, async completion, error budget |
| 2 | High | Dependency health, queue lag, data correctness, trace coverage, capacity |
| 3 | Advanced | Forecasting, reconciliation, diagnostic quality, governance |

## 10. Standards and references

- Google SRE Workbook, Implementing SLOs: https://sre.google/workbook/implementing-slos/
- Google SRE Workbook, Alerting on SLOs: https://sre.google/workbook/alerting-on-slos/
- OpenSLO specification: https://openslo.com/specification/
- OpenTelemetry semantic conventions: https://opentelemetry.io/docs/specs/semconv/
- W3C Trace Context: https://www.w3.org/TR/trace-context/

**Validation note:** Before implementation, compare the `Existing` rows with the editable original Confluence page. The photographed PDF does not reliably expose every word. Targets and alerts here are recommendations requiring workload-specific validation.
