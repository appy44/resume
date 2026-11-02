# Enterprise Observability & Traceability Standard

**Version:** 1.0\
**Date:** 2 November 2026\
**Status:** Proposed reference standard\
**Audience:** Platform Engineering, Application Engineering, SRE,
Architecture, DevOps, and Engineering Leadership

## 1. Executive Summary

This document proposes an organisation-level approach to observability
and traceability. It establishes common conventions, reusable
implementation patterns, SLI/SLO governance, business-transaction
visibility, CI/CD guardrails, and an Observability Intelligence Agent
(OIA).

The approach complements existing telemetry platforms such as Splunk,
Dynatrace, Honeycomb, and CloudWatch. It does not replace them.
OpenTelemetry provides common instrumentation and context propagation;
Nobl9 provides reliability and SLO governance; OIA assesses coverage and
correlates evidence across approved systems.

**Recommended operating model: platform-enabled, application-owned.** -
Platform Engineering owns standards, reusable patterns, infrastructure
constructs, automation, and guardrails. - Application teams own service
instrumentation, service-level objectives, dashboards, runbooks, and
operational outcomes. - SRE/Observability supports reliability practices
and telemetry platforms. - Architecture and business stakeholders
validate criticality and business journey outcomes.

## 2. Goals and Non-Goals

### Goals

-   Standardise logs, metrics, traces, metadata, naming, and
    correlation.
-   Propagate trace context across synchronous and asynchronous
    boundaries.
-   Define meaningful SLIs/SLOs for critical services and business
    journeys.
-   Use Nobl9 for SLO governance where it is the approved platform.
-   Publish reusable Java, Python, Node.js, and AWS patterns through the
    existing engineering/skillset repository.
-   Automate observability validation in CI/CD.
-   Improve detection, diagnosis, ownership, and recovery.
-   Establish an evidence-based foundation for AI-assisted assessment
    and RCA.

### Non-goals

-   Replacing existing telemetry backends.
-   Forcing identical dashboards or alerts on every workload.
-   Creating SLOs for every low-level component without a meaningful
    reliability outcome.
-   Treating valid business rejections as technical failures.
-   Allowing AI-generated RCA hypotheses to become authoritative
    conclusions without evidence.
-   Collecting sensitive customer data in telemetry unnecessarily.

## 3. Target Architecture

``` text
Business capabilities and customer journeys
                    |
                    v
              Applications
                    |
                    v
       Reusable instrumentation patterns
        Java | Python | Node.js | AWS
                    |
                    v
         OpenTelemetry instrumentation
                    |
                    v
         OpenTelemetry Collector layer
                    |
          +---------+----------+
          |         |          |
          v         v          v
       Splunk   Dynatrace   Honeycomb
          |         |          |
          +---------+----------+
                    |
             CloudWatch / other
             approved telemetry
                    |
                    v
            Nobl9 reliability
       Services | SLIs | SLOs | Alerts
                    |
                    v
       Observability Intelligence Agent
       Assessment | Correlation | RCA support
       Recommendations | Governance reports
```

This is a logical architecture. Actual collectors, routing, credentials,
retention, and data residency must follow enterprise platform and
security decisions.

  -----------------------------------------------------------------------
  Layer                   Responsibility          Typical owner
  ----------------------- ----------------------- -----------------------
  Business                Define critical         Product / Business
                          journeys and outcomes   

  Application             Emit logs, metrics,     Application team
                          traces, and business    
                          events                  

  Patterns                Provide approved        Platform Engineering
                          libraries, conventions, 
                          and examples            

  Collection              Collect, process,       Platform /
                          route, and secure       Observability
                          telemetry               

  Backends                Store, query,           Tool owners
                          visualise, and analyse  
                          telemetry               

  Reliability             Define SLIs, SLOs,      Service owner with SRE
                          error budgets, and      
                          alert policies          

  Intelligence            Assess coverage and     OIA / Platform
                          correlate evidence      

  Governance              Approve standards,      Architecture /
                          exceptions, and         Leadership
                          critical-service        
                          requirements            
  -----------------------------------------------------------------------

Platform Engineering should provide paved roads rather than become a
central implementation bottleneck.

## 4. Enterprise Observability Standard

### 4.1 Maturity levels

  -----------------------------------------------------------------------
  Level                   Name                    Capabilities
  ----------------------- ----------------------- -----------------------
  1                       Baseline                Structured logs,
                                                  service/environment
                                                  identity, correlation
                                                  ID, health checks,
                                                  basic RED metrics

  2                       Reliable service        Distributed tracing,
                                                  context propagation,
                                                  service SLIs/SLOs,
                                                  dashboards, actionable
                                                  alerts, runbooks,
                                                  dependency visibility

  3                       Business-aware          Business transaction
                                                  visibility,
                                                  error-budget practices,
                                                  cross-service
                                                  correlation, anomaly
                                                  detection, deployment
                                                  correlation,
                                                  AI-assisted RCA
  -----------------------------------------------------------------------

New services should meet Level 1 before production. Critical services
should target Level 2. Critical customer or business journeys should
progressively adopt Level 3.

### 4.2 Reusable pattern catalogue

  ----------------------------------------------------------------------
  ID                     Pattern                Required outcome
  ---------------------- ---------------------- ------------------------
  OBS-001                Structured logging     Consistent
                                                machine-readable logs

  OBS-002                Distributed tracing    Trace visibility across
                                                services

  OBS-003                Correlation context    Trace and business
                                                correlation across
                                                boundaries

  OBS-004                RED metrics            Rate, errors, and
                                                duration

  OBS-005                Infrastructure metrics Resource and platform
                                                health

  OBS-006                Health checks          Correct
                                                liveness/readiness
                                                semantics

  OBS-007                Error handling         Consistent error
                                                classification

  OBS-008                SLI/SLO definitions    Measurable reliability
                                                objectives

  OBS-009                Alerting               Actionable alerts with
                                                ownership/runbooks

  OBS-010                Dashboards             Standard service and
                                                operational views

  OBS-011                Business transactions  Stage-level journey
                                                visibility

  OBS-012                Resilience             Timeout, retry,
                                                circuit-breaker, queue
                                                visibility

  OBS-013                Telemetry governance   Naming, privacy,
                                                cardinality, retention,
                                                cost

  OBS-014                Dependency mapping     Service and external
                                                dependency visibility

  OBS-015                Deployment             Correlate
                         observability          releases/configuration
                                                changes with health
  ----------------------------------------------------------------------

Each pattern should include purpose, applicability, implementation,
configuration, examples, tests, security considerations, versioning, and
ownership.

### 4.3 Required service metadata

Use OpenTelemetry resource attributes where applicable.

  ----------------------------------------------------------------------------
  Attribute                       Requirement          Example
  ------------------------------- -------------------- -----------------------
  `service.name`                  Required; stable     `retirement-api`
                                  logical name         

  `service.namespace`             Recommended          `retirement`

  `service.version`               Required for         `2.4.1`
                                  deployed version     

  `deployment.environment.name`   Required             `production`

  `cloud.provider`                Required where       `aws`
                                  applicable           

  `cloud.region`                  Required where       `us-east-1`
                                  applicable           

  `cloud.account.id`              Only where internal  Approved account
                                  policy permits       identifier

  `team.owner`                    Recommended custom   `retirement-platform`
                                  attribute            

  `business.domain`               Recommended custom   `retirement`
                                  attribute            

  `service.criticality`           Recommended governed `tier-1`
                                  classification       
  ----------------------------------------------------------------------------

`team.owner`, `business.domain`, and `service.criticality` are proposed
organisation-specific attributes, not universal OpenTelemetry semantic
conventions. Agree final names with architecture and telemetry
governance owners.

Naming rules: - Use stable, human-readable logical service names. - Do
not put pod IDs, hostnames, request IDs, timestamps, or random
deployment values in `service.name`. - Keep environment names consistent
across telemetry, deployment configuration, and Nobl9. - Use controlled
vocabularies for teams, domains, environments, and criticality.

## 5. Logs, Metrics, and Traces

### 5.1 Structured logs

Minimum requirements: - Emit structured JSON logs. - Include timestamp,
severity, service identity, environment, and message. - Include
`trace_id` and `span_id` when available. - Use consistent error codes
and exception classification. - Include safe correlation identifiers
where required. - Never log passwords, access tokens, secrets, payment
details, or unnecessary personal information. - Avoid logging complete
request/response payloads by default.

Example:

``` json
{
  "timestamp": "2026-11-02T10:15:30.123Z",
  "severity": "ERROR",
  "service.name": "retirement-api",
  "deployment.environment.name": "production",
  "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736",
  "span_id": "00f067aa0ba902b7",
  "event.name": "loan.document.signature.failed",
  "error.code": "SIGNATURE_PROVIDER_TIMEOUT",
  "message": "Document signature provider timed out"
}
```

The event and identifiers are illustrative.

### 5.2 Metrics

