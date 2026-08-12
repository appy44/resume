SonarQube to GitHub CodeQL — Impact & Gap Analysis

Document Status: Draft
Purpose: Impact and Gap Analysis
Migration: SonarQube → GitHub CodeQL
Audience: Engineering, Security, DevOps, Enterprise Architecture
Owner: Engineering
Last Updated: 12-Aug-2026

⸻

1. Executive Summary

This document evaluates the impact, capability gaps, risks, dependencies, and required changes associated with migrating application security analysis from SonarQube to GitHub CodeQL.

The objective is not to perform a one-to-one replacement of SonarQube with CodeQL. SonarQube provides capabilities across security, reliability, maintainability, code smells, duplication, coverage, and quality gates, while CodeQL primarily focuses on security analysis and vulnerability detection.

Therefore, the migration must explicitly identify:

* Capabilities that CodeQL can replace.
* Capabilities that require a different solution.
* Capabilities that will be retired.
* Existing Sonar rules that require CodeQL equivalents or custom queries.
* Changes to CI/CD pipelines and branch protection.
* Changes to developer workflows.
* Changes to security and compliance reporting.
* Treatment of historical SonarQube data.
* Migration risks and mitigation strategies.

Overall Assessment

The migration is technically feasible for SAST/security analysis, but a complete replacement of SonarQube requires additional decisions around code quality, maintainability, coverage, duplication, quality gates, reporting, and historical data.

A capability and rule-level assessment should be completed before SonarQube is fully decommissioned.

⸻

2. Objectives

The objectives of this analysis are to:

1. Identify the capabilities currently provided by SonarQube.
2. Determine which capabilities are available in GitHub CodeQL.
3. Identify functional and operational gaps.
4. Assess impact on CI/CD pipelines.
5. Assess impact on developers and pull-request workflows.
6. Assess security and compliance implications.
7. Assess reporting and historical-data implications.
8. Identify migration dependencies.
9. Define risks and mitigations.
10. Establish criteria for SonarQube decommissioning.

⸻

3. Scope

In Scope

* SonarQube SAST/security analysis.
* SonarQube code-quality analysis.
* SonarQube rules and custom rules.
* SonarQube Quality Gates.
* Pull-request analysis.
* CI/CD integration.
* GitHub CodeQL analysis.
* GitHub code-scanning integration.
* Security findings and triage.
* Reporting.
* Compliance considerations.
* Historical SonarQube findings.
* Developer workflow.
* Performance and cost.
* Migration and rollback considerations.

Out of Scope

* Application-level security remediation.
* Full redesign of CI/CD infrastructure unrelated to code analysis.
* Replacement of unrelated security tools such as SCA, DAST, container scanning, or secret scanning unless explicitly included in the migration scope.
* Application functional changes.

⸻

4. Current State — SonarQube

The current implementation uses SonarQube as part of the software development and CI/CD lifecycle.

Typical flow:

Developer
    |
    v
Pull Request
    |
    v
CI/CD Pipeline
    |
    v
Build / Test
    |
    v
SonarQube Analysis
    |
    v
Quality Gate
    |
    +---- PASS ----> Merge
    |
    +---- FAIL ----> Developer Remediation

Current SonarQube Capabilities

The current implementation may provide:

* Security vulnerability detection.
* Security hotspots.
* Bug detection.
* Code smells.
* Maintainability analysis.
* Reliability analysis.
* Code duplication analysis.
* Test coverage reporting.
* Quality Gates.
* Pull-request analysis.
* Branch analysis.
* Historical quality trends.
* Custom rules.
* Developer dashboards.
* Management reporting.
* API-based reporting.
* Integration with CI/CD pipelines.

Action: Confirm the exact capabilities currently enabled in the organization’s SonarQube implementation rather than assuming all SonarQube features are being used.

⸻

5. Target State — GitHub CodeQL

The proposed target architecture uses GitHub CodeQL for security-focused static analysis.

