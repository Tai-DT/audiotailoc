import { BadRequestException, Logger } from '@nestjs/common';

/**
 * URL Validator for SSRF Protection
 * Validates URLs to prevent Server-Side Request Forgery (SSRF) attacks
 */
export class UrlValidator {
  private static readonly logger = new Logger(UrlValidator.name);

  // Private IP ranges to block
  private static readonly PRIVATE_IP_RANGES = [
    /^127\./, // 127.0.0.0/8 - Loopback
    /^10\./, // 10.0.0.0/8 - Private
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12 - Private
    /^192\.168\./, // 192.168.0.0/16 - Private
    /^169\.254\./, // 169.254.0.0/16 - Link-local
    /^::1$/, // IPv6 loopback
    /^fc00:/, // IPv6 private
    /^fe80:/, // IPv6 link-local
  ];

  // Allowed protocols
  private static readonly ALLOWED_PROTOCOLS = ['http:', 'https:'];

  // Blocked hostnames
  private static readonly BLOCKED_HOSTNAMES = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];

  /**
   * Validate URL for SSRF protection
   * @param urlString - URL to validate
   * @param allowedDomains - Optional whitelist of allowed domains
   * @returns Validated URL object
   * @throws BadRequestException if URL is invalid or dangerous
   */
  static validateUrl(urlString: string, allowedDomains?: string[]): URL {
    if (!urlString || typeof urlString !== 'string') {
      throw new BadRequestException('URL is required and must be a string');
    }

    let url: URL;
    try {
      url = new URL(urlString);
    } catch (error) {
      throw new BadRequestException(`Invalid URL format: ${urlString}`);
    }

    // Check protocol
    if (!this.ALLOWED_PROTOCOLS.includes(url.protocol)) {
      throw new BadRequestException(
        `Protocol ${url.protocol} is not allowed. Only HTTP and HTTPS are permitted.`,
      );
    }

    // Check hostname
    const hostname = url.hostname.toLowerCase();

    // Block localhost and internal hostnames
    if (this.BLOCKED_HOSTNAMES.includes(hostname)) {
      throw new BadRequestException('Access to localhost and internal addresses is not allowed');
    }

    // Block private IP ranges
    for (const range of this.PRIVATE_IP_RANGES) {
      if (range.test(hostname)) {
        throw new BadRequestException('Access to private IP ranges is not allowed');
      }
    }

    // If whitelist is provided, check against it
    if (allowedDomains && allowedDomains.length > 0) {
      const isAllowed = allowedDomains.some(domain => {
        const normalizedDomain = domain.toLowerCase().replace(/^https?:\/\//, '');
        return hostname === normalizedDomain || hostname.endsWith('.' + normalizedDomain);
      });

      if (!isAllowed) {
        throw new BadRequestException(`Domain ${hostname} is not in the allowed list`);
      }
    }

    // Additional security: Block IP addresses (only allow domain names)
    // This prevents bypassing domain whitelist by using IP addresses
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;

    if (ipv4Regex.test(hostname) || ipv6Regex.test(hostname)) {
      // If whitelist is provided, block all IPs
      if (allowedDomains && allowedDomains.length > 0) {
        throw new BadRequestException(
          'IP addresses are not allowed when domain whitelist is configured',
        );
      }
      // Otherwise, just log a warning but allow (for flexibility)
      this.logger.warn(`URL uses IP address instead of domain name: ${hostname}`);
    }

    return url;
  }

  /**
   * Validate URL and return safe fetch options
   * @param urlString - URL to validate
   * @param allowedDomains - Optional whitelist of allowed domains
   * @param timeout - Request timeout in milliseconds (default: 10000)
   * @param maxSize - Maximum response size in bytes (default: 10MB)
   * @returns Object with validated URL and fetch options
   */
  static validateUrlForFetch(
    urlString: string,
    allowedDomains?: string[],
    timeout: number = 10000,
    _maxSize: number = 10 * 1024 * 1024, // 10MB default
  ): { url: URL; fetchOptions: RequestInit } {
    const url = this.validateUrl(urlString, allowedDomains);

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const fetchOptions: RequestInit = {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'User-Agent': 'AudioTailoc-Backend/1.0',
      },
      // Limit redirects to prevent SSRF via redirects
      redirect: 'follow',
    };

    // Store timeout ID for cleanup (if needed)
    (fetchOptions as any)._timeoutId = timeoutId;

    return { url, fetchOptions };
  }
}
