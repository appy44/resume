SonarQube to GitHub CodeQL / GitHub Code Quality Migration Assessment

Version: 1.0

Assessment Type: Enterprise Impact and Gap Analysis

Date: August 2026

1. Purpose

The purpose of this assessment is to identify the potential impact of retiring SonarQube and migrating to GitHub CodeQL and GitHub Code Quality.

The screenshots used in this assessment represent one SonarQube project and one GitHub repository. They are used only as evidence that specific capabilities are currently being used.

This document does not assume that all repositories use the same configuration.

Additional analysis will be required because the organization contains thousands of repositories, and each repository may have different:

Quality profiles
Quality gates
Rule sets
Coverage requirements
Custom configurations
2. Current SonarQube Configuration Observed
SonarQube
Configuration	Value
Scanner	Maven Sonar Scanner Plugin 3.11.0.3922
Coverage tool	JaCoCo 0.8.11
Quality profile	RIS Preferred
Exported Java profiles	3
Quality gates	30
Quality gates with conditions	26
Exported gate conditions	126
Sample Project Metrics
Metric	Value
Bugs	140
Vulnerabilities	13
Code smells	694
Technical debt	64 days
Coverage	4.7%
Unit tests	26
Duplicate code	18.8%
Duplicated blocks	323
Quality gate status	Failed
RIS Preferred Quality Profile
Rule type	Count
Code Smells	87
Bugs	10
Vulnerabilities	3
Total Rules	100
3. Feature Impact Analysis
Capability	Example from the sample project	What will not be available after SonarQube retirement?	GitHub/CodeQL replacement	Required action
Security vulnerability detection	13 vulnerabilities detected	SonarQube security scanning	CodeQL security scanning	Enable CodeQL
Bug detection	140 bugs detected	SonarQube bug analysis	GitHub Code Quality	Configure code scanning
Code-quality issue detection	694 code smells detected	SonarQube code-quality analysis	GitHub Code Quality	Map existing SonarQube rules
Code coverage measurement	4.7% coverage	SonarQube coverage reporting	JaCoCo + GitHub coverage	Integrate coverage reporting
Duplicate-code detection	18.8% duplicate code (323 duplicated blocks)	SonarQube duplicate-code detection	No confirmed equivalent	Evaluate replacement
Technical-debt measurement	64 days of estimated remediation effort	SonarQube technical-debt tracking	No direct equivalent	Define a replacement metric
Coding standards	RIS Preferred profile with 100 rules	SonarQube rule enforcement	Custom CodeQL queries and query suites	Recreate rules
Quality gates	30 Quality Gates	SonarQube gate enforcement	GitHub Rulesets	Recreate gates
Quality-gate conditions	126 pass/fail conditions	SonarQube gate conditions	GitHub Rulesets + CI	Map every condition
Pull-request quality validation	Quality Gate status: Failed	SonarQube pull-request validation	GitHub Rulesets	Configure merge protection
Historical reporting	Historical scan information available	SonarQube historical reports	No direct equivalent confirmed	Export reports
Dashboard reporting	Centralized dashboard available	SonarQube dashboards	GitHub dashboards	Redesign reporting
4. Explanation of Important Metrics
Metric	Meaning	Example
Technical debt	Estimated effort required to fix all identified issues	64 days
Code coverage	Percentage of code executed during automated testing	4.7%
Duplicate code	Percentage of repeated or copied code	18.8%
Duplicated blocks	Number of repeated code segments	323
Code smells	Code-quality issues that affect maintainability	694
Bugs	Defects that can cause incorrect behavior	140
Vulnerabilities	Security weaknesses	13
5. Risk Analysis
Risk	Impact	Mitigation
Security scanning is not migrated	High	Enable CodeQL before retirement
Bug detection is not migrated	High	Configure GitHub Code Quality
RIS Preferred rules are not recreated	High	Rebuild the rule set
Coverage monitoring is lost	High	Integrate JaCoCo with GitHub
Duplicate-code tracking is lost	Medium	Select an alternative solution
Technical-debt tracking is lost	Medium	Define a replacement metric
Quality Gates are removed	Critical	Recreate all gates
Quality Gate conditions are removed	Critical	Map all 126 conditions
Historical reporting is lost	Medium	Export reports before retirement
Custom rules are not migrated	High	Recreate them as CodeQL queries
Dashboard reporting changes	Medium	Redesign reporting
6. High-Priority Migration Activities
1. Recreate Quality Profiles

Current state:

RIS Preferred profile
100 active rules

Required action:

Export all active rules.
Create equivalent CodeQL query suites.
Implement custom queries where necessary.
2. Recreate Quality Gates

Current state:

30 Quality Gates.

Required action:

Identify all gate definitions.
Recreate the gates using GitHub Rulesets.
3. Map Quality Gate Conditions

Current state:

126 Quality Gate conditions.

Required action:

Review every condition individually.
Identify an equivalent GitHub implementation.
Document conditions that cannot be migrated.
4. Migrate Coverage Reporting

Current state:

JaCoCo integration is already configured.

Required action:

Standardize coverage reporting.
Integrate JaCoCo with GitHub.
Recreate coverage thresholds.
5. Evaluate Duplicate-Code Detection

Current state:

Duplicate-code detection is actively used.

Required action:

Determine whether an alternative solution is required.
Decide whether the current capability should be retained or retired.
6. Evaluate Technical-Debt Tracking

Current state:

Technical-debt metrics are actively used.

Required action:

Decide whether a replacement metric is required.
Determine whether the metric can be retired.
7. Preserve Historical Data

Current state:

Historical reports and dashboards exist in SonarQube.

Required action:

Export all historical reports.
Preserve all required dashboards before retirement.
7. Recommended Target Architecture
Developer
     │
     ▼

Pull Request
     │
     ▼

GitHub Actions
     │
     ├── Maven Build
     │
     ├── Unit Tests
     │
     ├── JaCoCo
     │
     ├── GitHub CodeQL
     │
     └── GitHub Code Quality
     │
     ▼

GitHub Rulesets
     │
     ▼

PASS → Merge Allowed

FAIL → Merge Blocked
8. Migration Components
SonarQube Retirement
        │
        ▼

GitHub CodeQL
        +
GitHub Code Quality
        +
GitHub Rulesets
        +
JaCoCo
        +
Custom Query Suites
        +
Custom CodeQL Queries

CodeQL alone should not be considered a complete replacement for the current SonarQube implementation.

9. Final Recommendation

GitHub provides documented capabilities for:

Security analysis
Bug detection
Reliability analysis
Maintainability analysis
Coverage reporting
Pull-request analysis
Merge enforcement through Rulesets

However, the current SonarQube implementation also includes:

Custom quality profiles
Quality gates
Gate conditions
Duplicate-code detection
Technical-debt tracking
Historical reporting

A Proof of Concept (POC) should be completed before SonarQube retirement.

The POC should validate:

Rule migration
Gate migration
Coverage integration
Pull-request enforcement
Reporting
Repository-level configuration

Final conclusion:

GitHub CodeQL and GitHub Code Quality provide a valid replacement platform for many existing SonarQube capabilities. However, an enterprise-wide migration requires rule mapping, quality-gate migration, coverage integration, and validation of all repository-specific configurations before SonarQube can be retired.