Typical flow:

Developer
    |
    v
Pull Request
    |
    v
GitHub Actions
    |
    v
Build
    |
    v
CodeQL Analysis
    |
    v
GitHub Code Scanning
    |
    v
Security Findings
    |
    +---- No blocking finding ----> Merge
    |
    +---- Finding ----> Remediation

CodeQL will become the primary mechanism for supported static security analysis.

Where SonarQube capabilities do not have a CodeQL equivalent, a separate tool, process, or explicit capability retirement must be identified.

⸻

6. Capability Comparison

Capability	Current SonarQube	CodeQL	Gap	Required Action
SAST	Yes	Yes	Low	Map rules and validate coverage
Security vulnerabilities	Yes	Yes	Low/Medium	Validate detection coverage
Security hotspots	Yes	Different model	Medium	Define equivalent workflow
Bugs/reliability	Yes	Limited/different	High	Assess required replacement
Code smells	Yes	No direct equivalent	High	Retain alternative or retire
Maintainability	Yes	No direct equivalent	High	Define alternative
Code duplication	Yes	No direct equivalent	High	Retain alternative or retire
Test coverage	Yes	No direct equivalent	High	Retain existing coverage tooling
Quality Gate	Yes	Different model	High	Redesign enforcement
PR analysis	Yes	Yes	Low	Migrate workflow
Branch analysis	Yes	Yes/different	Medium	Validate target workflow
Custom rules	Yes	Custom queries	Medium/High	Perform rule mapping
Security dashboard	Yes	Yes	Low/Medium	Validate reporting needs
Quality dashboard	Yes	No equivalent	High	Alternative required
Historical trends	Yes	Different	High	Retain/archive Sonar data
API reporting	Yes	GitHub APIs	Medium	Rebuild integrations if required
IDE feedback	Yes	Different	Medium	Assess developer workflow
Compliance reporting	Existing	Available differently	Medium	Validate requirements

⸻

7. Rule and Query Coverage Analysis

Rule-level analysis is a key dependency for the migration.

The existing SonarQube rule set should be exported and categorized.

Required Categories

* Security.
* Reliability/Bugs.
* Maintainability.
* Code Smells.
* Performance.
* Duplications.
* Organization-specific/custom rules.

Rule Mapping

Each SonarQube rule should be classified as one of:

1. Direct CodeQL equivalent.
2. Partial CodeQL equivalent.
3. CodeQL custom query required.
4. Alternative tool required.
5. No longer required.
6. Intentionally retired.

Example:

Sonar Rule	Category	CodeQL Equivalent	Action	Status
Rule A	Security	Yes	Map to CodeQL query	To Validate
Rule B	Security	Partial	Validate detection	To Validate
Rule C	Maintainability	No	Alternative required	Gap
Rule D	Code Smell	No	Business decision	Gap
Rule E	Custom Security	No	Create custom query	Development
Rule F	Deprecated	No	Retire	Candidate

Coverage Metrics

The following metrics should be calculated before migration:

Total Sonar Rules
    |
    +-- Direct CodeQL Equivalent
    |
    +-- Partial Equivalent
    |
    +-- Custom CodeQL Query Required
    |
    +-- Alternative Tool Required
    |
    +-- Retired

Recommended reporting:

Metric	Value
Total enabled Sonar rules	TBD
Security rules	TBD
Bug/reliability rules	TBD
Maintainability rules	TBD
Custom rules	TBD
Direct CodeQL mappings	TBD
Partial mappings	TBD
Custom CodeQL queries required	TBD
Uncovered security rules	TBD
Rules proposed for retirement	TBD

⸻

8. Quality Gate Impact

The existing SonarQube Quality Gate should be documented before migration.

Typical conditions may include:

* New vulnerabilities.
* New bugs.
* New code smells.
* Coverage threshold.
* Duplications.
* Maintainability rating.
* Reliability rating.
* Security rating.

