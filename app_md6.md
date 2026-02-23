# ENTERPRISE CONSTRUCT RESOLUTION (STRICT – NO GUESSING)

Before importing or using any construct from:

@principal/cdk-constructs-library

The agent MUST resolve the exact exported symbol names.

## Step 1 — Resolve Actual Exports (Read-Only)

The agent must inspect the installed package:

- node_modules/@principal/cdk-constructs-library/package.json
- index.d.ts
- dist/index.d.ts
- src/index.ts (if available)

OR execute:

node -e "console.log(Object.keys(require('@principal/cdk-constructs-library')))"

The agent must generate an Authoritative Export List:

| Exported Symbol | Type | Source File |
|----------------|------|------------|

STOP after generating this list.

---

## Step 2 — Import Rules (Mandatory)

1. Only import symbols that exist in the Authoritative Export List.
2. Do NOT invent construct names.
3. Do NOT infer naming patterns.
4. Do NOT rename or alias guessed imports.
5. Do NOT pluralize/singularize symbol names.
6. Do NOT create wrapper names.
7. If required construct is not in export list:
   - STOP
   - Report missing enterprise construct
   - Do NOT fall back to aws-cdk-lib

---

## Strict Import Format

All imports must use exact symbol names:

import { ExactExportedName } from "@principal/cdk-constructs-library";

No wildcard imports.
No renamed imports.
No partial guesses.

---

## Failure Condition

If any imported symbol is not present in the resolved export list:

- Treat as POLICY VIOLATION
- STOP execution
- Report invalid import

Build success does NOT override this rule.
