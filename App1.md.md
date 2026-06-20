# GPT 5.5 IntelliJ Copilot Prompt - AppConfig Sync Lambda (Node.js)

## Existing Architecture

### Admin UI Lambda

Responsibilities:

- Provides APIs for UI
- Get flags from selected AWS account
- Create/Update/Delete flags
- Deploy flags from selected account
- Updates source AWS AppConfig
- Deployment initiated by Admin UI

### Sync Lambda

Trigger:

- AWS AppConfig Deployment Complete Event
- EventBridge Rule -> Sync Lambda

Responsibilities:

- Triggered after source account deployment completes
- Read source AppConfig configuration
- Build synchronization payload
- Deploy configuration to target accounts

---

## Source Of Truth

The selected source AWS account is the ONLY source of truth.

Requirements:

- Read source configuration once
- Generate payload once
- Deploy identical configuration to all target accounts
- Do NOT read target AppConfig configurations
- Do NOT merge target configurations
- Do NOT preserve manual target-side changes

Flow:

Source Account AppConfig
-> Deployment Completed
-> EventBridge
-> Sync Lambda
-> Read Configuration Once
-> Deploy Same Payload
-> All Target Accounts

---

## Functional Requirements

For every target account:

1. Assume target role
2. Create AppConfig client
3. Create Hosted Configuration Version
4. Start Deployment
5. Capture deployment result

---

## Scale Requirements

Support:

- 100 Accounts
- 500 Accounts
- 1000+ Accounts

Use controlled concurrency.

Do NOT process sequentially.

Use configurable worker pool.

Example:

CONCURRENCY_LIMIT=25

Do NOT create unlimited promises.

Avoid:

Promise.all(accounts.map(...))

Prefer:

- Worker Pool
- p-limit
- Batched Processing

---

## Reliability Requirements

Implement retries for:

- STS AssumeRole
- CreateHostedConfigurationVersion
- StartDeployment

Retry Strategy:

- Exponential Backoff
- Configurable retry count

Example:

MAX_RETRIES=3

---

## Failure Handling

One account failure must not stop remaining deployments.

Example:

Account A -> Success
Account B -> Failed
Account C -> Success

Continue processing all accounts.

Return summary:

{
  "totalAccounts": 1000,
  "successful": 992,
  "failed": 8,
  "durationMs": 32500
}

---

## Logging Requirements

Structured JSON logging.

Per Account:

{
  "accountId": "",
  "roleArn": "",
  "deploymentId": "",
  "status": "",
  "durationMs": 0
}

Final Summary:

- Accounts Processed
- Success Count
- Failure Count
- Total Duration

---

## Environment Variables

CONCURRENCY_LIMIT=25
MAX_RETRIES=3
DEPLOYMENT_STRATEGY_ID=
TARGET_ENVIRONMENT_ID=

---

## Code Requirements

Technology:

- Node.js 22
- AWS SDK v3
- ES Modules
- Async/Await
- Clean Architecture
- SOLID Principles

Folder Structure:

src/
 ├── handler.js
 ├── services/
 │    ├── appConfigService.js
 │    ├── deploymentService.js
 │    ├── roleAssumptionService.js
 │
 ├── utils/
 │    ├── retry.js
 │    ├── workerPool.js
 │
 ├── models/
 │    ├── deploymentResult.js
 │
 └── config/
      ├── constants.js

---

## Performance Optimization

Read source AppConfig only once.

Example:

const sourceConfig = await getSourceConfiguration();

Build payload only once.

Reuse same payload for every account.

Never:

for each account:
   read source AppConfig

---

## Expected Output

1. Analyze existing codebase
2. Identify reusable components
3. Generate implementation-ready code
4. Suggest architectural improvements
5. Implement worker pool concurrency
6. Implement retries and error handling
7. Generate deployment orchestration flow
8. Generate production-grade Node.js implementation
