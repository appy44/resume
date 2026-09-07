# Credential & Certificate Lifecycle Management Platform

## 1. Executive Summary

The organization currently manages application credentials and certificates across multiple platforms and environments. Expiry monitoring and renewal are partially manual:

1. Teams monitor certificate/credential expiry.
2. An existing notification system alerts teams when expiry is approaching.
3. Teams manually renew or replace the credential/certificate.
4. Application/server configuration is updated.
5. Some applications/servers require a restart.
6. The process depends heavily on human ownership and timely action.

This creates operational risk, inconsistent processes, missed renewals, duplicate effort, and dependency on individual team members.

The proposed solution is a centralized **Credential & Certificate Lifecycle Management Platform (System A)**.

System A will:

- Maintain a centralized inventory of credentials and certificates.
- Receive events/notifications from HashiCorp Vault, Microsoft Entra ID/Azure services, AWS, and other credential providers where supported.
- Perform initial discovery/baseline onboarding for credentials that already exist.
- Periodically reconcile source systems with the central inventory.
- Monitor expiry dates through scheduled jobs.
- Send escalating notifications based on configurable thresholds.
- Create Jira tickets and ServiceNow incidents when required.
- Trigger Xmatters/on-call escalation for critical situations.
- Track ownership, application, environment, criticality, and operational metadata.
- Keep renewal/deployment automation separate from expiry monitoring.
- Support selective future automation for renewal and deployment where an application has a safe, tested reload mechanism.

### Core principle

> **Automate detection, monitoring, notification, and escalation first. Automate renewal/deployment only where the target application and infrastructure support it safely. Never perform a blind application restart because a certificate was renewed.**

---

# 2. Context

The organization has credentials and certificates distributed across multiple environments and technology platforms.

Examples include:

- TLS/SSL certificates
- Client certificates
- CA certificates
- API credentials
- API keys
- Database credentials
- Service account credentials
- OAuth client secrets
- Azure/Entra application secrets/certificates
- AWS credentials
- On-premises application certificates
- HashiCorp Vault-managed credentials/certificates
- Other platform-specific credentials

Some on-premises applications already use HashiCorp Vault.

The current operational process can involve:

```text
Credential / Certificate
        |
        v
Expiry monitoring
        |
        v
Notification
        |
        v
Human action
        |
        +--> Renew credential/certificate
        |
        +--> Update application/server
        |
        +--> Restart/reload application
        |
        v
Completed
```

The objective is not necessarily to replace every existing system. The objective is to create a centralized lifecycle-management and orchestration layer.

---

# 3. Problem Statement

## 3.1 Manual monitoring

Teams have to monitor expiry dates and react before credentials/certificates expire.

This creates dependency on:

- Human memory
- Manual spreadsheets
- Individual team members
- Team-specific processes
- Manual calendar reminders
- Manual checks in different systems

## 3.2 Existing credentials are difficult to onboard

If System A starts today and only listens for future events, it will know only about credentials that change after onboarding.

Example:

```text
Existing credentials before System A
------------------------------------
Certificate A -> expires in 8 days
Certificate B -> expires in 30 days
Certificate C -> expires in 90 days
```

If System A starts listening tomorrow:

```text
Certificate D created
       |
       v
Event
       |
       v
System A
```

System A will know about Certificate D, but not necessarily A, B, or C.

Therefore, a **one-time baseline discovery/import** is required.

## 3.3 Missed events

An event-driven-only design has another weakness.

```text
Source system
    |
    v
Credential changed
    |
    v
Event generated
    |
    X
System A temporarily unavailable
```

If the event is lost, System A may retain stale data.

Therefore, the platform must also perform periodic reconciliation.

## 3.4 Ownership ambiguity

Knowing that a certificate expires is not enough.

The platform must know:

- Application
- Environment
- Client
- Owner team
- Owner/contact
- Criticality
- Jira project
- ServiceNow assignment group
- Xmatters/on-call group
- Source system

Otherwise the platform may detect an expiry but be unable to route the alert correctly.

## 3.5 Restart risk

A certificate renewal does not automatically imply that an application should be restarted.

Different applications behave differently:

- Some support live TLS reload.
- Some support configuration reload.
- Some require a restart.
- Some require a controlled maintenance window.
- Some have multiple certificates with different expiry dates.
- Some share infrastructure with other applications.
- Some certificates are used only for specific inbound/outbound connections.

Therefore:

> **Automatic restart must never be a generic consequence of certificate renewal.**

---

# 4. Goals

## Primary goals

1. Centralize credential/certificate inventory.
2. Reduce manual expiry monitoring.
3. Automatically discover future changes where integrations are available.
4. Support initial onboarding of existing credentials.
5. Periodically reconcile inventory with source systems.
6. Provide configurable expiry thresholds.
7. Automatically send notifications.
8. Automatically create Jira tickets when required.
9. Automatically create/update ServiceNow incidents.
10. Trigger Xmatters/on-call escalation for critical cases.
11. Track ownership and accountability.
12. Provide auditability and operational reporting.
13. Create a foundation for future safe renewal automation.

## Secondary goals

- Detect inventory discrepancies.
- Identify credentials with unknown expiry.
- Identify credentials without owners.
- Identify unmanaged certificates.
- Identify duplicate records.
- Identify expired credentials.
- Provide dashboards and reporting.
- Measure reduction in manual effort.

---

# 5. Non-Goals

The initial implementation should **not** attempt to:

- Automatically restart every application.
- Automatically rotate every credential.
- Store secret values/private keys unnecessarily.
- Replace HashiCorp Vault.
- Replace Azure/Entra ID.
- Replace AWS credential-management capabilities.
- Replace Jira, ServiceNow, or Xmatters.
- Assume all applications have the same renewal process.

System A should be the **inventory, monitoring, decision, and orchestration layer**, not another secret store.

---

# 6. Proposed Solution

## 6.1 High-level model

```text
                  SOURCE SYSTEMS
                       |
        +--------------+--------------+
        |              |              |
        v              v              v
      Vault         Entra ID         AWS
        |              |              |
        +--------------+--------------+
                       |
                Events / APIs
                       |
                       v
              +----------------+
              |   SYSTEM A     |
              |                |
              | Event Ingestion|
              | Discovery      |
              | Reconciliation |
              | Inventory      |
              | Expiry Engine  |
              | Notification   |
              +-------+--------+
                      |
             +--------+--------+
             |        |        |
             v        v        v
           Email     Jira    ServiceNow
                              |
                              v
                           Xmatters
```

---

# 7. System A Responsibilities

## 7.1 Event Ingestion API

Receives changes from external systems.

Possible inputs:

- Webhooks
- Event streams
- Audit events
- Message queues
- Source APIs
- Integration adapters

Example:

```text
Certificate created
       |
       v
Vault / Source
       |
       v
Event
       |
       v
System A API
       |
       v
Create inventory record
```

## 7.2 Discovery Engine

Finds existing credentials/certificates.

Possible discovery sources:

- Vault APIs
- Entra/Azure APIs
- AWS APIs
- Server agents
- Windows certificate store
- Linux certificate directories
- TLS endpoint scanning
- Load balancers
- Existing CMDB
- Existing certificate inventory
- One-time admin-provided inventory

## 7.3 Reconciliation Engine

Compares source-of-truth data with System A.

Example:

```text
System A:
Certificate X -> expires 30-Sep

Source:
Certificate X -> expires 30-Nov

             |
             v

       Mismatch detected
             |
             v

      Update inventory
             |
             v

      Record audit event
```

## 7.4 Credential Inventory

Stores metadata required for lifecycle management.

Example fields:

```text
credential_id
credential_type
source_system
source_identifier
client
application
environment
server
endpoint
owner_team
owner_email
criticality
issue_date
expiry_date
status
last_seen
last_reconciled
jira_project
servicenow_assignment_group
xmatters_group
renewal_status
deployment_status
```

Do not store secret values unless there is a strong, documented reason.

---

# 8. Initial Data Population

A major requirement is handling credentials that existed before System A.

Use multiple mechanisms.

## 8.1 One-time admin/team import

Teams can provide an initial inventory:

```text
application
environment
credential_type
expiry_date
owner_team
criticality
```

This can be CSV/API based.

Example:

```text
app1,prod,TLS,2026-10-20,Team-A,P1
app2,prod,API_SECRET,2026-09-15,Team-B,P2
```

This is appropriate for Phase 1.

## 8.2 Automated discovery

System A can discover certificates from:

- Vault
- Azure/Entra
- AWS
- Windows certificate stores
- Linux filesystem locations
- Application-specific certificate directories
- Load balancers
- Network endpoints

## 8.3 TLS endpoint scanning

For certificates presented by network services:

```text
https://application.company.com:443
        |
        v
TLS handshake
        |
        v
Presented certificate
        |
        v
Extract expiry/fingerprint/subject/SAN
```

This is useful because it measures the certificate actually presented by the endpoint.

Limitations include:

- Private endpoints
- mTLS
- Load balancers
- SNI
- Certificates not exposed over network
- Certificates stored but not currently used

## 8.4 Recommended baseline strategy

Use:

```text
One-time admin import
        +
Automated source discovery
        +
Server/endpoint discovery where applicable
```

Then reconcile all sources.

---

# 9. Event-Driven Updates

Once the initial baseline exists, future changes should update System A automatically.

Example:

```text
Existing certificate
       |
       v
Certificate renewed
       |
       v
Source generates event
       |
       v
System A ingestion API
       |
       v
Update expiry date
       |
       v
Continue monitoring
```

This eliminates manual inventory updates for integrated sources.

Important:

> Event integration should be treated as a near-real-time update mechanism, not the only source of truth.

---

# 10. Scheduled Monitoring

System A should have a scheduler.

A daily job is sufficient for most expiry use cases, although the frequency should be configurable.

Example:

```text
Every day at 06:00
        |
        v
Fetch active credentials
        |
        v
Calculate remaining validity
        |
        v
Apply notification policy
        |
        v
Send actions
```

---

# 11. Expiry Rules

A configurable policy could initially be:

```text
>15 days remaining
    -> No alert

<=15 days
    -> Daily team email

<=7 days
    -> Jira ticket
    -> ServiceNow incident
    -> Xmatters alert

<=3 days
    -> Escalate

<=1 day
    -> Critical escalation

Expired
    -> Emergency/critical process
```

These values should be configuration rather than hardcoded.

---

# 12. Avoiding Duplicate Tickets

The scheduler must be stateful.

Example:

```text
7 days remaining
    |
    +--> Create Jira ticket #123
    +--> Create ServiceNow incident #456
    +--> Trigger Xmatters

6 days remaining
    |
    +--> Do NOT create Jira #124
    +--> Do NOT create ServiceNow #457
    +--> Update/escalate existing records if required
```

Inventory should store:

```text
jira_ticket_id
servicenow_incident_id
xmatters_event_id
last_alert_level
last_alert_time
```

---

# 13. Ownership and Routing

Each record should have an owner.

Example:

```text
Credential
    |
    +-- Application: Payment Service
    +-- Environment: Production
    +-- Owner: Payments Team
    +-- Email: payments@company
    +-- Criticality: P1
    +-- Jira Project: PAY
    +-- ServiceNow Group: Payments-Operations
    +-- Xmatters Group: Payments-OnCall
```

If ownership is missing:

```text
Credential
    |
    v
Owner unknown
    |
    v
Governance / inventory exception
    |
    v
Platform administration team
```

---

# 14. Credential Types

The inventory should support multiple credential types:

```text
TLS certificate
Client certificate
CA certificate
API key
API secret
Database password
OAuth client secret
OAuth certificate
Service account credential
AWS credential
SSH key
Signing certificate
Other
```

Each type may have different discovery and renewal mechanisms.

Therefore the platform should use a generic model with source/type-specific adapters.

---

# 15. Unknown Expiry

Not every source exposes expiry in the same way.

Possible states:

```text
expiry_known
expiry_unknown
non_expiring
not_applicable
```

Do not interpret:

```text
expiry unknown
```

as:

```text
safe
```

Unknown expiry should be reported as an inventory-quality issue.

---

# 16. Renewal vs Deployment

This distinction is central to the design.

## Renewal

Obtaining a new credential/certificate.

```text
Vault PKI
    |
    v
New certificate
```

## Deployment

Making the application use the new certificate.

```text
New certificate
    |
    v
Keystore/file/certificate store
    |
    v
Application reload/restart
```

These are separate operations.

---

# 17. Application Restart Risk

Do not implement:

```text
certificate renewed
      |
      v
restart server
```

as a universal rule.

Instead classify applications.

## Type A — Live reload

```text
Renew certificate
      |
      v
Update certificate
      |
      v
Reload TLS
```

No restart.

## Type B — Controlled restart

```text
Renew certificate
      |
      v
Update certificate
      |
      v
Maintenance window
      |
      v
Restart
```

## Type C — Unknown

```text
Renew certificate
      |
      v
STOP
      |
      v
Human/application-specific process
```