Current Model

Build
  |
  v
Sonar Analysis
  |
  v
Quality Gate
  |
  +---- PASS ----> Merge
  |
  +---- FAIL ----> Block Merge

Target Model

Build
  |
  v
CodeQL Analysis
  |
  v
Code Scanning
  |
  v
Security Findings
  |
  v
GitHub Checks / Branch Protection
  |
  +---- PASS ----> Merge
  |
  +---- FAIL ----> Remediation

Key Gap

CodeQL should not automatically be considered a replacement for the complete SonarQube Quality Gate.

The organization must explicitly define:

* Which security findings block a PR.
* Severity threshold.
* Whether only new findings are evaluated.
* How existing findings are baselined.
* How false positives are handled.
* Who can dismiss findings.
* Whether non-security quality criteria remain enforced elsewhere.

⸻

9. CI/CD Impact

Current Pipeline

Checkout
   |
Build
   |
Unit Tests
   |
Sonar Scan
   |
Quality Gate
   |
Artifact

Proposed Pipeline

Checkout
   |
Build
   |
Unit Tests
   |
CodeQL Initialization
   |
Build
   |
CodeQL Analysis
   |
Upload Results
   |
GitHub Code Scanning
   |
Security Policy / Checks
   |
Artifact

Areas to Assess

* GitHub Actions workflows.
* Jenkins or other CI integrations.
* Maven/Gradle configuration.
* Build requirements for CodeQL.
* Runner requirements.
* Java version compatibility.
* Build duration.
* Parallelization.
* Network requirements.
* Authentication.
* Secrets.
* Branch protection.
* Required status checks.
* Failure conditions.
* Existing Sonar pipeline dependencies.

⸻

10. Developer Workflow Impact

Current

Developer
    |
    v
Create PR
    |
    v
Sonar Analysis
    |
    v
Sonar Findings
    |
    v
Fix / Suppress
    |
    v
Merge

Target

Developer
    |
    v
Create PR
    |
    v
CodeQL Analysis
    |
    v
GitHub Code Scanning
    |
    v
Security Findings
    |
    v
Fix / Dismiss
    |
    v
Merge

Impact Areas

* Location where findings are viewed.
* PR annotations.
* Finding severity.
* Finding ownership.
* Developer notifications.
* Suppression/dismissal process.
* False-positive workflow.
* Security triage.
* Baseline handling.
* Developer training.
* IDE integration.
* Documentation.

⸻

11. Security Impact

The migration must validate that security detection coverage is not reduced.

Areas to compare:

* OWASP Top 10 coverage.
* CWE coverage.
* Language-specific security rules.
* Injection vulnerabilities.
* Authentication/authorization issues.
* Cryptographic issues.
* Deserialization.
* Path traversal.
* SSRF.
* Command injection.
* Data-flow vulnerabilities.
* Sensitive-data exposure.

The comparison should be based on the actual enabled Sonar rules and actual application languages/frameworks, not generic vendor feature lists.

⸻

12. False Positives and Finding Management

The following behaviors should be compared:

Area	SonarQube	CodeQL Target
Finding severity	Existing model	Define mapping
False positive	Existing workflow	Define GitHub workflow
Suppression	Existing mechanism	Define equivalent
Baseline	Existing	Define baseline
Finding ownership	Existing	GitHub/Security workflow
Reopened findings	Existing	Validate
Historical status	Existing	Migration/retention decision
Risk acceptance	Existing	Define process

A migration should not be considered successful solely because CodeQL executes successfully.

The quality of findings and operational handling must also be validated.

⸻

13. Reporting Impact

Existing SonarQube reports should be inventoried.

Reports to Identify

* Security reports.
* Quality reports.
* Team-level reports.
* Application-level reports.
* Management dashboards.
* Compliance reports.
* Trend reports.
* Vulnerability reports.
* Audit reports.
* API-based reports.

For every existing report:

Existing Sonar Report
        |
        +-- Available in GitHub?
        |       |
        |       +-- Yes → Map
        |
        +-- Partially available?
        |       |
        |       +-- Yes → Build alternative
        |
        +-- Not available?
                |
                +-- Retain Sonar history
                +-- Build alternative
                +-- Retire with approval

⸻

14. Historical Data Impact

Historical SonarQube data should not be assumed to migrate into CodeQL.

Data that may need to be retained:

* Historical vulnerabilities.
* Resolved findings.
* False positives.
* Accepted risks.
* Quality metrics.
* Coverage history.
* Technical debt.
* Audit evidence.
* Previous Quality Gate results.

Recommended Approach

Existing SonarQube
        |
        v
Historical Data Retention
        |
        +---- Read-only access
        |
        +---- Export required reports
        |
        +---- Preserve audit evidence
New Development
        |
        v
GitHub CodeQL

The retention period should be agreed with Security, Compliance, and Architecture teams.

⸻

15. Custom Rules Impact

All custom SonarQube rules must be identified.

For each custom rule:

Custom Rule	Purpose	Security Critical?	CodeQL Equivalent	Action
Custom Rule A	Organization security policy	Yes	No	Custom CodeQL query
Custom Rule B	Coding standard	No	No	Alternative/retire
Custom Rule C	Secure API usage	Yes	Partial	Validate
Custom Rule D	Architecture convention	No	No	Alternative

Custom security rules should receive priority during migration.

⸻

16. Performance Impact

Benchmark both solutions using representative repositories.

Metrics:

* CI execution time.
* Analysis time.
* CPU usage.
* Memory usage.
* Runner utilization.
* Build overhead.
* PR feedback time.
* Concurrent analysis behavior.

Recommended benchmark:

Repository A — Small
Repository B — Medium
Repository C — Large
Repository D — Enterprise-scale

Compare:

Metric	SonarQube	CodeQL	Difference
Build time	TBD	TBD	TBD
Analysis time	TBD	TBD	TBD
Total pipeline time	TBD	TBD	TBD
Resource consumption	TBD	TBD	TBD

⸻

17. Cost Impact

Evaluate:

SonarQube Current Cost

* License.
* Infrastructure.
* Database.
* Maintenance.
* Upgrades.
* Administration.
* CI execution.

CodeQL Target Cost

* GitHub Advanced Security / applicable licensing.
* GitHub Actions execution.
* Runner infrastructure.
* Storage.
* Custom query maintenance.
* Administration.
* Developer/security training.

The final decision should use the organization’s actual licensing and infrastructure costs.

⸻

18. Security and Compliance Impact

The migration must be reviewed against existing organizational requirements.

Check:

* SAST requirements.
* Secure SDLC requirements.
* OWASP requirements.
* CWE requirements.
* Audit requirements.
* Vulnerability remediation SLAs.
* Risk acceptance.
* Evidence retention.
* Reporting requirements.
* Separation of duties.
* Security approval workflow.

Key Question

Does the proposed CodeQL implementation satisfy all mandatory security and compliance requirements currently satisfied by SonarQube?

If not, each missing requirement must have an explicit mitigation or risk acceptance.

⸻

19. Gap Register

ID	Gap	Impact	Severity	Mitigation	Owner	Status
G01	CodeQL does not provide equivalent code-quality analysis	Loss of quality visibility	High	Retain alternative quality tool	Engineering	Open
G02	Some Sonar security rules may not have direct equivalents	Security coverage	High	Rule mapping/custom queries	Security	Open
G03	Sonar Quality Gate behavior changes	PR enforcement	High	Implement GitHub checks/branch policies	DevOps	Open
G04	Historical Sonar data not migrated	Audit/reporting	Medium	Retain read-only Sonar	Security	Open
G05	Existing Sonar reports unavailable	Management reporting	Medium	Build GitHub-based reports	Security	Open
G06	Developer workflow changes	Adoption	Medium	Training/documentation	Engineering	Open
G07	Custom Sonar rules require migration	Security/quality coverage	High	Create CodeQL custom queries where applicable	Security	Open
G08	Code coverage is not a CodeQL replacement capability	Quality visibility	Medium	Retain test coverage tooling	Engineering	Open
G09	Code duplication analysis unavailable	Maintainability impact	Medium	Retain alternative or retire	Engineering	Open
G10	CI execution characteristics change	Pipeline performance	Medium	Benchmark and optimize	DevOps	Open

