# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of Audio Tài Lộc seriously. If you believe you have found a security vulnerability, please report it to us as described below.

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to **security@audiotailoc.com**.

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

Please include the requested information listed below (as much as you can provide) to help us better understand the nature and scope of the possible issue:

- Type of issue (buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the vulnerability
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

This information will help us triage your report more quickly.

## Preferred Languages

We prefer all communications to be in English or Vietnamese.

## Policy

Audio Tài Lộc follows the principle of [Responsible Disclosure](https://en.wikipedia.org/wiki/Responsible_disclosure).

## Security Best Practices

### For Users

1. **Keep your dependencies updated**: Regularly update your dependencies to get the latest security patches
2. **Use HTTPS**: Always use HTTPS in production environments
3. **Validate inputs**: Always validate and sanitize user inputs
4. **Use environment variables**: Never commit secrets to version control
5. **Regular backups**: Maintain regular backups of your data

### For Developers

1. **Follow security guidelines**: Adhere to OWASP security guidelines
2. **Code review**: All code changes should be reviewed for security issues
3. **Testing**: Include security testing in your development workflow
4. **Dependency scanning**: Regularly scan for vulnerable dependencies
5. **Access control**: Implement proper authentication and authorization

## Security Checklist

Before deploying to production, ensure:

- [ ] All dependencies are up to date
- [ ] Environment variables are properly configured
- [ ] HTTPS is enabled
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented
- [ ] Input validation is in place
- [ ] Authentication is properly implemented
- [ ] Authorization is properly configured
- [ ] Logging is enabled for security events
- [ ] Error messages don't leak sensitive information

## Security Tools

We use the following tools to maintain security:

- **ESLint Security**: For detecting security issues in JavaScript/TypeScript
- **npm audit**: For scanning dependencies
- **OWASP ZAP**: For security testing
- **Snyk**: For vulnerability scanning

## Disclosure Policy

When we receive a security bug report, we will:

1. Confirm the problem and determine the affected versions
2. Audit code to find any similar problems
3. Prepare fixes for all supported versions
4. Release new versions with the fixes
5. Publicly announce the vulnerability

## Credits

We would like to thank all security researchers who have responsibly disclosed vulnerabilities to us.

## Contact

- **Security Email**: security@audiotailoc.com
- **PGP Key**: [Available upon request]
- **Response Time**: Within 48 hours

---

Thank you for helping keep Audio Tài Lộc secure! 🔒
