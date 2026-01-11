/**
 * Manual tests for permission utilities
 * Run these tests to verify wildcard matching works correctly
 */

import { matchPermission, hasPermissionWithWildcard } from './permissionUtils';

console.log('=== Testing matchPermission ===');

// Test exact matches
console.log('Exact match:', matchPermission('admin.delete', 'admin.delete')); // Should be true
console.log('No match:', matchPermission('admin.delete', 'user.view')); // Should be false

// Test wildcard patterns
console.log('Wildcard match:', matchPermission('admin.*', 'admin.delete')); // Should be true
console.log('Wildcard match nested:', matchPermission('admin.*', 'admin.users.delete')); // Should be true
console.log('Wildcard no match:', matchPermission('admin.*', 'user.view')); // Should be false
console.log('Global wildcard:', matchPermission('*', 'anything.here')); // Should be true

// Test edge cases
console.log('Short permission vs pattern:', matchPermission('admin.users.*', 'admin')); // Should be false
console.log('Multiple wildcards:', matchPermission('*.delete', 'admin.delete')); // Should be true

console.log('\n=== Testing hasPermissionWithWildcard ===');

const userPermissions = ['user.view', 'user.edit', 'admin.*'];

console.log('Has user.view:', hasPermissionWithWildcard(userPermissions, 'user.view')); // Should be true
console.log('Has admin.delete (via wildcard):', hasPermissionWithWildcard(userPermissions, 'admin.delete')); // Should be true
console.log('Has editor.edit:', hasPermissionWithWildcard(userPermissions, 'editor.edit')); // Should be false
console.log('Has admin.users.manage (via wildcard):', hasPermissionWithWildcard(userPermissions, 'admin.users.manage')); // Should be true

console.log('\n=== All tests completed ===');
