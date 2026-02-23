# PHASE 0.5 — Workspace Discovery

CURRENT_PHASE: 0.5
MODE: READ_ONLY

Goal:
Identify all package.json files in the repository.

Tasks:
1. Locate all package.json files.
2. Determine:
   - Which package contains CDK stacks
   - Which package imports OLD_LIBRARY
3. Output table:

| Package Path | Contains CDK? | Uses OLD_LIBRARY? | Needs NEW_LIBRARY? |
|--------------|--------------|------------------|-------------------|

Rules:
- Do NOT install anything
- Do NOT modify files
- Output only table
- STOP




# CDK Enterprise Migration Contract
Domain Service Pattern → Enterprise API Service Pattern

---

# PURPOSE

Migrate applications from:

OLD_LIBRARY: ap-construct-lib/domain-service  
NEW_LIBRARY: @principal/cdk-constructs-library  

All infrastructure must use enterprise constructs only.

This contract is designed for autonomous agents (Claude 4.5, Copilot Agent, Cursor, etc.)
It enforces deterministic execution and prevents infinite loops.

---

# GLOBAL EXECUTION RULES (HARD CONSTRAINTS)

1. Maximum 1 `npm install` per package.
2. Maximum 1 `npm run build --noEmit` per phase.
3. Maximum 1 `cdk synth` per phase.
4. Never re-run a command that already succeeded in the same phase.
5. If a command fails twice → STOP and report.
6. Never auto-retry repeatedly.
7. Never re-run gates after PASS.
8. Do not modify files outside declared scope.
9. Do not assume memory of previous phases.
10. If uncertain → STOP and ask.

Build success does NOT justify policy violations.

---

# ENTERPRISE CDK IMPORT POLICY (STRICT)

The following are forbidden:

- import from "aws-cdk-lib"
- import from "aws-cdk-lib/*"
- import from "constructs"
- require("aws-cdk-lib")

All infrastructure resources must come from:

@principal/cdk-constructs-library

If an equivalent construct does not exist:

- STOP
- Report missing enterprise construct
- Do NOT fall back to aws-cdk-lib
- Do NOT mix libraries

Exception (only if explicitly allowed):
bin/cdk.ts may use App/Stack if required.

---

# MIGRATION CONTEXT (FILL PER REPO)

PROJECT_NAME: <repo-name>  
OLD_LIBRARY: ap-construct-lib/domain-service  
NEW_LIBRARY: @principal/cdk-constructs-library  
PATTERN: Domain Service → API Service  
DYNAMODB_PRESENT: <true | false>  

---

# PHASE 0 — DISCOVERY (READ-ONLY)

CURRENT_PHASE: 0  
MODE: READ_ONLY  

## Goals
1. Locate all imports from OLD_LIBRARY.
2. Identify all constructs used.
3. Produce Construct Migration Map:

| Old Construct | File Path | New Construct | Action |
|---------------|----------|--------------|--------|

Rules:
- Do NOT edit files
- Do NOT install
- Do NOT build
- Output only the table
- STOP

---

# PHASE 0.5 — MONOREPO WORKSPACE DISCOVERY

CURRENT_PHASE: 0.5  
MODE: READ_ONLY  

## Tasks
1. Locate all package.json files.
2. Identify which package contains CDK stacks.
3. Identify which package imports OLD_LIBRARY.
4. Produce:

| Package Path | Contains CDK? | Uses OLD_LIBRARY? | Needs NEW_LIBRARY? |

Rules:
- Do NOT install
- Do NOT modify files
- Do NOT build
- STOP

---

# PHASE 1 — TARGETED INSTALL

CURRENT_PHASE: 1  
MODE: EXECUTE  

Install NEW_LIBRARY only in packages marked "Needs NEW_LIBRARY = Yes".

Allowed commands per package:

cd <package-path>  
npm install @principal/cdk-constructs-library  
npm ls @principal/cdk-constructs-library  

Rules:
- Maximum 1 install per package
- Do NOT install at root unless root contains CDK
- Do NOT reinstall if already present
- Do NOT build
- STOP

---

# PHASE 2 — CODE MIGRATION (EDIT ONLY)

CURRENT_PHASE: 2  
MODE: CODE_EDIT_ONLY  

Refactor according to approved migration map.

Rules:
- Edit only mapped files
- Replace DomainServiceConstruct with enterprise constructs
- Preserve logical IDs
- Preserve environment configuration
- Remove addCorsOptions silently
- Do NOT import aws-cdk-lib
- Do NOT run build
- Do NOT run synth
- Do NOT uninstall OLD_LIBRARY yet
- STOP when complete

---

# PHASE 3 — BUILD VALIDATION

CURRENT_PHASE: 3  
MODE: VALIDATION  

Allowed Commands:

npm run build --noEmit  
cdk synth  

Rules:
- Run build once
- If build fails → STOP
- If build passes → run synth once
- If synth fails → STOP
- Do NOT reinstall packages
- Do NOT retry automatically
- STOP

---

# PHASE 4 — REMOVE OLD LIBRARY

CURRENT_PHASE: 4  
MODE: CLEANUP  

Allowed Commands:

npm uninstall ap-construct-lib/domain-service  
npm ls ap-construct-lib/domain-service  

Rules:
- Only if Phase 3 succeeded
- Remove once
- Verify removal
- Do NOT remove other dependencies
- Do NOT rebuild
- STOP

---

# PHASE 5 — ENTERPRISE IMPORT COMPLIANCE GATE

CURRENT_PHASE: 5  
MODE: READ_ONLY  

Search for forbidden imports:

- from "aws-cdk-lib"
- from "aws-cdk-lib/*"
- from "constructs"

Output:

| File | Import Line | Allowed? | Action Required |

Rules:
- Zero matches required
- Do NOT modify
- If violation exists → FAIL and STOP

---

# PHASE 6 — FINAL VALIDATION

CURRENT_PHASE: 6  
MODE: VERIFY  

Checklist:

1. No OLD_LIBRARY imports remain
2. No aws-cdk-lib imports remain
3. NEW_LIBRARY is used consistently
4. If DYNAMODB_PRESENT = true:
   - Logical IDs preserved
   - No unintended table replacement

Output PASS / FAIL table.
STOP.

---

# LOOP PROTECTION

- Never run same command twice in same phase
- Never reinstall dependencies
- Never re-run build after PASS
- Never re-run synth after PASS
- Never restart earlier phases automatically
- If failure persists twice → STOP and report

---

# COMPLETION CRITERIA

Migration is complete only if:

- Phase 4 completed
- Phase 5 passed
- Phase 6 passed
- No forbidden imports
- Build and synth succeeded
- Logical IDs preserved (if applicable)

END OF CONTRACT