For request-driven services use RED: - **Rate:** requests per second. -
**Errors:** failed requests or operations. - **Duration:** request
latency distribution.

For infrastructure/resource-oriented components use USE: -
**Utilisation:** proportion of capacity in use. - **Saturation:** queued
or waiting work. - **Errors:** resource-level errors.

Governance: - Do not use customer ID, account ID, transaction ID, trace
ID, or other unbounded values as metric labels. - Prefer
histograms/distributions for latency rather than averages alone. -
Define units and histogram buckets consistently. - Track telemetry
ingestion volume and cost. - Separate technical failures from valid
business outcomes.

### 5.3 Distributed tracing

A trace represents a distributed operation; a span represents an
operation within that trace.

Minimum requirements: - Instrument inbound and outbound service
operations. - Propagate W3C Trace Context across supported service
boundaries. - Instrument HTTP, database, and messaging operations using
supported libraries/agents where practical. - Add custom spans for
meaningful business operations, not every trivial method. - Record
relevant status, error type, and safe attributes. - Apply sampling
appropriate to service criticality and cost. - Preserve trace context
across asynchronous messaging where supported.

### 5.4 Trace context versus business correlation

  -----------------------------------------------------------------------
  Identifier              Purpose                 Scope
  ----------------------- ----------------------- -----------------------
  Trace ID                Correlates spans in one One technical execution
                          distributed trace       path

  Span ID                 Identifies one          One operation
                          operation               

  Business transaction ID Correlates a business   May span hours or days
                          process lifecycle       

  Correlation ID          Links related events    Organisation-defined
                          where trace context is  
                          insufficient            
  -----------------------------------------------------------------------

A long-running business transaction may span multiple traces, retries,
scheduled jobs, and human actions. A business transaction ID is not a
replacement for a trace ID.

For asynchronous workflows, propagate trace context through message
metadata. Where a later stage creates a new trace, use span links where
appropriate. Use W3C baggage cautiously; do not place sensitive or
high-cardinality values in baggage or propagate internal context
externally without review.

## 6. OpenTelemetry Implementation Patterns

### 6.1 Recommended approach

-   Prefer supported automatic instrumentation for HTTP server/client,
    database, and messaging frameworks.
-   Use manual instrumentation for business operations that automatic
    instrumentation cannot describe.
-   Standardise SDK configuration, resource attributes, sampling,
    exporter configuration, and propagation.
-   Use an OpenTelemetry Collector or approved equivalent where required
    by enterprise architecture.
-   Keep backend-specific credentials and exporter details out of
    business logic.

### 6.2 Java / Spring Boot

A Spring Boot service should have: 1. Stable service name and resource
metadata. 2. Approved OpenTelemetry Java instrumentation. 3. HTTP
server/client spans. 4. Database and messaging instrumentation where
applicable. 5. Structured logs correlated with trace context. 6. Custom
spans around meaningful business operations. 7. Health endpoints with
defined readiness/liveness semantics. 8. Approved exporter and sampling
configuration.

Illustrative manual span:

``` java
Span span = tracer.spanBuilder("retirement.loan.validate")
    .startSpan();

try (Scope scope = span.makeCurrent()) {
    // Perform business validation.
    span.setAttribute("transaction.type", "RETIREMENT_LOAN");
    span.setAttribute("transaction.stage", "ELIGIBILITY_CHECK");
    span.setAttribute("transaction.outcome", "SUCCESS");
} catch (RuntimeException ex) {
    span.recordException(ex);
    span.setStatus(StatusCode.ERROR);
    throw ex;
} finally {
    span.end();
}
```

This is conceptual sample code. Use organisation-approved
SDK/instrumentation versions, dependency management, and error-handling
conventions.

### 6.3 Python and Node.js

Provide equivalent reference implementations for: - SDK initialisation
and resource attributes. - Framework instrumentation. - HTTP context
propagation. - Messaging instrumentation. - Structured logs with trace
correlation. - Custom business spans. - Exporter and sampling
configuration.

### 6.4 AWS patterns

Create reusable patterns for applicable services: - API Gateway and load
balancers. - Lambda. - ECS and EKS. - SQS and SNS. - EventBridge. -
DynamoDB and RDS. - S3 and other storage. - External API dependencies.

For each, document native AWS telemetry, required application
instrumentation, trace propagation, export routing, cost, and retention.

## 7. Layered Observability Model

  -----------------------------------------------------------------------
  Layer                   Scope                   Example indicators
  ----------------------- ----------------------- -----------------------
  1\. Business            Customer journeys and   Completion rate, stage
                          outcomes                duration, abandonment,
                                                  business rejection

  2\. Application         APIs, services,         Request rate, error
                          workers, scheduled jobs rate, latency,
                                                  exceptions

  3\. Integration &       HTTP, queues, events,   Delivery success, queue
  messaging               external providers      age, retries, consumer
                                                  lag

  4\. Data                Databases, caches,      Query latency,
                          object storage          connection saturation,
                                                  throttling

  5\. Infrastructure      Compute, containers,    CPU, memory, restarts,
                          serverless, hosts       throttles, capacity

  6\. Network & security  DNS, TLS, connectivity, Connection failures,
                          identity                certificate expiry,
                                                  auth failures

  7\. Platform & delivery CI/CD, deployment,      Deployment failure,
                          configuration           rollback, change
                                                  failure rate

  8\. Observability       Collection, ingestion,  Telemetry lag, dropped
  platform                storage, alerting       data, collector health,
                                                  cost
  -----------------------------------------------------------------------

Security and privacy are cross-cutting concerns across all layers.

### Layer-specific guidance

-   **Business:** Measure whether the business outcome occurred, not
    merely whether an API returned HTTP 200.
-   **Application:** Measure volume, success, failure, latency,
    dependency errors, and saturation.
-   **Integration/messaging:** Measure published/consumed messages,
    processing failures, queue depth, oldest-message age, retries, DLQ
    volume, and event delay.
-   **Data:** Measure availability, latency, throttling, connection
    saturation, replication lag, backup status, and restore tests.
-   **Infrastructure:** Measure utilisation, saturation, restarts,
    scaling, throttling, and capacity headroom.
-   **Network/security:** Measure DNS/connectivity/TLS/authentication
    failures while avoiding sensitive security payloads in general
    telemetry.
-   **Platform/delivery:** Correlate deployments and configuration
    changes with service health and error-budget consumption.
-   **Observability platform:** Monitor collector availability, export
    failures, ingestion delay, dropped telemetry, backend query latency,
    alert delivery, retention, and cost.

## 8. SLI, SLO, SLA, and Error Budget

### 8.1 Definitions

-   **SLI:** measurement of service behaviour.
-   **SLO:** target for an SLI over a defined time window.
-   **SLA:** formal commitment, typically customer-facing and
    potentially including remedies.
-   **Error budget:** permitted unreliability implied by an SLO over its
    measurement window.

An SLO is not automatically an SLA.

### 8.2 SLI design principles

A good SLI reflects user/business experience, has a clear numerator and
denominator, defines eligible events and exclusions, specifies a
measurement window, uses a reliable data source, and is actionable by
the service owner.

### 8.3 Illustrative service SLI/SLO candidates

Targets below are examples only, not approved Principal commitments.
Agree targets using criticality, business impact, historical
performance, and stakeholder expectations.

  -----------------------------------------------------------------------
  Service/component       SLI                     Illustrative SLO
                                                  candidate
  ----------------------- ----------------------- -----------------------
  REST API                Successful eligible     99.9% over 30 days
                          requests                

  REST API                p95 request latency     Less than 300 ms over
                                                  30 days

  REST API                Technical 5xx rate      Less than 0.1% over 30
                                                  days

  RDS                     Successful eligible DB  99.9% over 30 days
                          operations              

  RDS                     Query latency           Workload-specific p95
                                                  target

  SQS consumer            Messages processed      99% within 5 minutes
                          within target age       

  SQS consumer            Technical processing    99.9% over 30 days
                          success                 

  Lambda                  Successful invocations  99.9% over 30 days

  External dependency     Successful eligible     Dependency-specific
                          calls                   target

  Telemetry pipeline      Telemetry delivered     99% within agreed delay
                          within target delay     
  -----------------------------------------------------------------------

Potential component coverage includes EC2, ECS, EKS, Lambda, API
Gateway, DynamoDB, RDS, Redis, S3, SQS, SNS, EventBridge, DNS, external
dependencies, CI/CD, collectors, and telemetry backends. Do not create
SLOs merely because a component exists.

### 8.4 Alerting and error budgets

-   Use burn-rate alerts for meaningful SLO consumption.
-   Route alerts to an accountable team.
-   Include runbooks and diagnostic links.
-   Avoid paging on symptoms with no actionable response.
-   Define escalation and error-budget policy with engineering
    leadership.
-   Review noisy alerts and false positives.

## 9. Nobl9 Organisation-Level SLO Governance

