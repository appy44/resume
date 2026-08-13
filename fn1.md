# SonarQube Retirement Impact Analysis

**Assessment Type:** Enterprise Impact and Gap Analysis

**Assessment Scope:** SonarQube → GitHub CodeQL / GitHub Code Quality Migration

**Version:** 1.0

**Date:** August 2026

---

# 1. Executive Summary

This assessment evaluates the impact of retiring SonarQube and migrating to GitHub CodeQL and GitHub Code Quality.

The screenshots used in this assessment represent a **sample SonarQube project** and a **sample GitHub repository**. They are used only as evidence that specific capabilities are currently being used.

This document should **not** be interpreted as representing all repositories in the organization.

Because the organization contains **thousands of repositories**, additional analysis will be required to identify repository-specific configurations.

Repository configurations may differ in:

- Quality profiles
- Quality gates
- Rule sets
- Coverage requirements
- Custom rules
- CI/CD pipelines

---

# 2. Current SonarQube Configuration Observed

## Platform Configuration

| Configuration | Observed Value |
| --- | --- |
| Scanner | Maven Sonar Scanner Plugin 3.11.0.3922 |
| Coverage Tool | JaCoCo 0.8.11 |
| Quality Profile | RIS Preferred |
| Exported Java Profiles | 3 |
| Quality Gates | 30 |
| Quality Gates With Conditions | 26 |
| Exported Gate Conditions | 126 |

---

## Sample Project Metrics

| Metric | Observed Value |
| --- | --- |
| Bugs | 140 |
| Vulnerabilities | 13 |
| Code Smells | 694 |
| Technical Debt | 64 days |
| Code Coverage | 4.7% |
| Unit Tests | 26 |
| Duplicate Code | 18.8% |
| Duplicated Blocks | 323 |
| Quality Gate Status | Failed |

---

## RIS Preferred Quality Profile

| Rule Category | Count |
| --- | --- |
| Code Smells | 87 |
| Bugs | 10 |
| Vulnerabilities | 3 |
| Total Rules | 100 |

---

# 3. Feature Impact Analysis

| Capability | Example From Sample Project | What Will Not Be Available After SonarQube Retirement? | GitHub/CodeQL Replacement | Required Action |
| --- | --- | --- | --- | --- |
| Security vulnerability detection | 13 vulnerabilities detected | SonarQube security scanning | CodeQL security scanning | Enable CodeQL |
| Bug detection | 140 bugs detected | SonarQube bug analysis | GitHub Code Quality | Configure code scanning |
| Code-quality issue detection | 694 code smells detected | SonarQube code-quality analysis | GitHub Code Quality | Map SonarQube rules |
| Code coverage measurement | 4.7% code coverage | SonarQube coverage reporting | JaCoCo + GitHub coverage | Integrate coverage reporting |
| Duplicate-code detection | 18.8% duplicate code (323 duplicated blocks) | SonarQube duplicate-code detection | No confirmed equivalent | Evaluate replacement |
| Technical-debt measurement | 64 days of remediation effort | SonarQube technical-debt tracking | No direct equivalent | Define a replacement metric |
| Coding standards | RIS Preferred profile with 100 rules | SonarQube rule enforcement | Custom CodeQL queries and query suites | Recreate rules |
| Quality gates | 30 Quality Gates | SonarQube gate enforcement | GitHub Rulesets | Recreate gates |
| Quality-gate conditions | 126 pass/fail conditions | SonarQube gate conditions | GitHub Rulesets + CI | Map every condition |
| Pull-request quality validation | Quality Gate status: Failed | SonarQube pull-request validation | GitHub Rulesets | Configure merge protection |
| Historical reporting | Historical scan information available | SonarQube historical reports | No direct equivalent confirmed | Export reports |
| Dashboard reporting | Centralized dashboard available | SonarQube dashboards | GitHub dashboards | Redesign reporting |

---

# 4. Explanation of Key Metrics

| Metric | Description | Example |
| --- | --- | --- |
| Technical Debt | Estimated effort required to fix all identified issues | 64 days |
| Code Coverage | Percentage of code executed during automated testing | 4.7% |
| Duplicate Code | Percentage of repeated or copied code | 18.8% |
| Duplicated Blocks | Number of repeated code segments | 323 |
| Code Smells | Code-quality issues affecting maintainability | 694 |
| Bugs | Defects that can cause incorrect behavior | 140 |
| Vulnerabilities | Security weaknesses | 13 |

---

