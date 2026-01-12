/**
 * Validation utilities for tenant and user management
 */

/**
 * Domain validation regex pattern
 * Matches valid domain names like:
 * - example.com
 * - sub.example.com
 * - my-domain.co.uk
 */
export const DOMAIN_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9-_.]+\.[a-zA-Z]{2,}$/;

/**
 * Email validation regex pattern
 */
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Validates if a string is a valid domain name
 * @param domain - The domain string to validate
 * @returns true if the domain is valid, false otherwise
 */
export const isValidDomain = (domain: string): boolean => {
  return DOMAIN_REGEX.test(domain);
};

/**
 * Validates if a string is a valid email address
 * @param email - The email string to validate
 * @returns true if the email is valid, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

/**
 * Extracts domain from email address
 * @param email - The email address
 * @returns domain string or empty string if invalid
 */
export const extractEmailDomain = (email: string): string => {
  const parts = email.split('@');
  return parts.length === 2 ? parts[1] : '';
};

/**
 * Common internal email domains (for demo purposes)
 */
export const INTERNAL_DOMAINS = [
  'company.com',
  'corp.com',
  'internal.com',
];

/**
 * Check if email domain is internal
 * @param email - The email address
 * @param allowedDomains - Optional list of allowed internal domains
 * @returns true if domain is considered internal
 */
export const isInternalEmail = (email: string, allowedDomains?: string[]): boolean => {
  const domain = extractEmailDomain(email);
  const domains = allowedDomains || INTERNAL_DOMAINS;
  return domains.includes(domain);
};