Nobl9 should act as the reliability policy and SLO management layer if
it is the approved platform. Telemetry backends remain responsible for
collecting and querying underlying signals.

### 9.1 Suggested hierarchy

  ---------------------------------------------------------------------
  Nobl9 concept                      Suggested use
  ---------------------------------- ----------------------------------
  Organisation                       Enterprise boundary

  Project                            Logical grouping and/or ownership
                                     boundary aligned to governance and
                                     RBAC

  Service                            User-facing capability,
                                     application, API, or meaningful
                                     technical service

  SLO                                Measurable reliability objective

  Labels                             Environment, team, business
                                     domain, criticality, lifecycle

  Annotations                        Owner, runbook, architecture,
                                     review, operational context

  Alert policy                       Error-budget and burn-rate
                                     response
  ---------------------------------------------------------------------

Validate this model against the organisation's actual Nobl9
configuration. Avoid a separate Nobl9 service for every low-level
component unless it has distinct ownership or a meaningful reliability
objective.

### 9.2 Suggested labels

Use controlled vocabulary, for example: - `environment: production` -
`business-domain: retirement` - `team: retirement-platform` -
`criticality: tier-1` - `lifecycle: strategic`

Agree final label keys and values centrally.

### 9.3 SLO as code

Store SLO definitions in version control. Use `sloctl` or an approved
Nobl9 CI/CD integration to validate and apply changes.

``` text
Developer change
      |
      v
Pull request
      |
      v
Schema and policy validation
      |
      v
Peer review / service owner approval
      |
      v
Nobl9 apply
      |
      v
Post-deployment verification
```

Version project, service, SLO, and alert-policy definitions. Protect
production changes with review and access controls.

### 9.4 Inventory existing Nobl9 configuration

Start with a read-only inventory. These commands are examples; verify
syntax against the installed `sloctl` version and access model.

``` bash
mkdir nobl9-export
cd nobl9-export

sloctl get slos -A -o yaml > slos.yaml
sloctl get services -A -o yaml > services.yaml
sloctl get projects -o yaml > projects.yaml
sloctl get alertpolicies -A -o yaml > alert-policies.yaml
sloctl get annotations -A -o yaml > annotations.yaml
```

Optional resource loop, only after confirming supported resource names:

``` bash
for obj in agents alertmethods alertpolicies alerts annotations projects services slos
do
  sloctl get -A "$obj" > "$obj.yaml"
done
```

Security notes: - Prefer read-only identity for discovery. - Do not
export/share agent credentials, tokens, or secrets. - RBAC may limit
visible resources. - Treat exports as sensitive internal architecture
information. - Store exports only in approved locations. - Do not claim
the export is organisation-wide unless access coverage is confirmed.

### 9.5 SLO inventory fields

Capture project, service, SLO name/description, SLI query, data source,
objective, time window, good/total event definition, labels,
annotations, alert policies, owner, runbook, review date, and status.

Use the inventory to identify duplicate SLOs, missing ownership,
inconsistent labels, missing critical services, and objectives with
unclear business meaning.

## 10. Business Transaction Observability

Technical service health does not prove that a business process
completed. Critical journeys need explicit business events and
stage-level visibility.

### 10.1 Candidate business journeys

These are candidate examples based on publicly described
financial-services products and processes. They are not confirmation of
internal Principal workflows, systems, owners, or service commitments.
Validate them with internal business and product owners.

  -----------------------------------------------------------------------
  Domain                Candidate journey         Example stages
  --------------------- ------------------------- -----------------------
  Retirement            Contribution processing   Received → validated →
                                                  allocated → posted →
                                                  reconciled

  Retirement            Participant loan          Requested → eligibility
                                                  checked → approved →
                                                  signed → disbursed →
                                                  repayment established

  Retirement            Withdrawal/distribution   Requested → validated →
                                                  reviewed → approved →
                                                  paid → reconciled

  Retirement            Pension application       Received → validated →
                                                  entitlement calculated
                                                  → approved → payment
                                                  scheduled

  Benefits & Protection Disability claim          Submitted → documents
                                                  collected → reviewed →
                                                  decision → payment

  Benefits & Protection Group life claim          Received → eligibility
                                                  checked → evidence
                                                  reviewed → decision →
                                                  payment

  Benefits & Protection Health-related claim      Received → validated →
                                                  adjudicated →
                                                  paid/rejected

  Asset Management      Investment purchase       Instruction received →
                                                  validated → priced →
                                                  executed → confirmed

  Asset Management      Investment redemption     Request received →
                                                  validated → priced →
                                                  executed → settled

  Asset Management      Portfolio rebalancing     Triggered → evaluated →
                                                  orders generated →
                                                  executed → reconciled
  -----------------------------------------------------------------------

### 10.2 Business transaction event model

A common event envelope should include: - `transaction.id`: pseudonymous
business transaction identifier. - `transaction.type`: controlled
transaction type. - `business.domain`: controlled business domain. -
`transaction.stage`: current/completed stage. - `transaction.status`:
initiated, in-progress, completed, failed, pending, or rejected. -
`transaction.outcome`: controlled outcome classification. -
`event.timestamp`: event time. - `service.name`: emitting service. -
`trace_id` and `span_id`: technical correlation where available. -
`event.name`: stable event name. - `error.code`: safe standardised error
code where relevant.

Example:

``` json
{
  "event.name": "business.transaction.stage.updated",
  "event.timestamp": "2026-11-02T10:15:30Z",
  "transaction.id": "txn-pseudonymous-12345",
  "transaction.type": "RETIREMENT_LOAN",
  "business.domain": "RETIREMENT",
  "transaction.stage": "DOCUMENT_SIGNATURE",
  "transaction.status": "PENDING",
  "transaction.outcome": "AWAITING_CUSTOMER_ACTION",
  "service.name": "loan-orchestrator",
  "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736"
}
```

This is synthetic data. Do not include names, account numbers, email
addresses, policy numbers, or direct identifiers in general telemetry.

### 10.3 Business metrics

Measure initiated, completed, failed, pending, and rejected
transactions; completion rate by type; stage duration and failure rate;
end-to-end duration; retries; abandonment/timeouts; reconciliation
mismatches; and transactions exceeding processing deadlines.

Use bounded dimensions such as transaction type, stage, outcome, and
business domain. Never use transaction IDs as metric labels.

### 10.4 Correct outcome classification

Distinguish: - **Technical failure:** service, infrastructure,
integration, or processing failure. - **Business rejection:** valid
business rule or eligibility decision. - **Pending:** waiting for an
external party, document, approval, or scheduled processing. -
**Customer abandonment:** journey not completed by the customer. -
**Operational delay:** valid work has exceeded an internal processing
target.

A valid eligibility rejection must not automatically count as a
technical service failure.

## 11. CI/CD and Infrastructure-as-Code Guardrails

### 11.1 Pull-request checks

Validate: - Service identity and environment metadata. - Structured
logging. - Trace context propagation across supported boundaries. -
HTTP, database, and messaging instrumentation where applicable. -
Correct health endpoint semantics. - Consistent and safe error
telemetry. - Approved SLO for critical services. - Production dashboards
and actionable alerts. - Owner and runbook metadata. - No sensitive data
or unbounded metric labels. - Approved sampling, retention, and routing
configuration.

### 11.2 Enforcement strategy

  ---------------------------------------------------------------------
  Service category                   Suggested enforcement
  ---------------------------------- ----------------------------------
  New production service             Mandatory baseline before
                                     production

  Existing Tier-1 service            Prioritised remediation with
                                     tracked exceptions

  Existing non-critical service      Progressive adoption

  Prototype / short-lived workload   Lightweight, risk-based
                                     requirements

  Legacy system                      Documented exception and migration
                                     plan
  ---------------------------------------------------------------------

Start with reporting and warnings. Make selected checks blocking after
patterns, documentation, and exception handling are mature.

### 11.3 Suggested repository structure

``` text
enterprise-observability/
├── README.md
├── standards/
│   ├── naming.md
│   ├── logging.md
│   ├── tracing.md
│   ├── metrics.md
│   ├── privacy-and-cardinality.md
│   └── slo-governance.md
├── patterns/
│   ├── OBS-001-structured-logging/
│   ├── OBS-002-distributed-tracing/
│   ├── OBS-003-correlation-context/
│   ├── OBS-004-red-metrics/
│   ├── OBS-006-health-checks/
│   ├── OBS-008-sli-slo/
│   └── OBS-011-business-transactions/
├── examples/
│   ├── java-spring-boot/
│   ├── python/
│   ├── nodejs/
│   └── aws/
├── infrastructure/
│   ├── cdk/
│   ├── terraform/
│   └── collector/
├── nobl9/
│   ├── projects/
│   ├── services/
│   ├── slos/
│   └── alert-policies/
├── schemas/
├── policies/
├── tools/
└── docs/
```