Only Type A and well-tested Type B applications should be candidates for future automation.

---

# 18. Recommended Automation Strategy

## Phase 1

Automate:

```text
Discovery
Inventory
Expiry monitoring
Email
Ticket creation
Escalation
```

## Phase 2

Automate:

```text
Event ingestion
Reconciliation
Source synchronization
```

## Phase 3

Selective:

```text
Certificate renewal
Credential rotation
Deployment
Application reload
```

Only after application-specific behavior is understood.

---

# 19. HashiCorp Vault Integration

For on-premises Vault:

```text
                 HashiCorp Vault
                       |
              +--------+--------+
              |                 |
             PKI              Secrets
              |                 |
              v                 v
        Certificate          Credential
         metadata             metadata
              |                 |
              +--------+--------+
                       |
                       v
                    System A
```

System A should preferably consume metadata required for lifecycle management:

```text
Certificate serial
Common name
Issuer
Issue date
Expiry date
Vault path/reference
Application
Owner
Environment
```

System A should not unnecessarily copy:

- Private keys
- Passwords
- Secret values
- Sensitive Vault data

Vault remains the secret-management system.

---

# 20. Azure / Entra ID Integration

For Azure/Entra-related credentials, System A can integrate through approved APIs/events and collect relevant metadata such as:

```text
Application
Credential type
Credential identifier
Start date
Expiry date
Owner
Application/environment
```

The actual secret value should not be copied into System A.

---

# 21. AWS Integration

AWS-related credentials can similarly be integrated through approved AWS APIs/services and organizational inventory sources.

The platform should collect lifecycle metadata rather than becoming another secret repository.

---

# 22. Source Adapter Model

A scalable design is to use source-specific adapters.

```text
                System A
                   |
          Source Adapter Layer
                   |
       +-----------+-----------+
       |           |           |
       v           v           v
     Vault       Azure        AWS
     Adapter     Adapter      Adapter
       |           |           |
       v           v           v
     Vault       Entra        AWS
```

Each adapter converts source-specific data into a common System A model.

Example:

```text
Credential
{
    id,
    source,
    type,
    application,
    environment,
    owner,
    expiry,
    criticality
}
```

---

# 23. Reconciliation Strategy

Recommended frequency:

- Event-driven updates: near real time where supported.
- Daily expiry evaluation.
- Daily/weekly source reconciliation depending on source and scale.
- Periodic full discovery.

Example:

```text
Event
  |
  +--> Immediate update

Nightly reconciliation
  |
  +--> Detect missed changes

Weekly full discovery
  |
  +--> Detect unmanaged/unknown credentials
```

---

# 24. Handling Missed Events

Scenario:

```text
10:00 Certificate renewed
10:00 Event generated
10:01 System A unavailable
```

Nightly reconciliation:

```text
Source expiry = November
System A expiry = October
        |
        v
Mismatch
        |
        v
Update System A
        |
        v
Audit log
```

This makes the architecture resilient.

---

# 25. Handling Duplicate Records

The same certificate might be discovered through:

```text
Vault
Server
Endpoint
Load balancer
CMDB
```

Use correlation keys such as:

- Certificate fingerprint
- Serial number
- Source identifier
- Subject/SAN
- Endpoint
- Application/environment mapping

The reconciliation engine should merge/correlate records rather than creating duplicate alerts.

---

# 26. Security Model

System A should follow least privilege.

Principles:

1. Read-only access where possible.
2. Source-specific service identities.
3. No unnecessary secret-value access.
4. Encrypt data at rest.
5. Encrypt data in transit.
6. Audit every inventory change.
7. Restrict administrative functions.
8. Separate monitoring from secret storage.
9. Protect API credentials used by System A.
10. Use role-based access control.

---

# 27. Auditability

Every significant change should be auditable.

Examples:

```text
Credential discovered
Credential updated
Expiry changed
Owner changed
Alert sent
Jira created
ServiceNow incident created
Xmatters triggered
Credential marked renewed
Reconciliation mismatch detected
```

Example audit:

```text
2026-09-05 06:00
Credential: CERT-123
Source: Vault
Old expiry: 2026-09-20
New expiry: 2026-10-20
Reason: Source reconciliation
```

---

# 28. Monitoring System A Itself

The monitoring platform becomes critical infrastructure.

Monitor:

- Scheduler health
- Event ingestion health
- Source connector health
- Reconciliation failures
- Notification failures
- Jira API failures
- ServiceNow API failures
- Xmatters failures
- Database health
- Queue backlog
- Authentication failures

