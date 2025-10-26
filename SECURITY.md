# Security Guide

## 🔒 Security Measures Implemented

### 1. Authentication & Authorization

- **Supabase Auth** with secure session management
- **Middleware protection** on all `/admin/*` routes
- **Row-Level Security (RLS)** on all database tables
- Public read access, authenticated write/update/delete

### 2. XSS Protection

- **DOMPurify** sanitization on all user-generated HTML content
- Strict Content-Security-Policy headers
- Input validation on all forms

### 3. API Security

- **Protected revalidate endpoint** with bearer token authentication
- **Rate limiting** recommended for production
- CORS headers configured properly

### 4. Security Headers

All responses include:

- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer info
- `Permissions-Policy` - Restricts browser features

### 5. File Upload Security

- **MIME type validation** - Only images allowed
- **File size limits** - 10MB maximum
- **Authenticated uploads only** - RLS enforced
- Public read access for display

### 6. Environment Variables

- **No secrets in code** - All sensitive data in environment variables
- **Secure password generation** - Random 24-character passwords
- **Service role key protection** - Never exposed to client

## 🔐 Environment Variables

### Required for Production

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Admin Credentials (for create-admin-production.mjs)
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=generate_secure_random_password

# API Security
REVALIDATE_SECRET=generate_with_openssl_rand_base64_32
```

### Generate Secure Secrets

```bash
# Generate revalidate secret
openssl rand -base64 32

# Generate admin password
openssl rand -base64 24
```

## 🛡️ Security Best Practices

### Admin User Management

1. **Never use default credentials in production**
2. **Generate strong random passwords** (24+ characters)
3. **Use environment variables** for credentials
4. **Enable 2FA** in Supabase dashboard
5. **Rotate passwords** regularly

### Database Security

1. **RLS policies enabled** on all tables
2. **Service role key** never exposed to client
3. **Authenticated writes only** via RLS
4. **Public reads** for content display

### API Endpoints

1. **Protect sensitive endpoints** with authentication
2. **Validate all inputs** before processing
3. **Use rate limiting** in production
4. **Log security events** for monitoring

### File Uploads

1. **MIME type validation** enforced
2. **File size limits** configured (10MB)
3. **Authenticated uploads** via RLS
4. **Scan files** for malware (optional)

## 🚨 Security Incidents

### If Credentials are Compromised

1. **Immediately rotate** all API keys in Supabase dashboard
2. **Revoke user sessions** via Supabase Auth
3. **Update environment variables** in deployment platform
4. **Review audit logs** for suspicious activity
5. **Force password reset** for admin users

### Reporting Security Issues

If you discover a security vulnerability, please email security@yourdomain.com instead of using the issue tracker.

## 📋 Security Checklist

Before deploying to production:

- [ ] All environment variables set in deployment platform
- [ ] Admin password is strong and random (not default)
- [ ] REVALIDATE_SECRET configured
- [ ] Service role key never committed to git
- [ ] RLS policies verified in Supabase
- [ ] Security headers verified in production
- [ ] File upload restrictions tested
- [ ] Admin routes require authentication
- [ ] XSS protection tested (try injecting scripts)
- [ ] HTTPS enforced (automatic with Vercel)

## 🔄 Regular Security Maintenance

### Monthly

- Review Supabase audit logs
- Check for outdated dependencies: `npm audit`
- Review user access and permissions

### Quarterly

- Rotate API keys and secrets
- Update dependencies: `npm update`
- Review and update RLS policies
- Test security measures

### Annually

- Full security audit
- Penetration testing (if budget allows)
- Review and update security documentation

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/security)
- [Next.js Security Headers](https://nextjs.org/docs/app/api-reference/next-config-js/headers)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

---

**Last Updated:** October 26, 2025
