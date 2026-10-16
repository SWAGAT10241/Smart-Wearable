## 📝 Description

Please provide a concise description of the changes introduced by this pull request. Reference any relevant GitHub issues or design documents.

Closes # (issue)

---

## 🔍 Type of Change

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 Documentation update
- [ ] 🔧 Refactoring or performance improvement
- [ ] 📦 Dependency update

---

## 🧪 Testing Checklist

- [ ] Backend test suite passes (`pnpm test` in `/backend`)
- [ ] Frontend tests and production build pass (`pnpm test:run && pnpm build` in `/frontend`)
- [ ] Mobile syntax check passes (`node scripts/check-syntax.js` in `/mobile`)
- [ ] Hardware Python syntax check passes (`python -m compileall -q hardware`)

---

## 🔐 Security & Privacy Verification

- [ ] Does NOT transmit continuous telemetry to the backend during normal operation
- [ ] Enforces cryptographic signature or token verification on device endpoints
- [ ] Emergency sessions include TTL expiration and opaque session IDs
- [ ] Sensitive keys and tokens are excluded from logs and commits