Adapt this structure to the existing enterprise skillset repository
instead of creating a parallel repository without clear ownership.

## 12. Observability Intelligence Agent (OIA)

### 12.1 Purpose

OIA is an intelligence and automation layer above existing observability
and engineering platforms. It does not replace telemetry backends or
become a second SLO engine. It assesses maturity, identifies gaps,
correlates evidence, and recommends improvements.

### 12.2 Proposed capabilities

  ---------------------------------------------------------------------
  Capability                         Function
  ---------------------------------- ----------------------------------
  Assessment Agent                   Scans repositories and service
                                     metadata for observability
                                     coverage

  Log Intelligence                   Identifies recurring errors,
                                     patterns, and anomalies

  Metrics Intelligence               Evaluates service metrics,
                                     saturation, and SLI signals

  Trace Intelligence                 Examines spans, dependencies,
                                     latency, and propagation gaps

  RCA Assistant                      Correlates logs, metrics, traces,
                                     deployments, and incidents

  Recommendation Orchestrator        Maps findings to approved patterns
                                     and actionable remediation

  Governance Reporter                Produces coverage, compliance, and
                                     adoption reports
  ---------------------------------------------------------------------

### 12.3 MVP scope

1.  Read a service repository and deployment configuration.
2.  Identify language, framework, runtime, and AWS components.
3.  Check service metadata, logging, tracing, metrics, and health-check
    patterns.
4.  Inspect available SLO configuration and ownership metadata.
5.  Map gaps to OBS pattern identifiers.
6.  Produce a report with evidence, severity, and recommended
    remediation.
7.  Optionally create pull-request comments. Do not automatically change
    production configuration in the first release.

### 12.4 Candidate technical architecture

  ---------------------------------------------------------------------
  Component                          Candidate technology
  ---------------------------------- ----------------------------------
  API/orchestration                  Python, FastAPI

  Agent workflow                     LangGraph or approved internal
                                     orchestration

  LLM                                Enterprise-approved model/gateway

  Repository integration             GitHub APIs / approved source
                                     control

  Static policy checks               OPA, Checkov, Trivy, custom rules

  Telemetry integration              Approved Splunk, Dynatrace,
                                     Honeycomb, CloudWatch APIs

  SLO integration                    Nobl9 APIs, `sloctl`, or approved
                                     integration

  Persistence                        DynamoDB or PostgreSQL

  Runtime                            ECS, EKS, or Lambda

  UI                                 Existing engineering portal or
                                     React
  ---------------------------------------------------------------------

These are candidates, not mandates. Confirm approved runtimes, data
access, model usage, and security controls with enterprise architecture.

### 12.5 Evidence-based recommendations

Each finding should include finding ID, affected service, evidence
source and timestamp, observed evidence, violated standard/pattern,
severity and impact rationale, recommended action, confidence and
limitations, owner, and status.

OIA must distinguish observed facts from inferred hypotheses. RCA
suggestions must link to evidence and remain subject to engineer
validation.

### 12.6 Security and governance

-   Use least-privilege, read-only access for initial assessments.
-   Do not ingest secrets or unnecessary personal data.
-   Redact sensitive telemetry before LLM processing.
-   Keep an audit trail of queries, evidence, recommendations, and
    actions.
-   Require human approval for code changes and production actions.
-   Apply query rate limits and telemetry cost controls.
-   Respect backend access controls and data residency.
-   Never assert a root cause without sufficient evidence.

## 13. First 90-Day Adoption Roadmap

  ----------------------------------------------------------------------
  Phase            Timeline         Activities         Deliverables
  ---------------- ---------------- ------------------ -----------------
  1\. Discover and Days 1--15       Export visible     Current-state
  baseline                          Nobl9 inventory;   inventory, gap
                                    identify critical  assessment, pilot
                                    services; review   candidates
                                    telemetry          
                                    patterns; map      
                                    repositories       

  2\. Define       Days 16--30      Agree naming,      Enterprise
  standards                         metadata, logging, standard v1,
                                    tracing, metrics,  pattern backlog,
                                    SLO, privacy,      reference
                                    ownership          examples

  3\. Build paved  Days 31--60      Add                Reusable
  roads                             Java/Python/Node   patterns, CI
                                    patterns; AWS      checks,
                                    constructs; Nobl9  SLO-as-code
                                    YAML; CI checks;   examples
                                    business event     
                                    schema             

  4\. Pilot and    Days 61--90      Pilot 2--3         Pilot results,
  measure                           services/teams;    measured
                                    validate trace     benefits, rollout
                                    propagation;       plan
                                    review             
                                    SLOs/dashboards;   
                                    measure adoption   
  ----------------------------------------------------------------------

### Pilot selection

Select services with a willing owner, clear criticality, existing
telemetry, representative technology, manageable dependencies, and a
measurable baseline. A Java/Spring Boot service is a practical first
technical pilot if representative. A queue-driven workflow is a useful
second pilot for asynchronous propagation. Select a business journey
only after its actual stages and process owner are confirmed.

### Success measures

Capture a baseline before setting targets: - Percentage of new services
meeting baseline. - Percentage of critical services with approved
SLOs. - Percentage of supported boundaries propagating trace context. -
Percentage of critical journey stages emitting standard events. - Time
to identify observability gaps. - Manual service onboarding effort. -
Percentage of alerts with owner, runbook, and actionable response. -
Telemetry loss and ingestion delay. - Alert noise and false-positive
rate. - OIA recommendation acceptance rate. - Telemetry cost per
service/workload.

Set pilot targets after baseline measurement. Do not report proposed
targets as achieved results.

## 14. Governance and Ownership

  ---------------------------------------------------------------------------------
  Activity               Platform      Application   SRE /           Architecture /
                         Engineering   team          Observability   Business
  ---------------------- ------------- ------------- --------------- --------------
  Define telemetry       Responsible   Consulted     Consulted       Accountable /
  standards                                                          consulted

  Build reusable         Responsible   Consulted     Consulted       Informed
  libraries/constructs                                               

  Instrument application Enable        Responsible   Consulted       Informed

  Define service SLI/SLO Enable        Responsible   Consulted       Business input

  Approve critical       Consulted     Consulted     Consulted       Responsible
  journey outcomes                                                   

  Operate telemetry      Consulted     Informed      Responsible     Informed
  platform                                                           

  Own service            Enable        Responsible   Consulted       Informed
  alerts/runbooks                                                    

  Approve exceptions     Consulted     Requestor     Consulted       Accountable

  OIA platform and       Responsible   Consulted     Consulted       Governance
  policy                                                             
  ---------------------------------------------------------------------------------

Adapt this table to the organisation's formal accountability model.

### Exception process

Every exception should record service and owner, requirement not met,
reason and risk, compensating control, remediation plan, target date,
approver, and review date. Exceptions should expire or be reviewed
periodically.

## 15. Decisions to Confirm

1.  Approved OpenTelemetry SDKs, agents, Collector model, and supported
    versions.
2.  Approved telemetry backends and routing architecture.
3.  Canonical service naming and metadata vocabulary.
4.  Business-domain and criticality taxonomy.
5.  Nobl9 project/service ownership model and RBAC boundaries.
6.  SLO review and approval process.
7.  Standard alert and error-budget policies.
8.  Data classification, PII handling, retention, and sampling.
9.  CI/CD enforcement levels and exception authority.
10. Ownership and lifecycle of the pattern repository.
11. OIA access model, approved LLM, audit, and human-approval controls.
12. Critical business journeys and their process owners.

## 16. Recommended Initial Implementation Sequence

1.  Inventory visible Nobl9 projects, services, SLOs, labels, and alert
    policies; map them to repositories and telemetry platforms.
2.  Select one representative service, preferably Java/Spring Boot with
    an identifiable owner and existing telemetry.
3.  Publish the baseline: service identity, structured logs, trace
    context, RED metrics, health checks, ownership, and runbook.
4.  Define one or two meaningful SLIs with the service owner and publish
    SLO configuration through version control.
5.  Add CI validation, starting with reporting/warnings and later
    enforcing the baseline for new production services.
6.  Validate a messaging path and prove trace propagation plus business
    correlation across an asynchronous boundary.
7.  Pilot OIA assessment using repository/configuration evidence and a
    gap report mapped to the pattern catalogue.
8.  Measure onboarding effort, coverage, diagnosis time, and alert
    quality against the baseline.

Do not start by standardising every dashboard or creating SLOs for every
AWS resource. Start with common instrumentation and ownership
conventions, then connect them to meaningful service and business
outcomes.

