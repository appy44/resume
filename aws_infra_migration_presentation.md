
# Standardizing AWS Infrastructure at Scale
## Migration from ap-construct-lib → Enterprise CDK Constructs Library
RIS Engineering Forum – Principal Financial Group  
Presenter: Mayur Sontale

---

# 1. Background

Current ecosystem:

- ~68 repositories depend on legacy **ap-construct-lib**
- ~1200 infrastructure references
- Multiple teams built services using different infrastructure patterns

Challenges:

- inconsistent infrastructure patterns
- duplicated infrastructure logic
- limited enterprise governance
- difficult platform scalability

Goal:

Create **standardized enterprise infrastructure** using the Enterprise CDK Constructs Library.

---

# 2. Platform Context

Developers create services using the **Principal Developer Portal (PDP)**.

PDP provides **service patterns**.

Example: API Service Pattern

Generated service includes:

- AWS Lambda
- API Gateway
- DynamoDB
- EventBridge
- AppConfig
- CI/CD pipelines
- Monitoring & security

Benefit:

Developers create production-ready services **within minutes**.

---

# 3. Architecture Workflow

Developer → Principal Developer Portal → Pattern Selection → GitHub Repository → CI/CD → AWS Deployment

Infrastructure deployed:

- Lambda
- API Gateway
- DynamoDB
- EventBridge
- Monitoring
- Security guardrails

---

# 4. Legacy Dependency

Most services currently depend on:

**ap-construct-lib**

This library provided:

- reusable CDK constructs
- composite service patterns
- infrastructure automation

Problems:

- not enterprise-maintained
- difficult to evolve
- inconsistent governance

---

# 5. Target Architecture

Service Repositories  
↓  
Enterprise CDK Constructs Library  
↓  
Standardized AWS Infrastructure

Enterprise constructs provide:

- security guardrails
- tagging standards
- monitoring defaults
- compliance alignment

---

# 6. Migration Complexity

Migration involves more than dependency updates.

Challenges:

1. construct pattern differences
2. missing composite constructs
3. infrastructure refactoring risk
4. DynamoDB logical ID dependency

Biggest risk:

**DynamoDB table replacement**

---

# 7. DynamoDB Migration Risk

CDK generates CloudFormation logical IDs automatically.

If construct structure changes:

Old Logical ID → New Logical ID

CloudFormation interprets as:

Replace resource

For DynamoDB this means:

Table recreation → potential **data loss**

---

# 8. DynamoDB Safety Strategy

To prevent risk:

Data protection:

- enabled DynamoDB Point-in-Time Recovery
- created on-demand backups

Infrastructure validation:

- mapped existing logical IDs
- applied overrideLogicalId()

Deployment verification:

- used cdk diff
- verified no table replacement

Outcome:

Zero data loss risk.

---

# 9. Migration Strategy

Phase 1 – Platform alignment  
Phase 2 – Construct gap identification  
Phase 3 – Pilot migrations  
Phase 4 – Wave-based repository migration  
Phase 5 – Deprecation of ap-construct-lib

---

# 10. AI-Assisted Migration

AI-assisted prompts helped:

- refactor CDK constructs
- map logical IDs
- update repository dependencies
- generate migration patterns

Benefits:

- reduced manual effort
- faster migration
- consistent code updates

---

# 11. Engineering Impact

Benefits for engineering teams:

- standardized infrastructure
- faster service creation
- improved security guardrails
- better observability

Platform benefits:

- easier governance
- simplified infrastructure evolution
- improved developer experience

---

# 12. Key Learnings

Large infrastructure migrations require:

- strong data protection strategy
- incremental rollout
- infrastructure validation
- automation support

AI assistance helped accelerate migration while maintaining safety.

---

# 13. Final Takeaway

Migration enables:

- enterprise-aligned infrastructure
- scalable platform architecture
- safe infrastructure evolution
- improved developer productivity
