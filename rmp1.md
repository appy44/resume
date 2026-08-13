SonarQube Retirement Impact Analysis
Capability	Example from the sample SonarQube project	What will not be available after SonarQube retirement?	GitHub/CodeQL replacement	Required action
Security vulnerability detection	13 vulnerabilities detected	SonarQube vulnerability scanning	CodeQL security scanning	Enable CodeQL
Bug detection	140 bugs detected	SonarQube bug analysis	GitHub Code Quality	Configure code scanning
Code-quality issue detection	694 code smells detected	SonarQube code-quality analysis	GitHub Code Quality	Map SonarQube rules
Code coverage measurement	4.7% code coverage	SonarQube coverage reporting	JaCoCo + GitHub coverage	Integrate coverage reporting
Duplicate-code detection	18.8% duplicate code (323 duplicated blocks)	SonarQube duplicate-code analysis	No confirmed equivalent	Evaluate replacement options
Technical-debt measurement	64 days of estimated remediation effort	SonarQube technical-debt tracking	No direct equivalent	Define a replacement metric
Coding standards	RIS Preferred profile with 100 rules (87 code smells, 10 bugs, 3 vulnerabilities)	SonarQube rule enforcement	Custom CodeQL queries and query suites	Recreate rules
Quality gates	30 Quality Gates identified	SonarQube gate enforcement	GitHub Rulesets	Recreate gates
Quality-gate conditions	126 gate conditions exported	SonarQube pass/fail conditions	GitHub Rulesets + CI	Map every condition
Pull-request quality validation	Quality Gate status: Failed (merge control demonstrated)	SonarQube PR validation	GitHub Rulesets	Configure merge protection
Historical reporting	Project history and trend data available in SonarQube	Historical reporting	No direct equivalent confirmed	Export historical reports
Dashboard reporting	Centralized SonarQube dashboard in use	SonarQube dashboards	GitHub dashboards	Redesign reporting
Notes