## Appendix A. Observability Terminology

  ---------------------------------------------------------------------
  Term                               Meaning
  ---------------------------------- ----------------------------------
  Telemetry                          Logs, metrics, traces, and related
                                     operational signals

  Instrumentation                    Code or agents that generate
                                     telemetry

  Trace                              End-to-end representation of a
                                     distributed operation

  Span                               Timed operation within a trace

  Trace context                      Metadata used to correlate
                                     distributed spans

  Context propagation                Passing trace context across
                                     process/service boundaries

  Sampling                           Selecting which traces/events are
                                     retained

  Cardinality                        Number of distinct values for a
                                     metric dimension

  RED                                Rate, Errors, Duration

  USE                                Utilisation, Saturation, Errors

  MTTD                               Mean Time to Detect

  MTTA                               Mean Time to Acknowledge

  MTTR                               Mean Time to Restore/Recover;
                                     define consistently

  MTBF                               Mean Time Between Failures

  RTO                                Recovery Time Objective

  RPO                                Recovery Point Objective

  Error budget                       Allowed unreliability implied by
                                     an SLO

  Burn rate                          Rate at which the error budget is
                                     consumed

  Runbook                            Operational procedure for
                                     diagnosis/remediation
  ---------------------------------------------------------------------

## Appendix B. Pattern Definition Checklist

Every pattern should contain: - Pattern ID, title, version, and
status. - Problem statement and intended outcome. - Applicable
technologies and workloads. - Mandatory and optional requirements. -
Reference implementation and configuration. - Example logs, metrics,
traces, or SLO definitions. - Security, privacy, and cardinality
considerations. - Automated validation and test approach. - Operational
ownership and support model. - Migration guidance and known
limitations. - Change history and deprecation policy.

## Appendix C. Caveats

-   Publicly described Principal products/processes are discovery inputs
    only. Internal process stages, systems, owners, SLAs, and data
    access must be confirmed with internal stakeholders.
-   SLI/SLO values are illustrative, not approved enterprise targets.
-   Use current OpenTelemetry semantic conventions where available;
    govern organisation-specific attributes.
-   Nobl9 CLI commands and resource support vary by version and
    permissions. Verify against the installed version.
-   OIA is a reference design. Security, legal, data governance, and
    enterprise architecture approval are required before connecting
    production telemetry or repositories.

## Appendix D. Reference Documentation

-   OpenTelemetry Semantic Conventions:
    https://opentelemetry.io/docs/specs/semconv/
-   OpenTelemetry Context Propagation:
    https://opentelemetry.io/docs/concepts/context-propagation/
-   OpenTelemetry Resources:
    https://opentelemetry.io/docs/concepts/resources/
-   OpenTelemetry documentation: https://opentelemetry.io/docs/
-   Nobl9 documentation: https://docs.nobl9.com/
-   Nobl9 `sloctl` documentation: https://docs.nobl9.com/sloctl/

------------------------------------------------------------------------

# Part II --- Engineering Implementation Playbook

The following sections turn the standard into implementation-oriented
reference material. Code and configuration are templates: pin versions
through the organisation's dependency-management process, validate them
against approved platform versions, and replace example endpoints and
credentials with approved configuration.

## 18. Implementation Blueprint and Repository Layout

### 18.1 Recommended implementation sequence

Implement the standard in this order for each pilot service:

1.  Establish service identity and ownership metadata.
2.  Add structured logging and safe error classification.
3.  Add OpenTelemetry instrumentation and resource attributes.
4.  Verify trace propagation across HTTP calls.
5.  Verify propagation across asynchronous messaging.
6.  Add RED metrics and service-specific business metrics.
7.  Add health endpoints and dependency health semantics.
8.  Define SLIs and agree SLOs with the service owner.
9.  Add dashboards, alerts, and runbooks.
10. Add CI checks and deployment verification.
11. Validate telemetry privacy, cardinality, sampling, and cost.
12. Record the service in the service catalogue and Nobl9.

### 18.2 Expanded repository layout

``` text
enterprise-observability/
├── README.md
├── standards/
│   ├── service-identity.md
│   ├── logging-standard.md
│   ├── metrics-standard.md
│   ├── tracing-standard.md
│   ├── context-propagation.md
│   ├── business-events.md
│   ├── privacy-retention-cardinality.md
│   └── slo-governance.md
├── patterns/
│   ├── OBS-001-structured-logging/
│   ├── OBS-002-distributed-tracing/
│   ├── OBS-003-correlation-context/
│   ├── OBS-004-red-metrics/
│   ├── OBS-006-health-checks/
│   ├── OBS-008-sli-slo/
│   └── OBS-011-business-transactions/
├── examples/
│   ├── java-spring-boot/
│   ├── python-fastapi/
│   ├── nodejs-express/
│   └── aws-event-driven/
├── collector/
│   ├── otel-collector.yaml
│   └── config-schema-notes.md
├── infrastructure/
│   ├── cdk/
│   └── terraform/
├── nobl9/
│   ├── projects/
│   ├── services/
│   ├── slos/
│   ├── alert-policies/
│   └── README.md
├── dashboards/
│   ├── service-overview/
│   └── business-journey/
├── alerts/
│   ├── burn-rate/
│   └── operational/
├── policies/
│   ├── observability-policy.rego
│   └── examples/
├── schemas/
│   └── business-transaction-event.schema.json
├── oia/
│   ├── app/
│   ├── connectors/
│   ├── rules/
│   ├── tests/
│   └── README.md
├── tests/
│   ├── instrumentation/
│   ├── propagation/
│   └── policy/
└── docs/
    ├── onboarding.md
    ├── migration.md
    ├── troubleshooting.md
    └── exception-process.md
```

Keep this in the existing enterprise skillset repository if that is the
established distribution point. Avoid creating two competing sources of
truth.

------------------------------------------------------------------------

## 19. Java / Spring Boot Reference Implementation

### 19.1 Dependencies

Use the organisation's approved Spring Boot and OpenTelemetry versions.
A typical Maven setup uses the OpenTelemetry Java agent for broad
automatic instrumentation and the API only when custom spans are needed.

Illustrative Maven dependency:

``` xml
<dependency>
    <groupId>io.opentelemetry</groupId>
    <artifactId>opentelemetry-api</artifactId>
</dependency>
```

Manage the dependency version through an approved BOM or
dependency-management policy. Do not copy an unpinned version into every
application.

For production, evaluate the OpenTelemetry Java agent as the default for
common HTTP, JDBC, and supported messaging instrumentation. Confirm
compatibility with the organisation's framework and runtime versions.

### 19.2 Runtime configuration

Example environment variables:

``` bash
OTEL_SERVICE_NAME=retirement-api
OTEL_RESOURCE_ATTRIBUTES=service.namespace=retirement,deployment.environment.name=dev,service.version=1.0.0,team.owner=retirement-platform
OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4317
OTEL_EXPORTER_OTLP_PROTOCOL=grpc
OTEL_TRACES_EXPORTER=otlp
OTEL_METRICS_EXPORTER=otlp
OTEL_LOGS_EXPORTER=otlp
OTEL_PROPAGATORS=tracecontext,baggage
OTEL_TRACES_SAMPLER=parentbased_traceidratio
OTEL_TRACES_SAMPLER_ARG=0.10
```

The endpoint, protocol, enabled signals, and sampling ratio are
environment-specific examples. Production sampling must be decided from
criticality, traffic volume, diagnostic requirements, and cost.

### 19.3 Launch with the Java agent

``` bash
java \
  -javaagent:/opt/otel/opentelemetry-javaagent.jar \
  -Dotel.service.name=retirement-api \
  -Dotel.resource.attributes=service.namespace=retirement,deployment.environment.name=dev \
  -Dotel.exporter.otlp.endpoint=http://otel-collector:4317 \
  -jar application.jar
```

In a container, mount or package the approved agent and inject
configuration through the deployment platform. Do not bake secrets into
the image.

### 19.4 Custom business span

Use custom spans only where they add business or diagnostic meaning.

``` java
import io.opentelemetry.api.trace.Span;
import io.opentelemetry.api.trace.Tracer;
import io.opentelemetry.api.trace.StatusCode;
import io.opentelemetry.context.Scope;
import org.springframework.stereotype.Service;

@Service
public class LoanEligibilityService {
    private final Tracer tracer;

    public LoanEligibilityService(Tracer tracer) {
        this.tracer = tracer;
    }

    public EligibilityResult evaluate(LoanRequest request) {
        Span span = tracer.spanBuilder("retirement.loan.eligibility")
                .startSpan();

        try (Scope ignored = span.makeCurrent()) {
            span.setAttribute("transaction.type", "RETIREMENT_LOAN");
            span.setAttribute("transaction.stage", "ELIGIBILITY_CHECK");

            EligibilityResult result = performEligibilityCheck(request);

            // Use controlled, non-sensitive values only.
            span.setAttribute(
                "transaction.outcome",
                result.isEligible() ? "ELIGIBLE" : "NOT_ELIGIBLE"
            );
            return result;
        } catch (RuntimeException ex) {
            span.recordException(ex);
            span.setStatus(StatusCode.ERROR, "Eligibility evaluation failed");
            throw ex;
        } finally {
            span.end();
        }
    }

    private EligibilityResult performEligibilityCheck(LoanRequest request) {
        // Business implementation omitted.
        throw new UnsupportedOperationException("Implement business logic");
    }
}
```