# 5. Gap Analysis

| Area | Current State | Target State | Gap |
| --- | --- | --- | --- |
| Security Scanning | SonarQube | CodeQL | Configuration required |
| Code Quality | SonarQube | GitHub Code Quality | Rule mapping required |
| Coverage Reporting | SonarQube + JaCoCo | GitHub + JaCoCo | Integration required |
| Quality Profiles | RIS Preferred | CodeQL Query Suites | Migration required |
| Quality Gates | SonarQube | GitHub Rulesets | Recreation required |
| Technical Debt | SonarQube | No direct equivalent | Replacement strategy required |
| Duplicate-Code Detection | SonarQube | No confirmed equivalent | Evaluation required |
| Historical Reporting | SonarQube | No direct equivalent | Export required |

---

# 6. Risk Analysis

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Security scanning is not migrated | High | Enable CodeQL before retirement |
| Bug detection is not migrated | High | Configure GitHub Code Quality |
| RIS Preferred rules are not recreated | High | Rebuild the rule set |
| Coverage monitoring is lost | High | Integrate JaCoCo with GitHub |
| Duplicate-code tracking is lost | Medium | Select an alternative solution |
| Technical-debt tracking is lost | Medium | Define a replacement metric |
| Quality Gates are removed | Critical | Recreate all gates |
| Quality Gate conditions are removed | Critical | Map all 126 conditions |
| Historical reporting is lost | Medium | Export reports before retirement |
| Custom rules are not migrated | High | Recreate them as CodeQL queries |
| Dashboard reporting changes | Medium | Redesign reporting |

---

# 7. High-Priority Migration Activities

## Recreate Quality Profiles

**Current State**

- RIS Preferred profile
- 100 active rules

**Required Action**

- Export all active rules.
- Create equivalent CodeQL query suites.
- Implement custom queries where necessary.

---

## Recreate Quality Gates

**Current State**

- 30 Quality Gates.

**Required Action**

- Identify all gate definitions.
- Recreate the gates using GitHub Rulesets.

---

## Map Quality Gate Conditions

**Current State**

- 126 Quality Gate conditions.

**Required Action**

- Review every condition individually.
- Identify an equivalent GitHub implementation.
- Document conditions that cannot be migrated.

---

## Migrate Coverage Reporting

**Current State**

- JaCoCo integration is already configured.

**Required Action**

- Standardize coverage reporting.
- Integrate JaCoCo with GitHub.
- Recreate coverage thresholds.

---

## Evaluate Duplicate-Code Detection

**Current State**

- Duplicate-code detection is actively used.

**Required Action**

- Determine whether an alternative solution is required.
- Decide whether the current capability should be retained or retired.

---

## Evaluate Technical-Debt Tracking

**Current State**

- Technical-debt metrics are actively used.

**Required Action**

- Decide whether a replacement metric is required.
- Determine whether the metric can be retired.

---

## Preserve Historical Data

**Current State**

- Historical reports and dashboards exist.

**Required Action**

- Export all historical reports.
- Preserve dashboards before retirement.

---

# 8. Recommended Target Architecture

```text
Developer
     │
     ▼

Pull Request
     │
     ▼

GitHub Actions
     │
     ├── Maven Build
     ├── Unit Tests
     ├── JaCoCo
     ├── GitHub CodeQL
     └── GitHub Code Quality
     │
     ▼

GitHub Rulesets
     │
     ▼

PASS → Merge Allowed

FAIL → Merge Blocked
```

---

# 9. Migration Components

```text
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
```

**CodeQL alone should not be considered a complete replacement for the current SonarQube implementation.**

---

# 10. Final Recommendation

GitHub provides capabilities for:

- Security analysis
- Bug detection
- Reliability analysis
- Maintainability analysis
- Coverage reporting
- Pull-request analysis
- Merge enforcement

However, the current SonarQube implementation also includes:

- Custom quality profiles
- Quality gates
- Gate conditions
- Duplicate-code detection
- Technical-debt tracking
- Historical reporting

A **proof of concept (POC)** should be completed before SonarQube retirement.

The POC should validate:

- Rule migration
- Gate migration
- Coverage integration
- Pull-request enforcement
- Reporting
- Repository-level configuration

> **Conclusion:** GitHub CodeQL and GitHub Code Quality can replace many existing SonarQube capabilities. However, enterprise-wide migration requires rule mapping, quality-gate migration, coverage integration, and validation of repository-specific configurations before SonarQube can be retired.
