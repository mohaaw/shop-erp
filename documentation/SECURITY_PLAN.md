# Security Implementation Plan

## Overview
Comprehensive security hardening for the ERP-SHOP system to ensure production-ready security posture.

## 1. Input Validation with Zod

### Current State
- Some forms use Zod validation
- Server actions need comprehensive validation

### Implementation
**Priority: HIGH**

```typescript
// Example: Comprehensive validation schema
import { z } from 'zod';

export const createInvoiceSchema = z.object({
  customerId: z.string().uuid(),
  date: z.string().datetime(),
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().positive(),
    unitPrice: z.number().positive(),
  })).min(1),
  totalAmount: z.number().positive(),
});
```

**Action Items:**
- [ ] Create validation schemas for all server actions
- [ ] Add input sanitization for text fields
- [ ] Validate file uploads (type, size)
- [ ] Add SQL injection prevention (parameterized queries - already done)

## 2. Rate Limiting

### Implementation
**Priority: HIGH**

Install dependencies:
```bash
npm install express-rate-limit redis ioredis
```

**Strategy:**
- API endpoints: 100 requests/15 minutes per IP
- Login attempts: 5 attempts/15 minutes per IP
- File uploads: 10 uploads/hour per user

**Files to Create:**
- `lib/rate-limit.ts` - Rate limiting middleware
- `lib/redis.ts` - Redis client configuration

## 3. Security Headers

### Implementation
**Priority: MEDIUM**

Add to `next.config.js`:
```javascript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
];
```

## 4. Audit Logging

### Implementation
**Priority: MEDIUM**

**Database Schema:**
```sql
CREATE TABLE AuditLog (
  id TEXT PRIMARY KEY,
  userId TEXT,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entityId TEXT,
  changes TEXT, -- JSON
  ipAddress TEXT,
  userAgent TEXT,
  timestamp TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES User(id)
);
```

**Log Events:**
- User login/logout
- Data modifications (create, update, delete)
- Permission changes
- Failed authentication attempts
- Sensitive data access

## 5. Authentication & Authorization

### Current State
- NextAuth.js implemented
- Basic authentication working

### Enhancements
**Priority: HIGH**

- [ ] Implement role-based access control (RBAC)
- [ ] Add permission system
- [ ] Implement session timeout
- [ ] Add 2FA support (optional)
- [ ] Secure password reset flow

**RBAC Schema:**
```sql
CREATE TABLE Role (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  permissions TEXT -- JSON array
);

CREATE TABLE UserRole (
  userId TEXT,
  roleId TEXT,
  FOREIGN KEY (userId) REFERENCES User(id),
  FOREIGN KEY (roleId) REFERENCES Role(id),
  PRIMARY KEY (userId, roleId)
);
```

## 6. Data Encryption

### Implementation
**Priority: MEDIUM**

- [ ] Encrypt sensitive data at rest (salaries, tax IDs)
- [ ] Use HTTPS in production
- [ ] Encrypt database backups
- [ ] Secure environment variables

## 7. CSRF Protection

### Implementation
**Priority: HIGH**

- Next.js Server Actions have built-in CSRF protection
- Verify all forms use Server Actions
- Add CSRF tokens for external API calls

## 8. SQL Injection Prevention

### Current State
✅ Already implemented via parameterized queries with better-sqlite3

**Verification:**
- All database queries use prepared statements
- No string concatenation in SQL queries

## Implementation Timeline

### Week 1: Critical Security
- [ ] Input validation (Zod schemas)
- [ ] Rate limiting
- [ ] Security headers

### Week 2: Authentication & Logging
- [ ] RBAC implementation
- [ ] Audit logging
- [ ] Session management

### Week 3: Data Protection
- [ ] Data encryption
- [ ] Backup security
- [ ] Security testing

## Security Checklist

- [ ] All inputs validated
- [ ] Rate limiting active
- [ ] Security headers configured
- [ ] Audit logging implemented
- [ ] RBAC in place
- [ ] Sensitive data encrypted
- [ ] HTTPS enforced
- [ ] Regular security audits scheduled
- [ ] Dependency vulnerability scanning
- [ ] Penetration testing completed

## Monitoring & Maintenance

- Set up security monitoring
- Regular dependency updates
- Automated vulnerability scanning
- Incident response plan
- Regular security audits