Do not add names, account numbers, policy numbers, raw request payloads,
or other personal data as span attributes.

### 19.5 Health endpoints

For Spring Boot Actuator, expose liveness and readiness separately.
Readiness may include dependencies required to serve traffic; liveness
should generally indicate whether the process itself is functioning. Do
not make liveness fail merely because a transient downstream dependency
is unavailable, as this can cause restart loops.

Example configuration shape:

``` yaml
management:
  endpoint:
    health:
      probes:
        enabled: true
  endpoints:
    web:
      exposure:
        include: health,info,prometheus
```

Expose only approved endpoints and secure them according to the platform
standard.

### 19.6 Java acceptance checks

-   A request creates a server span.
-   Outbound HTTP calls create child spans and propagate trace context.
-   Logs emitted during a request contain matching trace and span
    identifiers.
-   Exceptions set appropriate span status and safe error attributes.
-   Service resource attributes are present.
-   Health probes behave correctly during dependency degradation.
-   No sensitive data or unbounded metric labels are emitted.

------------------------------------------------------------------------

## 20. Python / FastAPI Reference Implementation

### 20.1 Dependencies

Install approved, mutually compatible versions of the OpenTelemetry
packages. Typical packages include:

``` bash
pip install \
  fastapi \
  uvicorn \
  opentelemetry-api \
  opentelemetry-sdk \
  opentelemetry-exporter-otlp \
  opentelemetry-instrumentation-fastapi \
  opentelemetry-instrumentation-requests
```

Pin versions in the project's lock file. Use additional instrumentations
only for libraries actually used by the service.

### 20.2 Application instrumentation

``` python
from fastapi import FastAPI
from opentelemetry import trace
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

resource = Resource.create({
    "service.name": "claims-api",
    "service.namespace": "benefits",
    "service.version": "1.0.0",
    "deployment.environment.name": "dev",
    "team.owner": "benefits-platform"
})

provider = TracerProvider(resource=resource)
provider.add_span_processor(
    BatchSpanProcessor(OTLPSpanExporter())
)
trace.set_tracer_provider(provider)

tracer = trace.get_tracer(__name__)

app = FastAPI()
FastAPIInstrumentor.instrument_app(app)

@app.get("/health/live")
def liveness():
    return {"status": "alive"}

@app.get("/health/ready")
def readiness():
    # Add approved readiness checks here.
    return {"status": "ready"}

@app.post("/claims/{claim_type}/review")
def review_claim(claim_type: str):
    with tracer.start_as_current_span("claim.review") as span:
        span.set_attribute("business.domain", "benefits")
        span.set_attribute("transaction.type", "CLAIM_REVIEW")
        span.set_attribute("transaction.stage", "REVIEW")
        span.set_attribute("claim.type", claim_type)

        # Invoke application logic here.
        return {"status": "accepted"}
```

This is a starter example. Add approved logging correlation, metric
instruments, exception handling, shutdown/flush handling, and dependency
instrumentation before production use.

### 20.3 Runtime configuration

``` bash
export OTEL_EXPORTER_OTLP_ENDPOINT="http://otel-collector:4317"
export OTEL_EXPORTER_OTLP_PROTOCOL="grpc"
export OTEL_PROPAGATORS="tracecontext,baggage"
export OTEL_SERVICE_NAME="claims-api"
export OTEL_RESOURCE_ATTRIBUTES="service.namespace=benefits,deployment.environment.name=dev"
```

### 20.4 Python acceptance checks

-   FastAPI inbound requests create spans.
-   Supported outbound clients propagate W3C trace context.
-   Logs are correlated with active trace context.
-   Exceptions are visible without exposing sensitive payloads.
-   Service metadata is present.
-   Readiness and liveness checks have distinct semantics.

------------------------------------------------------------------------

## 21. Node.js / Express Reference Implementation

### 21.1 Dependencies

Use versions approved for the organisation's Node.js runtime:

``` bash
npm install express
npm install @opentelemetry/api \
  @opentelemetry/sdk-node \
  @opentelemetry/auto-instrumentations-node \
  @opentelemetry/exporter-trace-otlp-grpc \
  @opentelemetry/resources \
  @opentelemetry/semantic-conventions
```

Pin versions in the lock file. Check compatibility between the SDK,
auto-instrumentation packages, and runtime.

### 21.2 Initialise telemetry before application imports

Create `instrumentation.js`:

``` javascript
const { NodeSDK } = require("@opentelemetry/sdk-node");
const {
  getNodeAutoInstrumentations
} = require("@opentelemetry/auto-instrumentations-node");
const {
  OTLPTraceExporter
} = require("@opentelemetry/exporter-trace-otlp-grpc");
const { resourceFromAttributes } = require("@opentelemetry/resources");

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    "service.name": "payments-api",
    "service.namespace": "payments",
    "service.version": "1.0.0",
    "deployment.environment.name": process.env.DEPLOYMENT_ENV || "dev"
  }),
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT
  }),
  instrumentations: [getNodeAutoInstrumentations()]
});

sdk.start();

process.on("SIGTERM", async () => {
  await sdk.shutdown();
  process.exit(0);
});
```

Start the application with instrumentation loaded first:

``` bash
node -r ./instrumentation.js server.js
```

### 21.3 Express application

``` javascript
const express = require("express");
const { trace, SpanStatusCode } = require("@opentelemetry/api");

const app = express();
const tracer = trace.getTracer("payments-api");

app.get("/health/live", (_req, res) => {
  res.json({ status: "alive" });
});

app.get("/health/ready", (_req, res) => {
  // Add approved readiness checks.
  res.json({ status: "ready" });
});

app.post("/payments/:paymentType/submit", async (req, res, next) => {
  await tracer.startActiveSpan("payment.submit", async (span) => {
    try {
      span.setAttribute("business.domain", "payments");
      span.setAttribute("transaction.type", "PAYMENT");
      span.setAttribute("transaction.stage", "SUBMIT");
      span.setAttribute("payment.type", req.params.paymentType);

      // Invoke application logic here.
      res.status(202).json({ status: "accepted" });
    } catch (error) {
      span.recordException(error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: "Payment submission failed"
      });
      next(error);
    } finally {
      span.end();
    }
  });
});

app.listen(process.env.PORT || 3000);
```

This is a starter example. Add approved metrics, structured log
correlation, dependency instrumentation, graceful shutdown, and central
error middleware before production use.

### 21.4 Node.js acceptance checks

-   Telemetry initialises before framework/database modules.
-   HTTP inbound and outbound operations are traced.
-   Trace context is propagated to supported downstream clients.
-   Shutdown flushes telemetry.
-   Errors are recorded and classified safely.
-   Resource metadata is correct.

------------------------------------------------------------------------

## 22. OpenTelemetry Collector Reference Configuration

The Collector can receive telemetry, apply processing, and export it to
approved backends. The following is a **configuration template**, not a
production-ready universal configuration. Exporter names,
authentication, TLS, endpoints, and supported components depend on the
Collector distribution and approved backend.

``` yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

processors:
  memory_limiter:
    check_interval: 1s
    limit_mib: 512
    spike_limit_mib: 128

  batch:
    timeout: 5s
    send_batch_size: 1024

  attributes/safe_defaults:
    actions:
      - key: environment
        action: delete
        # Example only: use explicit allow/deny rules approved by security.

exporters:
  debug:
    verbosity: basic

  otlp/approved-backend:
    endpoint: ${env:OTEL_BACKEND_ENDPOINT}
    tls:
      insecure: false
    headers:
      authorization: ${env:OTEL_BACKEND_AUTH_HEADER}

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [memory_limiter, attributes/safe_defaults, batch]
      exporters: [otlp/approved-backend]

    metrics:
      receivers: [otlp]
      processors: [memory_limiter, attributes/safe_defaults, batch]
      exporters: [otlp/approved-backend]

    logs:
      receivers: [otlp]
      processors: [memory_limiter, attributes/safe_defaults, batch]
      exporters: [otlp/approved-backend]
```

Important: - The example exporter is generic. Confirm that the selected
Collector distribution includes the required exporter. - Do not set
insecure TLS in production. - Use a secret manager or approved workload
identity for credentials. - Implement explicit redaction and filtering
rules; the example processor above is not a complete privacy policy. -
Configure queueing, retry, persistent storage, resource limits, health
checks, and telemetry about the Collector itself for production. - Do
not route all signals to every backend by default. Define purpose-based
routing and cost controls.

### 22.1 Collector validation checklist

-   Configuration validates against the deployed Collector distribution.
-   Receivers are not exposed beyond approved network boundaries.
-   TLS and authentication are configured.
-   Memory limiter and batching are enabled.
-   Retry and sending queues are configured appropriately.
-   Sensitive attributes are filtered or redacted.
-   Collector self-telemetry is monitored.
-   Export failures and dropped telemetry are alerted.
-   Capacity and scaling are load-tested.