There should be an alert if System A itself stops processing.

Otherwise:

```text
System A fails
    |
    v
No expiry checks
    |
    v
No alerts
    |
    v
Certificates expire
```

---

# 29. Failure Handling

Every external integration can fail.

Examples:

```text
System A
   |
   +--> Jira unavailable
   |
   +--> ServiceNow unavailable
   |
   +--> Email unavailable
   |
   +--> Vault unavailable
```

Use:

- Retry
- Exponential backoff
- Queueing
- Dead-letter handling
- Idempotency
- Error status
- Operational alerts

If Jira creation fails:

```text
jira_status = FAILED
```

and the operation should be retried rather than silently lost.

---

# 30. Idempotency

Every operation that can create an external object must be idempotent.

Example:

```text
Credential C123
Threshold = 7 days
```

If the scheduler runs twice:

```text
Run #1 -> Jira INC-100
Run #2 -> Find existing Jira INC-100
```

It must not create duplicate lifecycle tickets.

---

# 31. Data Model Example

A simplified model:

```text
CREDENTIAL
-----------
credential_id
source_system
source_reference
credential_type
client
application
environment
server
endpoint
fingerprint
issue_date
expiry_date
expiry_status
owner_team
owner_email
criticality
status
last_seen
last_updated
last_reconciled


ALERT_STATE
-----------
credential_id
alert_level
last_alert_date
jira_ticket_id
servicenow_incident_id
xmatters_event_id
status


SOURCE
------
source_id
source_type
connection_details
last_sync
last_success
last_failure


AUDIT_EVENT
-----------
event_id
credential_id
event_type
old_value
new_value
timestamp
source
```

---

# 32. Example End-to-End Flow

Suppose a production certificate expires on 20 September.

## Initial state

```text
Certificate:
CERT-001

Application:
Payment API

Environment:
Production

Owner:
Payments Team

Expiry:
20-Sep-2026

Criticality:
P1
```

## 15 days remaining

```text
05-Sep-2026
        |
        v
Scheduler
        |
        v
15 days remaining
        |
        v
Send email
```

## 7 days remaining

```text
13-Sep-2026
        |
        v
7 days remaining
        |
        +--> Email
        +--> Jira
        +--> ServiceNow
        +--> Xmatters
```

## 6 days remaining

```text
14-Sep-2026
        |
        v
6 days remaining
        |
        +--> Daily email
        +--> Update/escalate existing incident if required
```

No duplicate Jira ticket.

## Certificate renewed

```text
Certificate renewed
        |
        v
Vault event
        |
        v
System A
        |
        v
Expiry = 20-Oct-2026
        |
        v
Reset lifecycle state
        |
        v
Close/resolve related workflow where policy permits
```

## Event missed

```text
Nightly reconciliation
        |
        v
Vault says 20-Oct
System A says 20-Sep
        |
        v
Mismatch
        |
        v
System A updates itself
```

---

# 33. Benefits

## Operational

- Less manual expiry monitoring.
- Reduced dependency on individuals.
- Consistent escalation.
- Centralized visibility.
- Fewer missed renewals.
- Better ownership.

## Security

- Reduced likelihood of expired certificates.
- Reduced likelihood of expired credentials.
- Better lifecycle visibility.
- Better auditability.
- Reduced uncontrolled manual handling.

## Engineering

- Standardized integrations.
- Centralized monitoring.
- Reusable automation.
- Clear separation of detection and deployment.
- Foundation for future automated rotation.

## Management

Possible KPIs:

```text
Total credentials
Total certificates
Credentials expiring within 30 days
Credentials expiring within 15 days
Credentials expiring within 7 days
Expired credentials
Unknown expiry credentials
Unowned credentials
Automated vs manual renewals
Notification success rate
Mean time to remediation
Number of incidents prevented
```

---

# 34. Project Phases

## Phase 0 — Discovery and Assessment

Understand the current ecosystem.

Identify:

- Credential types
- Certificate types
- Source systems
- Existing Vault instances
- Azure/Entra usage
- AWS usage
- Existing notification system
- Jira
- ServiceNow
- Xmatters
- CMDB
- Existing certificate inventories
- Server environments
- Application ownership

Deliverables:

```text
Current-state architecture
Source inventory
Integration matrix
Ownership model
```

## Phase 1 — Central Inventory

Build System A inventory.

