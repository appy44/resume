Hi Team,

We have been working on a Unified Feature Flag Platform to provide a centralized experience for feature flag management while continuing to support existing AWS AppConfig usage patterns.

The detailed architecture, flows, and design considerations are documented in the attached Confluence page and architecture diagram.

### What We Are Proposing

A centralized platform that provides a single UI and service layer for:

* Managing Global / Enterprise Feature Flags
* Managing AppConfig resources in individual AWS workload accounts through cross-account IAM roles
* Centralized governance and access control
* Reusable Feature Flag SDKs for runtime consumption

### Runtime Consumption Options

#### Option 1 – Global / Enterprise Feature Flags (Recommended)

Global feature flags are hosted and managed centrally.

Applications consume flags through a shared SDK (Java and Node currently available).

Key characteristics:

* Works in AWS, On-Prem, IDC, Azure, GCP, or any environment
* SDK periodically polls the platform endpoint
* Flags are stored in local in-memory cache
* Runtime flag evaluation reads from cache only
* No AppConfig call for every flag evaluation
* Applications continue functioning using cached values during temporary AWS/platform outages

Typical flow:

Application → SDK → Local Cache → Platform Endpoint → Central AppConfig

#### Option 2 – Team-Owned AWS AppConfig

Teams that prefer to manage their own feature flags can continue using native AWS AppConfig.

Key characteristics:

* AWS only
* Teams maintain ownership of their AppConfig resources
* Provisioned using cdk-constructs-library
* Independent deployment lifecycle
* No migration required

Typical flow:

Application → Team AppConfig

### Platform Capabilities

The platform provides a unified control plane for:

* Application management
* Environment management
* Feature flag management
* Configuration deployments
* Cross-account AppConfig management

Depending on the selected target, users can:

* Manage centralized feature flags hosted in the platform account
* Manage AppConfig configurations in workload AWS accounts using cross-account access

### Current Status

Completed:

* Architecture definition
* SDK design and implementation
* Centralized management model
* Cross-account AppConfig management design

In Progress:

* IDC entitlement integration
* Viewer and Editor role definitions
* Platform onboarding process
* Audit and rollout enhancements

### Feedback Requested

We are looking for feedback on:

* Overall architecture approach
* Runtime consumption model
* Cross-account AppConfig management approach
* Governance and access model

Please review the attached Confluence page and architecture diagram and share any comments or concerns.

Thanks,
Mayur
