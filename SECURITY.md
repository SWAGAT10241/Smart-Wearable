# Security Policy

## SWAAS — Smart Wearable Assistance & Alert System

SWAAS is a safety-oriented smart wearable platform consisting of wearable hardware, backend services, user applications, and rescue/monitoring interfaces.

Because SWAAS handles safety-related telemetry, authentication, device identity, location information, and emergency workflows, security is treated as a core engineering requirement.

---

## Supported Versions

SWAAS is currently under active development.

Security fixes are primarily applied to:

| Version / Branch             | Supported      |
| ---------------------------- | -------------- |
| `main`                       | ✅ Yes         |
| Active development branches  | 🟡 Best effort |
| Old / abandoned branches     | ❌ No          |
| Unreleased experimental code | ❌ No          |

The `main` branch represents the primary integration branch for the project.

---

## Security Scope

Security issues may affect different parts of the SWAAS ecosystem, including:

- SWAAS wearable firmware
- Device authentication and identity
- Backend APIs
- User authentication
- JWT/session handling
- Device registration and ownership
- Telemetry ingestion
- Location data
- Health-related telemetry
- Fall detection and emergency workflows
- WebSocket communication
- User applications
- Rescue/monitoring interfaces
- Database access
- Cloud/deployment configuration
- CI/CD workflows
- GitHub Actions
- Third-party dependencies
- Secrets and environment configuration

---

## Reporting a Vulnerability

Please **do not publicly disclose a suspected security vulnerability before it has been investigated**.

For vulnerabilities affecting SWAAS, use GitHub's private security vulnerability reporting mechanism when available:

**GitHub → Security → Advisories → Report a vulnerability**

If private vulnerability reporting is not available for the repository, contact the project maintainers privately through the repository's available maintainer contact channel.

When reporting a vulnerability, provide as much of the following information as possible:

- Short description of the vulnerability
- Affected component
- Affected branch, version, or commit
- Steps to reproduce
- Expected behavior
- Actual behavior
- Security impact
- Proof of concept, if safe to provide
- Suggested mitigation, if known

Please remove or redact any real credentials, tokens, personal information, production device identifiers, or other sensitive information before submitting a report.

---

## What Should Be Reported

Examples of security issues include:

### Authentication

- Authentication bypass
- JWT validation weaknesses
- Session vulnerabilities
- Password handling vulnerabilities
- OAuth authentication vulnerabilities
- Account takeover vulnerabilities

### Authorization

- Access to another user's data
- Unauthorized device access
- Device ownership bypass
- Privilege escalation
- Insecure direct object references

### Device Security

- Device impersonation
- Device credential exposure
- Unauthorized telemetry injection
- Device registration bypass
- Device ownership bypass
- Replay or spoofing attacks

### Data Security

- Unauthorized access to health-related telemetry
- Unauthorized location disclosure
- Sensitive information leakage
- Database access vulnerabilities
- Insecure API responses

### Emergency and Safety Workflows

- Unauthorized triggering or manipulation of emergency events
- Bypass of emergency authorization controls
- Tampering with fall/SOS events
- Manipulation of safety-critical telemetry

### Infrastructure and CI/CD

- GitHub Actions vulnerabilities
- Workflow permission escalation
- Secret exposure
- Dependency vulnerabilities
- Insecure deployment configuration
- Supply-chain vulnerabilities

---

## Out of Scope

The following generally do not qualify as security vulnerabilities unless they demonstrate a meaningful security impact:

- Normal application bugs without a security impact
- UI/UX issues
- Feature requests
- Performance issues
- Hardware limitations without a security consequence
- Issues requiring physical access to a development machine
- Vulnerabilities in unsupported third-party services that cannot be controlled by SWAAS

However, if you are unsure whether an issue has security implications, report it privately.

---

## Responsible Disclosure

Please:

- Do not publicly disclose the vulnerability before the maintainers have had an opportunity to investigate.
- Do not access, modify, delete, or exfiltrate data that does not belong to you.
- Do not intentionally disrupt SWAAS services.
- Do not perform denial-of-service testing against production infrastructure.
- Do not use real user, health, location, or emergency data for testing.
- Do not expose credentials, tokens, secrets, or private information in a report.

Only test against systems and accounts for which you have authorization.

---

## Security Response Process

After receiving a vulnerability report, the maintainers will:

1. Acknowledge the report.
2. Validate and reproduce the issue where possible.
3. Determine the affected components and severity.
4. Develop and test a mitigation or fix.
5. Apply the required security changes.
6. Verify that the vulnerability has been resolved.
7. Document the security change when appropriate.
8. Publish a security advisory when appropriate.

Response times may vary depending on the severity and complexity of the issue.

---

## Security Severity

SWAAS security issues may be evaluated according to their potential impact.

Particular priority is given to vulnerabilities involving:

- Authentication bypass
- Unauthorized access to user data
- Unauthorized access to wearable devices
- Location disclosure
- Health-data disclosure
- Emergency/SOS manipulation
- Remote code execution
- Secret or credential exposure
- CI/CD compromise
- Supply-chain compromise

Safety-critical and remotely exploitable vulnerabilities receive the highest priority.

---

## Security Practices

SWAAS uses multiple layers of security controls.

Current security measures include:

- JWT-based authentication
- Password hashing with bcrypt
- Authentication middleware
- Authorization and ownership checks
- Helmet security headers
- CORS controls
- Rate limiting
- Request validation
- Environment-based secret configuration
- Dependency auditing
- Dependabot dependency updates
- GitHub CodeQL analysis
- GitHub dependency review
- Automated backend testing
- Automated frontend testing
- CI-based security checks

Security controls will evolve as the platform moves toward staging and production deployments.

---

## CI/CD Security

SWAAS uses GitHub Actions as part of its CI/CD pipeline.

The CI/CD security strategy includes:

```text
Pull Request
     │
     ▼
Automated CI
     │
     ├── Backend tests
     ├── Frontend tests
     ├── Frontend build
     └── Hardware/static checks
     │
     ▼
Security Checks
     │
     ├── CodeQL
     ├── Dependency Review
     └── Dependency Audit
     │
     ▼
Review
     │
     ▼
main
```