Support:

- CSV/admin import
- Admin onboarding
- Basic Vault discovery
- Owner mapping
- Expiry metadata

Deliverable:

```text
Central credential/certificate inventory
```

## Phase 2 — Monitoring and Notification

Implement:

- Scheduler
- Expiry engine
- Configurable thresholds
- Daily email
- Jira integration
- ServiceNow integration
- Xmatters integration
- Duplicate prevention

Deliverable:

```text
Automated expiry monitoring and escalation
```

## Phase 3 — Source Event Integration

Integrate:

```text
Vault
Azure/Entra
AWS
Other sources
```

Future changes automatically update System A.

Deliverable:

```text
Event-driven inventory synchronization
```

## Phase 4 — Reconciliation and Discovery

Implement:

- Periodic source reconciliation
- Server discovery
- Endpoint certificate scanning
- Duplicate detection
- Missing-owner detection
- Unknown-expiry detection

Deliverable:

```text
Self-correcting credential inventory
```

## Phase 5 — Selective Renewal Automation

Identify applications where automation is safe.

For each application document:

```text
How is credential renewed?
How is certificate deployed?
Where is it stored?
Does application support reload?
Is restart required?
Can restart be automated?
What is rollback?
How is health verified?
```

Automate only approved patterns.

## Phase 6 — Full Lifecycle Automation

For mature integrations:

```text
Detect
  |
  v
Renew
  |
  v
Deploy
  |
  v
Reload
  |
  v
Health check
  |
  +--> Success -> close workflow
  |
  +--> Failure -> rollback/escalate
```

---

# 35. Catch-and-Resolution Matrix

| Catch / Risk | Impact | Resolution |
|---|---|---|
| Existing credentials predate System A | Inventory incomplete | One-time import + discovery |
| Event is missed | Stale expiry information | Periodic reconciliation |
| Source has no event capability | Changes not detected immediately | API polling/reconciliation |
| Unknown owner | Alert cannot be routed | Owner mapping + exception workflow |
| Unknown expiry | Cannot determine risk | Mark `expiry_unknown`, escalate for inventory cleanup |
| Duplicate discovery | Duplicate alerts/tickets | Fingerprint/correlation logic |
| Jira failure | Ticket not created | Retry + idempotency + integration health alert |
| ServiceNow failure | Incident not created | Retry + persistent status |
| Xmatters failure | On-call not notified | Retry + fallback alert |
| System A itself fails | No monitoring | Monitor System A and scheduler |
| Certificate renewed but app still uses old cert | Service outage risk | Separate renewal from deployment; verify active cert |
| Application requires restart | Availability risk | Maintenance window / application-specific automation |
| Multiple apps share infrastructure | Restart blast radius | Dependency mapping + no blind restart |
| Multiple certificates have different expiry | Incorrect restart/rotation | Per-certificate lifecycle |
| Secret values copied to System A | Security risk | Store metadata only |
| Manual inventory becomes stale | Incorrect alerts | Automated reconciliation |
| Credential rotated outside System A | Inventory mismatch | Source reconciliation |
| Load balancer terminates TLS | Server scan may be misleading | Endpoint + infrastructure discovery |
| mTLS | Basic endpoint scan may fail | Source-specific discovery |
| SNI | Wrong certificate may be observed | SNI-aware scanning |
| Event arrives twice | Duplicate processing | Idempotent event handling |
| Thresholds hardcoded | Difficult policy changes | Policy/configuration table |
| Criticality incorrect | Wrong escalation | Governance and owner validation |
| Old ticket remains after renewal | Operational noise | Lifecycle state transitions and closure policy |
| Source unavailable during reconciliation | False inventory state | Preserve last-known-good state + source health status |
| Clock/time-zone issues | Wrong expiry calculation | Store timestamps consistently in UTC |
| Certificate exists but is unused | False positive | Correlate discovery with endpoint/application usage |

---

# 36. Key Design Principles

## Principle 1 — Events + reconciliation

Never depend exclusively on events.

```text
Events
+
Periodic reconciliation
=
Reliable inventory
```

## Principle 2 — Metadata, not secrets

System A should know:

```text
What
Where
Who
When
Criticality
```

It should not unnecessarily know:

```text
Password
Private key
Secret value
```

## Principle 3 — Monitoring ≠ renewal

Expiry monitoring should work independently from renewal automation.

## Principle 4 — Renewal ≠ deployment