------------------------------------------------------------------------

## 23. AWS Infrastructure Reference Patterns

The following examples illustrate where observability configuration
belongs. Adapt resource names, IAM, networking, encryption, retention,
and deployment settings to enterprise CDK/Terraform modules.

### 23.1 ECS task environment configuration (AWS CDK / TypeScript)

``` typescript
import * as ecs from "aws-cdk-lib/aws-ecs";

// Within a task definition/container definition:
container.addEnvironment("OTEL_SERVICE_NAME", "orders-api");
container.addEnvironment(
  "OTEL_RESOURCE_ATTRIBUTES",
  [
    "service.namespace=commerce",
    "deployment.environment.name=production",
    "team.owner=commerce-platform"
  ].join(",")
);
container.addEnvironment(
  "OTEL_EXPORTER_OTLP_ENDPOINT",
  "http://otel-collector.internal:4317"
);
container.addEnvironment("OTEL_EXPORTER_OTLP_PROTOCOL", "grpc");
container.addEnvironment("OTEL_PROPAGATORS", "tracecontext,baggage");
```

Prefer service discovery or an approved Collector endpoint. Do not
hardcode secrets or environment-specific values in source code.

### 23.2 Lambda instrumentation design

For Lambda, define a standard that covers: - Approved OpenTelemetry
Lambda layer or wrapper/extension. - Function name and version as
service metadata. - Trace propagation from API Gateway, SQS,
EventBridge, and other supported triggers. - Cold-start and invocation
metrics. - Timeout, throttling, concurrency, and error metrics. - Export
strategy compatible with the function's execution model. -
Flush/shutdown behaviour and cost implications.

A Lambda deployment pattern should be tested for cold starts,
short-lived execution, retries, partial batch failures, and asynchronous
invocation semantics.

### 23.3 SQS and EventBridge

For event-driven workloads: - Propagate trace context in message
attributes or the approved event envelope. - Preserve business
transaction identity separately from trace context. - Record publish,
receive, processing start, processing completion, retry, and DLQ
events. - Monitor queue depth, oldest-message age, processing latency,
retries, and DLQ count. - Distinguish poison messages, transient errors,
and valid business rejections. - Ensure idempotency and duplicate
delivery are represented correctly.

### 23.4 Infrastructure-as-Code module contract

Each reusable CDK/Terraform pattern should document:

  Contract item   Requirement
  --------------- --------------------------------------------------------------
  Inputs          Service name, environment, owner, domain, criticality
  Outputs         Resource identifiers and telemetry integration endpoints
  IAM             Least-privilege permissions for telemetry export
  Networking      Approved private connectivity and egress
  Encryption      TLS in transit and approved encryption at rest
  Logging         Standard log group/stream configuration and retention
  Metrics         Native metrics and custom metric requirements
  Tracing         Supported propagation and instrumentation method
  Alerts          Ownership, thresholds, runbook, and routing
  Cost            Expected ingestion, retention, and query cost
  Tests           Synth/plan checks, policy tests, and deployment verification

Do not create one generic construct that hides materially different
runtime behaviour. Prefer composable patterns with clear inputs and
defaults.

------------------------------------------------------------------------

## 24. Metrics, Queries, Dashboards, and Alerts

Query syntax depends on the telemetry backend. The examples below use
PromQL-style expressions to illustrate metric intent. Translate them to
the organisation's approved backend and validate metric names and labels
against actual instrumentation.

### 24.1 Example RED metric definitions

  -----------------------------------------------------------------------------------------------
  Metric                                          Type                    Meaning
  ----------------------------------------------- ----------------------- -----------------------
  `http_server_requests_total`                    Counter                 Number of inbound
                                                                          requests

  `http_server_request_duration_seconds`          Histogram               Request duration
                                                                          distribution

  `messaging_messages_processed_total`            Counter                 Messages processed

  `messaging_processing_duration_seconds`         Histogram               Message processing
                                                                          duration

  `business_transactions_completed_total`         Counter                 Completed business
                                                                          transactions

  `business_transaction_stage_duration_seconds`   Histogram               Duration of business
                                                                          stages
  -----------------------------------------------------------------------------------------------

Metric names are examples. Follow the metric conventions supported by
the chosen instrumentation and backend.

### 24.2 Example PromQL queries

Request rate:

``` promql
sum by (service_name) (
  rate(http_server_requests_total[5m])
)
```

Error ratio:

``` promql
sum(rate(http_server_requests_total{status_class="5xx"}[5m]))
/
clamp_min(sum(rate(http_server_requests_total[5m])), 1)
```

p95 latency:

``` promql
histogram_quantile(
  0.95,
  sum by (le, service_name) (
    rate(http_server_request_duration_seconds_bucket[5m])
  )
)
```

Queue oldest-message age (if exported as a gauge):

``` promql
max by (queue_name) (messaging_queue_oldest_message_age_seconds)
```

Validate label names and metric names against the actual exporter. Avoid
unbounded labels.

### 24.3 Standard dashboard sections

A service overview dashboard should contain:

1.  Service identity, owner, environment, criticality, and current
    version.
2.  Traffic: request rate and transaction volume.
3.  Reliability: success rate, error rate, and SLO status.
4.  Latency: p50, p95, p99 as appropriate.
5.  Dependencies: downstream error and latency.
6.  Saturation: CPU, memory, concurrency, connections, queue depth.
7.  Deployments: release markers, rollbacks, and configuration changes.
8.  Tracing: representative traces and dependency breakdown.
9.  Logs: correlated errors and recent error trends.
10. Operations: alerts, runbook, and ownership links.

A business journey dashboard should additionally show
initiated/completed/pending/failed volumes, stage-level latency, stage
failure/rejection breakdown, end-to-end duration, and reconciliation
exceptions.

### 24.4 Alert design template

Every production alert should specify:

-   Alert name and affected service.
-   Signal and query.
-   Threshold or SLO burn-rate condition.
-   Evaluation window and required duration.
-   Severity and paging policy.
-   Owner/team and escalation route.
-   Runbook and dashboard links.
-   Suppression/maintenance behaviour.
-   Known false-positive conditions.

### 24.5 Burn-rate concept

For an SLO with an allowed error ratio, burn rate is:

``` text
burn_rate = observed_error_ratio / allowed_error_ratio
```

Use multi-window burn-rate policies rather than paging on a single
short-lived spike. Exact windows and thresholds should be agreed with
SRE and configured in Nobl9 or the approved alerting platform. Do not
duplicate competing alert policies across multiple systems without an
explicit ownership model.

------------------------------------------------------------------------

## 25. Nobl9 Configuration and Workflow Examples

Nobl9 resource schemas and CLI behaviour can vary by product version and
organisation configuration. Treat the examples below as **configuration
design templates**. Before applying them, export an existing known-good
resource from the organisation and validate the exact schema with the
installed `sloctl` version.

### 25.1 Example project/service/SLO design

``` yaml
# DESIGN TEMPLATE ONLY — validate apiVersion and schema with your Nobl9 version.
apiVersion: n9/v1alpha
kind: Project
metadata:
  name: retirement-platform
  displayName: Retirement Platform
```

``` yaml
# DESIGN TEMPLATE ONLY — validate required fields and schema.
apiVersion: n9/v1alpha
kind: Service
metadata:
  name: retirement-api
  displayName: Retirement API
  project: retirement-platform
  labels:
    environment: production
    business-domain: retirement
    team: retirement-platform
    criticality: tier-1
```

An SLO definition must identify its service, indicator/data source, good
and total events (or an equivalent ratio), objective, time window, and
any alert policy. The exact YAML shape depends on the Nobl9 SLI provider
and schema. Use a real SLO exported from the organisation as the
starting template rather than applying a guessed schema.

### 25.2 SLO definition review checklist

-   Is the service the correct logical ownership unit?
-   Does the SLI represent user-visible or operationally meaningful
    behaviour?
-   Are numerator and denominator correct?
-   Are valid business rejections excluded from technical error counts?
-   Are exclusions explicit and defensible?
-   Is the measurement window appropriate?
-   Is the data source reliable and sufficiently available?
-   Does the service owner agree with the target?
-   Are labels and annotations standardised?
-   Is the alert policy actionable?
-   Is there a runbook and review date?

### 25.3 Example `sloctl` workflow

The commands below are illustrative; confirm flags and resource names
against the installed CLI.

``` bash
# Inspect CLI and authentication first
sloctl version
sloctl get projects

# Validate a resource file (confirm exact command syntax for installed version)
sloctl validate --file nobl9/slos/retirement-api-availability.yaml

# Apply only after review and validation
sloctl apply --file nobl9/slos/retirement-api-availability.yaml
```

Use a pull request, code review, service-owner approval, controlled
credentials, and post-apply verification. Do not apply bulk changes from
an unreviewed export.

