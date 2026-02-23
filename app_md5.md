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
