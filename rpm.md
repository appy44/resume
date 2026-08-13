Risk Priority Matrix
Priority	Risk
🔴 Critical	Quality gates
🔴 Critical	Quality gate conditions
🔴 Critical	Security scanning not migrated
🟠 High	Loss of RIS Preferred rules
🟠 High	Bug detection not migrated
🟠 High	Coverage monitoring not migrated
🟠 High	Custom rules not migrated
🟡 Medium	Duplicate-code detection
🟡 Medium	Technical-debt tracking
🟡 Medium	Historical reporting
🟡 Medium	Dashboard migration
Risks based on your actual screenshots
Risk 1: Quality gate failure behavior will change

Your screenshots show:

30 quality gates
126 quality-gate conditions

Risk:

A pull request that currently fails in SonarQube may be allowed to merge after migration if equivalent controls are not recreated.

Risk 2: RIS Preferred rules will disappear

Your screenshots show:

100 active rules
87 code-smell rules
10 bug rules
3 vulnerability rules

Risk:

The current development standards may no longer be enforced.

Risk 3: Duplicate-code monitoring will disappear

Your screenshots show:

18.8% duplicate code
323 duplicated blocks

Risk:

Developers may continue copying and pasting code without any visibility into increasing duplication.

Risk 4: Technical-debt tracking will disappear

Your screenshots show:

64 days of estimated cleanup effort

Risk:

Teams lose a measurable indicator of code-maintenance effort.

Risk 5: Historical data will be lost

Risk:

After SonarQube retirement, historical trends, previous scans, and legacy reports may no longer be available.