### 25.4 Suggested Nobl9 governance workflow

1.  Discover existing projects, services, SLOs, labels, and alert
    policies.
2.  Map each service to an accountable team and repository.
3.  Identify duplicates, missing owners, missing critical services, and
    weak indicators.
4.  Agree a canonical project/service model.
5.  Define naming and label conventions.
6.  Convert approved SLO definitions to version-controlled
    configuration.
7.  Validate changes in CI.
8.  Apply through a controlled deployment identity.
9.  Review error budgets and SLO quality periodically.

------------------------------------------------------------------------

## 26. GitHub Actions CI/CD Example

This workflow illustrates a validation stage. Replace placeholders with
approved action versions, runners, secrets, and commands. Pin
third-party actions to immutable commit SHAs under enterprise policy.

``` yaml
name: observability-policy

on:
  pull_request:
    paths:
      - "src/**"
      - "infra/**"
      - "nobl9/**"
      - "observability/**"

jobs:
  observability-checks:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Check required service metadata
        run: |
          test -f observability/service.yaml
          grep -q "service.name" observability/service.yaml
          grep -q "deployment.environment.name" observability/service.yaml

      - name: Check structured logging and tracing policy
        run: |
          python tools/observability/check_service.py \
            --manifest observability/service.yaml \
            --source src/

      - name: Validate Nobl9 definitions
        if: hashFiles('nobl9/**/*.yaml') != ''
        run: |
          # Install the organisation-approved sloctl version first.
          sloctl validate --file nobl9/

      - name: Publish assessment report
        if: always()
        run: |
          echo "Attach the generated observability report as a PR artifact/comment."
```

The `check_service.py` and `sloctl validate` invocation are placeholders
until the organisation's actual policy checker and CLI syntax are
implemented. Do not treat this illustrative workflow as a working
pipeline without those components.

### 26.1 Suggested policy outcomes

-   **Pass:** all mandatory baseline requirements are met.
-   **Warning:** recommended control is missing or a legacy exception
    exists.
-   **Fail:** mandatory control is missing for a new production service
    or an unapproved critical-service change.
-   **Exception:** approved, time-bound waiver with compensating control
    and remediation owner.

------------------------------------------------------------------------

## 27. OIA Starter Project Structure and Assessment Contract

### 27.1 Suggested project structure

``` text
oia/
├── app/
│   ├── main.py
│   ├── api/
│   ├── models/
│   └── workflows/
├── connectors/
│   ├── github.py
│   ├── nobl9.py
│   └── telemetry.py
├── rules/
│   ├── service_identity.py
│   ├── logging_checks.py
│   ├── tracing_checks.py
│   ├── metrics_checks.py
│   └── slo_checks.py
├── schemas/
│   └── assessment-result.schema.json
├── tests/
└── requirements.txt
```

### 27.2 Minimal FastAPI assessment endpoint

``` python
from enum import Enum
from typing import List
from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="Observability Intelligence Agent")

class Severity(str, Enum):
    critical = "critical"
    high = "high"
    medium = "medium"
    low = "low"
    info = "info"

class Finding(BaseModel):
    rule_id: str
    service: str
    severity: Severity
    title: str
    evidence: List[str] = Field(default_factory=list)
    recommendation: str
    confidence: float = Field(ge=0.0, le=1.0)

class AssessmentRequest(BaseModel):
    repository: str
    service: str
    environment: str

class AssessmentResponse(BaseModel):
    assessment_id: str
    status: str
    findings: List[Finding]

@app.get("/health/live")
def liveness():
    return {"status": "alive"}

@app.post("/assess", response_model=AssessmentResponse)
def assess(request: AssessmentRequest):
    # Replace with authenticated repository/configuration connectors
    # and deterministic policy rules. Do not fabricate evidence.
    findings = [
        Finding(
            rule_id="OBS-002",
            service=request.service,
            severity=Severity.medium,
            title="Trace propagation evidence not yet assessed",
            evidence=["Connector implementation is not configured"],
            recommendation="Connect the approved source repository and inspect instrumentation.",
            confidence=1.0
        )
    ]
    return AssessmentResponse(
        assessment_id="example-assessment",
        status="incomplete",
        findings=findings
    )
```

This is an API skeleton, not a complete agent. The example finding
explicitly reports missing assessment capability rather than claiming
the service has a real observability defect.

### 27.3 Assessment rule contract

Each deterministic rule should return: - Rule ID and standard version. -
Service and repository reference. - Pass, fail, warning, or not-assessed
status. - Evidence locations (file path, line, configuration key, or
source link). - Severity and rationale. - Remediation mapped to a
pattern ID. - Confidence and limitations.

### 27.4 OIA execution stages

``` text
Request
  |
  v
Authenticate and authorise
  |
  v
Discover service and repository metadata
  |
  v
Collect configuration and approved telemetry evidence
  |
  v
Run deterministic policy checks
  |
  v
Correlate findings with approved patterns
  |
  v
Optional LLM explanation / prioritisation
  |
  v
Human review
  |
  v
Report or approved pull-request comment
```

Use deterministic checks for compliance decisions. Use an LLM to
summarise, explain, or prioritise evidence---not to invent missing
evidence or bypass policy rules.

------------------------------------------------------------------------

## 28. Testing and Validation Strategy

### 28.1 Instrumentation tests

Verify: - Expected resource attributes are present. - HTTP server/client
spans are emitted. - Exceptions are recorded safely. - Log records
correlate with active trace context. - Metrics have expected names,
units, and bounded dimensions. - Exporter failures are observable.

### 28.2 Context propagation tests

Test at least: - Service A → Service B over HTTP. - Producer → queue →
consumer. - Retry and redelivery. - Scheduled or delayed processing. -
Fan-out/fan-in workflows. - External dependency boundary.

Verify trace context and business transaction correlation independently.

### 28.3 Policy tests

Test: - Missing service name fails. - Missing owner produces the agreed
warning/failure. - Missing tracing instrumentation is detected where
required. - Sensitive attributes are rejected or redacted. -
High-cardinality metric labels are detected. - Critical production
service without an approved SLO is flagged. - Expired exceptions are
rejected.

### 28.4 Operational tests

-   Collector restart and exporter outage.
-   Backend throttling or temporary unavailability.
-   Telemetry queue saturation.
-   Application shutdown and telemetry flush.
-   High-volume load and sampling behaviour.
-   Alert delivery and runbook usability.
-   Deployment rollback correlation.

Do not allow telemetry outages to cause application outages unless
explicitly required by a risk decision. Telemetry pipelines should
normally fail safely, with bounded buffering and clear dropped-data
signals.

------------------------------------------------------------------------

## 29. Operational Runbook Template

Every critical service should have a runbook with:

1.  Service purpose, owner, criticality, and dependencies.
2.  Dashboard and Nobl9 service/SLO links.
3.  Common alerts and their meaning.
4.  First-response diagnostic steps.
5.  How to find a trace from a request or business transaction.
6.  How to correlate logs, metrics, traces, and deployment changes.
7.  Known failure modes and safe mitigations.
8.  Escalation contacts and incident channels.
9.  Rollback or failover procedure.
10. Data and security handling warnings.
11. Last validation date and document owner.

------------------------------------------------------------------------

## 30. Implementation Completion Checklist

A service can be considered onboarded to the baseline when the service
owner can demonstrate:

-   [ ] Stable service identity and ownership metadata.
-   [ ] Structured logs with consistent severity and safe error codes.
-   [ ] Trace instrumentation for inbound and outbound operations.
-   [ ] W3C context propagation across supported service boundaries.
-   [ ] Log-to-trace correlation.
-   [ ] RED metrics for request-driven workloads or equivalent
    workload-specific metrics.
-   [ ] Health and readiness checks with correct semantics.
-   [ ] Dependency and infrastructure visibility appropriate to the
    workload.
-   [ ] No prohibited sensitive data in telemetry.
-   [ ] Bounded metric dimensions and approved sampling.
-   [ ] SLO defined for critical services and reviewed by the owner.
-   [ ] Actionable alerts with runbooks and ownership.
-   [ ] Deployment/configuration change correlation.
-   [ ] CI/CD observability checks.
-   [ ] Exception recorded for any unmet mandatory requirement.
-   [ ] Operational validation completed and documented.

------------------------------------------------------------------------

## Appendix E. Official Technical References

Use current documentation and verify versions before implementation:

-   OpenTelemetry Semantic Conventions:
    https://opentelemetry.io/docs/specs/semconv/
-   OpenTelemetry Context Propagation:
    https://opentelemetry.io/docs/concepts/context-propagation/
-   OpenTelemetry Resources:
    https://opentelemetry.io/docs/concepts/resources/
-   OpenTelemetry documentation: https://opentelemetry.io/docs/
-   Nobl9 documentation: https://docs.nobl9.com/
-   Nobl9 `sloctl` documentation: https://docs.nobl9.com/sloctl/