⸻

20. Risk Register

ID	Risk	Probability	Impact	Mitigation
R01	Security coverage decreases	Medium	High	Complete rule-level mapping
R02	Developers receive excessive false positives	Medium	Medium	Pilot and tune queries
R03	Required quality checks disappear	High	High	Define replacement controls
R04	Compliance reports cannot be reproduced	Medium	High	Validate reporting before migration
R05	Custom security rules are lost	Medium	High	Identify and migrate critical rules
R06	CI pipeline becomes slower	Medium	Medium	Benchmark and optimize
R07	Historical data becomes inaccessible	Low	Medium	Retain Sonar read-only
R08	Teams misunderstand CodeQL as a full Sonar replacement	High	High	Clearly define target capabilities

⸻

21. Migration Dependencies

The following dependencies should be completed before production migration:

* Obtain current SonarQube configuration.
* Export enabled Sonar rules.
* Identify custom rules.
* Document Quality Gate configuration.
* Inventory Sonar dashboards and reports.
* Identify compliance requirements.
* Map security rules to CodeQL queries.
* Identify uncovered security rules.
* Identify required custom CodeQL queries.
* Define handling for code-quality capabilities.
* Define PR blocking policy.
* Define finding triage process.
* Define false-positive/dismissal process.
* Define historical data retention.
* Implement CodeQL in pilot repositories.
* Compare findings.
* Benchmark pipeline performance.
* Validate security coverage.
* Obtain Security approval.
* Obtain Architecture approval.
* Define rollback strategy.

⸻

22. Recommended Migration Approach

A phased migration is recommended rather than immediate SonarQube removal.

Phase 1 — Discovery

Inventory
   ↓
Rules
   ↓
Quality Gates
   ↓
Reports
   ↓
Custom Rules
   ↓
Dependencies

Phase 2 — CodeQL Pilot

Select representative repositories:

* Small Java repository.
* Medium Java repository.
* Large/complex Java repository.
* Repository containing known security findings.

Run SonarQube and CodeQL in parallel.

             ┌── SonarQube
Repository ──┤
             └── CodeQL

Compare:

* Findings.
* Severity.
* False positives.
* Security coverage.
* CI duration.
* Developer experience.

Phase 3 — Gap Remediation

Address:

* Missing security coverage.
* Custom queries.
* Quality tooling gaps.
* Reporting gaps.
* Compliance gaps.
* Pipeline changes.

Phase 4 — Controlled Rollout

Roll out CodeQL repository-by-repository.

Monitor:

* Security findings.
* False positives.
* CI performance.
* Developer feedback.
* Compliance reporting.

Phase 5 — SonarQube Decommissioning

SonarQube should only be decommissioned after:

1. Required security coverage is validated.
2. Required quality capabilities have an approved replacement or retirement decision.
3. Required reports are available.
4. Historical data retention is addressed.
5. Security/compliance approval is obtained.
6. All critical migration gaps are closed.

⸻

23. Rollback Strategy

During the transition period, SonarQube should remain available until CodeQL is proven in production.

Rollback should allow:

CodeQL Migration
       |
       v
Issue identified
       |
       v
Disable CodeQL enforcement
       |
       v
Restore previous Sonar enforcement
       |
       v
Investigate / Remediate

Rollback criteria should include:

* Critical security coverage regression.
* Blocking CI/CD failures.
* Significant false-positive increase.
* Compliance requirement failure.
* Critical reporting failure.

