# CDK Enterprise Migration Agent Contract
Domain Service Pattern → API Service Pattern

---

## PURPOSE

This document defines a deterministic, phase-based migration contract for converting:

OLD_LIBRARY → `ap-construct-lib/domain-service`  
NEW_LIBRARY → `@principal/cdk-constructs-library`

This contract is designed to work safely with autonomous coding agents (Claude 4.5, Copilot Agent, Cursor, etc.) without infinite loops or uncontrolled retries.

---

# GLOBAL EXECUTION RULES (MANDATORY)

1. Maximum **1 `npm install` per migration**
2. Maximum **1 `npm run build --noEmit` per phase**
3. Maximum **1 `cdk synth` per phase**
4. Never re-run a command that already succeeded in the same phase
5. If a command fails twice, STOP and report
6. Never auto-retry repeatedly
7. Never re-run gates after PASS
8. Do not modify files outside declared scope
9. If uncertain, STOP and ask
10. Do not assume memory of previous phases — rely only on explicit phase markers

---

# MIGRATION CONTEXT (FILL PER REPOSITORY)

PROJECT_NAME: `<repo-name>`  
OLD_LIBRARY: `ap-construct-lib/domain-service`  
NEW_LIBRARY: `@principal/cdk-constructs-library`  
PATTERN: `Domain Service → API Service`  
DYNAMODB_PRESENT: `<true | false>`

---

# PHASE 0 — DISCOVERY (READ-ONLY)

CURRENT_PHASE: 0  
MODE: READ_ONLY  

### Goals
1. Locate all imports from OLD_LIBRARY
2. Identify all constructs used from OLD_LIBRARY
3. Produce Construct Migration Map:

| Old Construct | File Path | New Construct | Action |
|---------------|----------|--------------|--------|

### Rules
- Do NOT edit files
- Do NOT install packages
- Do NOT build
- Output only the migration table
- STOP after output

---

# PHASE 1 — INSTALL NEW LIBRARY

CURRENT_PHASE: 1  
MODE: EXECUTE  

### Allowed Commands
- `npm install @principal/cdk-constructs-library`
- `npm ls @principal/cdk-constructs-library`

### Rules
- Run install once
- Do NOT edit package.json manually
- Do NOT build
- If install succeeds → mark:

PHASE_COMPLETE: 1  

- STOP

---

# PHASE 2 — CODE MIGRATION (EDIT ONLY)

CURRENT_PHASE: 2  
MODE: CODE_EDIT_ONLY  

### Task
Refactor code according to approved Construct Migration Map.

### Rules
- Edit only files listed in the map
- Do NOT run npm install
- Do NOT run build
- Do NOT run synth
- Do NOT remove OLD_LIBRARY yet
- Preserve logical IDs
- Preserve environment configuration
- Replace monolithic DomainServiceConstruct with modular enterprise constructs
- Remove `addCorsOptions` silently
- Do not introduce new CDK imports directly

When complete:

PHASE_COMPLETE: 2  

STOP.

---

# PHASE 3 — BUILD VALIDATION

CURRENT_PHASE: 3  
MODE: VALIDATION  

### Allowed Commands
- `npm run build --noEmit`
- `cdk synth`

### Rules
- Run build once
- If build fails → output errors and STOP
- If build passes → run synth once
- If synth fails → STOP
- Do NOT reinstall packages
- Do NOT retry automatically

If both succeed:

PHASE_COMPLETE: 3  

STOP.

---

# PHASE 4 — REMOVE OLD LIBRARY

CURRENT_PHASE: 4  
MODE: CLEANUP  

### Allowed Commands
- `npm uninstall ap-construct-lib/domain-service`
- `npm ls ap-construct-lib/domain-service`

### Rules
- Only execute if Phase 3 passed
- Uninstall once
- Verify removal
- Do NOT remove other dependencies
- Do NOT run build again

Mark:

PHASE_COMPLETE: 4  

STOP.

---

# PHASE 5 — FINAL VERIFICATION

CURRENT_PHASE: 5  
MODE: VERIFY  

### Validation Checklist

1. No OLD_LIBRARY imports remain
2. NEW_LIBRARY is imported and used
3. No direct `aws-cdk-lib` imports in stacks/constructs
4. If DYNAMODB_PRESENT = true:
   - Logical IDs preserved
   - No unintended table replacement risk

### Rules
- Read-only validation
- Do NOT modify code
- Do NOT rebuild
- Output PASS/FAIL table
- STOP

---

# LOOP PROTECTION (CRITICAL)

- Never run the same command twice in the same phase
- Never reinstall dependencies
- Never re-run build after PASS
- Never re-run synth after PASS
- Never auto-fix repeatedly
- If failure persists → STOP and report clearly
- Do not restart earlier phases unless explicitly instructed

---

# COMPLETION CRITERIA

Migration is considered complete only if:

- Phase 4 completed
- Phase 5 validation PASS
- No deprecated imports remain
- Build and synth succeed
- Logical IDs preserved (if applicable)

---

END OF CONTRACT
