import { PlanRequirement, SubscriptionPlan } from '../types/service';

/**
 * Plan hierarchy mapping
 * Higher numbers represent higher-tier plans
 */
export const PLAN_HIERARCHY: Record<string, number> = {
  'free': 0,
  'basic': 1,
  'professional': 2,
  'premium': 3,
  'enterprise': 4,
};

/**
 * Check if a tenant's plan meets the requirement for a service
 * @param tenantPlan The tenant's current subscription plan
 * @param requiredPlan The plan required by the service
 * @returns true if the tenant can use the service
 */
export const canUsePlan = (tenantPlan: string, requiredPlan: string): boolean => {
  const tenantLevel = PLAN_HIERARCHY[tenantPlan] || 0;
  const requiredLevel = PLAN_HIERARCHY[requiredPlan] || 0;
  return tenantLevel >= requiredLevel;
};

/**
 * Get the localized label for a plan
 * @param plan The plan identifier
 * @param t Translation function
 * @returns Localized plan label
 */
export const getPlanLabel = (plan: string, t: any): string => {
  switch (plan) {
    case 'free':
      return t.free;
    case 'basic':
      return t.basic;
    case 'professional':
      return t.professional;
    case 'premium':
      return t.premium;
    case 'enterprise':
      return t.enterprise;
    default:
      return plan;
  }
};