Getting a new certificate is not the same as making the application use it.

## Principle 5 — Deployment ≠ restart

Restart should be an application-specific operation.

## Principle 6 — Human escalation remains a safety net

Automation should reduce manual work without removing controlled escalation.

## Principle 7 — Everything should be auditable

Every lifecycle change should have an audit trail.

---

# 37. Detailed Architecture

```text
                                      +----------------------+
                                      |      SOURCE SYSTEMS  |
                                      +----------------------+
                                      |                      |
                         +------------+------------+         |
                         |            |            |         |
                         v            v            v         v
                    HashiCorp      Azure/       AWS      On-Prem
                      Vault        Entra ID              Servers
                         |            |            |         |
                         |            |            |         |
                         +------------+------------+---------+
                                      |
                         +-----------+-----------+
                         |                       |
                         v                       v
                +-------------------+     +----------------------+
                | Event Ingestion   |     | Discovery Connectors |
                | API               |     |                      |
                |                   |     | Vault API            |
                | Webhooks          |     | Azure API            |
                | Event streams     |     | AWS API              |
                | Audit events      |     | Server agents        |
                +---------+---------+     | TLS scanning          |
                          |               | CMDB                  |
                          |               +----------+-----------+
                          |                          |
                          +-------------+------------+
                                        |
                                        v
                              +----------------------+
                              | Reconciliation Engine|
                              |                      |
                              | Deduplication        |
                              | Correlation           |
                              | Validation            |
                              | Conflict resolution   |
                              +----------+-----------+
                                         |
                                         v
                              +----------------------+
                              | Credential Inventory |
                              |                      |
                              | Credential metadata  |
                              | Ownership             |
                              | Expiry                |
                              | Criticality           |
                              | Source reference      |
                              +----------+-----------+
                                         |
                       +-----------------+------------------+
                       |                                    |
                       v                                    v
             +-------------------+                +----------------------+
             | Scheduler         |                | Admin / Dashboard   |
             |                   |                |                      |
             | Daily expiry job  |                | Inventory            |
             | Reconciliation    |                | Ownership            |
             | Discovery         |                | Reports              |
             +---------+---------+                +----------------------+
                       |
                       v
             +-------------------+
             | Expiry Rule Engine|
             |                   |
             | >15d              |
             | <=15d             |
             | <=7d              |
             | <=3d              |
             | <=1d              |
             | Expired           |
             +---------+---------+
                       |
                       v
             +-------------------+
             | Notification /    |
             | Orchestration     |
             +---------+---------+
                       |
        +--------------+---------------+----------------+
        |              |               |                |
        v              v               v                v
      Email          Jira         ServiceNow         Xmatters
        |              |               |                |
        +--------------+---------------+----------------+
                       |
                       v
                 Human / Team
                       |
                       v
              Renewal / remediation
                       |
                       v
               Source system updated
                       |
                       v
                 Event / discovery
                       |
                       v
                  System A
                       |
                       v
               Lifecycle closed
```

---

# 38. Future Renewal Automation Architecture

```text
                  Expiry Engine
                       |
                Credential <= X days
                       |
                       v
              Renewal Policy Engine
                       |
            +----------+----------+
            |                     |
            v                     v
       Auto-approved          Human approval
            |                     |
            +----------+----------+
                       |
                       v
                Renewal Adapter
                       |
          +------------+------------+
          |            |            |
          v            v            v
        Vault        Azure         AWS
          |            |            |
          +------------+------------+
                       |
                       v
                 New credential
                       |
                       v
                Deployment Adapter
                       |
          +------------+-------------+
          |            |             |
          v            v             v
      File/store    Keystore      Platform API
          |            |             |
          +------------+-------------+
                       |
                       v
                Reload mechanism
                       |
             +---------+---------+
             |                   |
             v                   v
         Live reload          Restart
             |                   |
             |             Approved window
             |                   |
             +---------+---------+
                       |
                       v
                  Health check
                       |
                    +--+--+
                    |     |
                    v     v
                 Success Failure
                    |     |
                    v     v
              Close workflow
                          |
                          v
                     Rollback/
                     escalation
```

---

# 39. Recommended Technology Approach

A typical enterprise implementation could use:

```text
API:
Java Spring Boot

Scheduler:
Spring Scheduler / Quartz / enterprise scheduler

Database:
PostgreSQL / enterprise relational DB

Messaging:
Kafka / Azure Service Bus / RabbitMQ / enterprise MQ

Secrets:
HashiCorp Vault / existing enterprise secret manager

Authentication:
Enterprise SSO / Entra ID

Notifications:
Existing email platform

Ticketing:
Jira API
ServiceNow API

On-call:
Xmatters API

Observability:
Enterprise logging + metrics + alerting
```

The architecture should not tightly couple the platform to one notification or ticketing vendor.

---

# 40. Recommended MVP

The first production-capable version should be intentionally smaller.

### MVP

```text
1. Credential inventory
2. CSV/admin import
3. Vault integration
4. Daily scheduler
5. Expiry calculation
6. Configurable thresholds
7. Email notification
8. Jira integration
9. ServiceNow integration
10. Xmatters integration
11. Duplicate prevention
12. Audit logging
13. Basic dashboard
14. Source reconciliation
```

Do not start with automatic application restarts.

---

# 41. Success Criteria

The platform can be considered successful when:

- Existing credentials are onboarded.
- New credentials are automatically discovered where integrations support it.
- Credential changes update inventory without manual updates.
- Daily expiry evaluation runs successfully.
- Teams receive alerts according to policy.
- Jira/ServiceNow/Xmatters actions are created only once per lifecycle event.
- Missed events are recovered through reconciliation.
- Unknown owners are identified.
- Unknown expiries are identified.
- System A failures are themselves monitored.
- The platform has an audit trail.
- Manual monitoring effort is measurably reduced.

Future success criteria:

- Selected certificates renew automatically.
- Selected applications reload without restart.
- Health checks verify successful deployment.
- Failed automation automatically escalates.

---

# 42. Final Recommended Operating Model

```text
                DISCOVER
                   |
                   v
               INVENTORY
                   |
                   v
               RECONCILE
                   |
                   v
                MONITOR
                   |
                   v
                ALERT
                   |
                   v
               ESCALATE
                   |
                   v
          HUMAN / AUTOMATED
             REMEDIATION
                   |
                   v
               VALIDATE
                   |
                   v
                CLOSE
```

The most important architectural distinction is:

```text
                    SYSTEM A
                       |
        +--------------+--------------+
        |                             |
        v                             v
   Lifecycle                    Remediation
   monitoring                   automation
        |                             |
        v                             v
   Detect expiry                Renew credential
   Notify                       Deploy credential
   Escalate                     Reload application
                                Restart if approved
```

The first branch should be broadly automated.

The second branch should be **selectively automated and governed**.

---

# 43. Final Architecture Summary

The recommended enterprise architecture is:

```text
                        +--------------------------+
                        |      SOURCE SYSTEMS      |
                        |                          |
                        | Vault | Entra | AWS     |
                        | Servers | LB | CMDB     |
                        +------------+-------------+
                                     |
                         +-----------+-----------+
                         |                       |
                         v                       v
                  Event ingestion          Discovery
                         |                       |
                         +-----------+-----------+
                                     |
                                     v
                          Reconciliation Engine
                                     |
                                     v
                          Central Credential DB
                                     |
                    +----------------+----------------+
                    |                                 |
                    v                                 v
              Expiry Scheduler                  Admin Dashboard
                    |
                    v
              Expiry Rule Engine
                    |
       +------------+------------+-------------+
       |            |            |             |
       v            v            v             v
     Email        Jira       ServiceNow     Xmatters
       |            |            |             |
       +------------+------------+-------------+
                    |
                    v
                 Teams
                    |
                    v
             Remediation process
                    |
          +---------+----------+
          |                    |
          v                    v
     Manual renewal       Automated renewal
                              |
                              v
                         Deployment
                              |
                         +----+----+
                         |         |
                         v         v
                       Reload   Restart
                         |         |
                         +----+----+
                              |
                              v
                         Health check
                              |
                    +---------+---------+
                    |                   |
                    v                   v
                 Success             Failure
                    |                   |
                    v                   v
             Close workflow        Escalate
```

## Core architectural principle

**System A should become the central lifecycle intelligence and orchestration platform, while Vault, Entra ID, AWS, and other systems remain the systems that actually manage the credentials/certificates.**

Use:

**Events for immediacy + discovery/reconciliation for completeness + scheduled expiry evaluation for governance + existing enterprise notification/ticketing tools for escalation + controlled, application-specific automation for renewal/deployment.**

This eliminates dependency on manual inventory updates while avoiding the operational risk of indiscriminate certificate renewal and application restarts.