⸻

24. Acceptance Criteria

The migration should be considered successful when:

* All active Sonar security rules have been assessed.
* Security rule coverage has been validated.
* Critical uncovered rules have mitigation.
* Custom security rules have been addressed.
* Quality Gate replacement has been approved.
* PR enforcement is operational.
* Developer workflow is documented.
* False-positive handling is documented.
* Security reporting is available.
* Compliance requirements are satisfied.
* Historical Sonar data is retained appropriately.
* CI performance is within acceptable limits.
* Security team has approved the implementation.
* Architecture team has approved the target design.
* Rollback strategy has been tested or validated.

⸻

25. Key Decisions Required

The following decisions must be explicitly recorded:

Decision	Required Outcome
Is CodeQL replacing only SAST or all Sonar capabilities?	TBD
What replaces Sonar code-quality analysis?	TBD
What replaces code coverage reporting?	TBD
What replaces duplication analysis?	TBD
What replaces Quality Gates?	TBD
Which Sonar rules must be migrated?	TBD
Which custom rules require CodeQL queries?	TBD
How will historical Sonar data be retained?	TBD
What findings block PR merge?	TBD
Who owns CodeQL custom queries?	TBD
Who owns security finding triage?	TBD
When can SonarQube be decommissioned?	TBD

⸻

26. Recommendation

The migration should proceed as a capability-driven migration rather than a direct tool replacement.

The immediate next step should be a detailed assessment of the existing SonarQube implementation, specifically:

1. Export the currently enabled rules.
2. Capture the current Quality Gate configuration.
3. Identify custom rules.
4. Inventory existing reports and dashboards.
5. Map security rules to CodeQL queries.
6. Identify security coverage gaps.
7. Determine which non-security Sonar capabilities require another solution.
8. Pilot CodeQL against representative repositories.
9. Compare results before removing SonarQube.

Recommended Decision Gate

Current SonarQube
       |
       v
Rule + Capability Inventory
       |
       v
CodeQL Coverage Assessment
       |
       +---- Coverage acceptable ----+
       |                              |
       |                              v
       |                       Pilot Migration
       |                              |
       |                              v
       |                       Gap Remediation
       |                              |
       |                              v
       |                       Production Rollout
       |
       +---- Coverage NOT acceptable
                                      |
                                      v
                           Additional Controls /
                           Alternative Tooling

⸻

27. Appendix — Information Required From Current Implementation

To complete the analysis with actual values instead of assumptions, collect:

SonarQube

* SonarQube version.
* Scanner version.
* Enabled quality profiles.
* Enabled rules.
* Custom rules.
* Quality Gate configuration.
* Project configuration.
* Branch/PR configuration.
* Exclusions.
* Suppressions.
* Existing dashboards.
* Existing reports.
* API integrations.

CI/CD

* Pipeline definition.
* Sonar scanning stage.
* Quality Gate stage.
* Branch protection rules.
* Required status checks.
* Build tool configuration.
* Runner configuration.

Security

* Current security policies.
* Required SAST controls.
* Vulnerability SLAs.
* Compliance requirements.
* Security reporting requirements.
* Risk acceptance process.

CodeQL

* Supported languages.
* Default query suites.
* Custom query requirements.
* Build mode.
* GitHub Actions configuration.
* Code scanning configuration.
* Alert/triage workflow.
* Branch protection integration.

⸻

28. Final Assessment

The critical distinction is:

CodeQL can provide strong security-focused static analysis, but it should not automatically be treated as a functional replacement for every capability currently provided by SonarQube.

Therefore, the migration decision should be based on capability coverage, security coverage, enforcement, reporting, and governance, rather than simply confirming that CodeQL can run successfully in the CI/CD pipeline.

Migration status: Assessment Required
Recommended next action: Complete Sonar Rule + Quality Gate + Reporting Inventory
