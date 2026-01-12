/**
 * Validation utilities for tenant management
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
 * Validates if a string is a valid domain name
 * @param domain - The domain string to validate
 * @returns true if the domain is valid, false otherwise
 */
export const isValidDomain = (domain: string): boolean => {
  return DOMAIN_REGEX.test(domain);
};
