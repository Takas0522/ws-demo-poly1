import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser, validateEmailDomain } from '../api/userApi';
import { getTenants } from '../api/tenantApi';
import { UserType, UserStatus } from '../types/user';
import { TenantListItem } from '../types/tenant';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Alert } from '../components/ui/Alert';
import { useI18n } from '../i18n/I18nContext';
import { AuthorizedComponent } from '../components/AuthorizedComponent';
import { isValidEmail, isInternalEmail } from '../utils/validation';

/**
 * User Create Page
 * Form for creating new users with email domain validation
 */
const UserCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    userType: 'external' as UserType,
    primaryTenantId: '',
    status: 'active' as UserStatus,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailValidation, setEmailValidation] = useState<{
    checking: boolean;
    message?: string;
    suggestedType?: UserType;
  }>({ checking: false });
  
  const [tenants, setTenants] = useState<TenantListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load tenants for primary tenant selection
  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = async () => {
    try {
      const response = await getTenants({ perPage: 100 });
      setTenants(response.items || []);
    } catch (err) {
      console.error('Failed to load tenants:', err);
      // Mock tenants for demo
      setTenants([
        { id: 'tenant-1', name: 'Acme Corporation', status: 'active', plan: 'enterprise', createdAt: '2024-01-15T10:30:00Z' },
        { id: 'tenant-2', name: 'Tech Startup Inc', status: 'active', plan: 'premium', createdAt: '2024-02-20T14:15:00Z' },
      ]);
    }
  };

  // Real-time email domain validation
  useEffect(() => {
    if (formData.email && isValidEmail(formData.email)) {
      validateEmail(formData.email);
    } else {
      setEmailValidation({ checking: false });
    }
  }, [formData.email]);

  const validateEmail = async (email: string) => {
    setEmailValidation({ checking: true });
    
    try {
      // Try API validation
      const result = await validateEmailDomain(email);
      setEmailValidation({
        checking: false,
        message: result.message,
        suggestedType: result.suggestedUserType,
      });
      
      // Auto-suggest user type
      if (result.suggestedUserType && result.suggestedUserType !== formData.userType) {
        setFormData(prev => ({ ...prev, userType: result.suggestedUserType }));
      }
    } catch (err) {
      // Fallback to local validation
      const isInternal = isInternalEmail(email);
      const suggestedType: UserType = isInternal ? 'internal' : 'external';
      
      setEmailValidation({
        checking: false,
        message: isInternal 
          ? t.emailDomainInternal || 'Email domain appears to be internal'
          : t.emailDomainExternal || 'Email domain appears to be external',
        suggestedType,
      });
      
      if (suggestedType !== formData.userType) {
        setFormData(prev => ({ ...prev, userType: suggestedType }));
      }
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username.trim()) {
      newErrors.username = t.usernameRequired || 'Username is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t.emailRequired || 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = t.invalidEmail || 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = t.passwordRequired || 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = t.passwordTooShort || 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await createUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        userType: formData.userType,
        primaryTenantId: formData.primaryTenantId || undefined,
        status: formData.status,
      });
      
      navigate('/admin/users');
    } catch (err: any) {
      console.error('Failed to create user:', err);
      setError(err.response?.data?.message || t.createUserFailed || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthorizedComponent permissions="user.manage">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {t.createUser || 'Create User'}
          </h1>
        </div>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
          <Input
            label={t.username}
            type="text"
            value={formData.username}
            onChange={(e) => handleChange('username', e.target.value)}
            error={errors.username}
            placeholder={t.enterUsername || 'Enter username'}
            required
          />

          <div>
            <Input
              label={t.email || 'Email'}
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
              placeholder={t.enterEmail || 'Enter email'}
              required
            />
            {emailValidation.checking && (
              <p className="text-sm text-gray-500 mt-1">
                {t.validatingEmail || 'Validating email...'}
              </p>
            )}
            {emailValidation.message && !emailValidation.checking && (
              <p className={`text-sm mt-1 ${
                emailValidation.suggestedType === 'internal' 
                  ? 'text-blue-600' 
                  : 'text-gray-600'
              }`}>
                {emailValidation.message}
              </p>
            )}
          </div>

          <Input
            label={t.password || 'Password'}
            type="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            error={errors.password}
            placeholder={t.enterPassword || 'Enter password'}
            helperText={t.passwordHelp || 'Minimum 8 characters'}
            required
          />

          <Select
            label={t.userType || 'User Type'}
            options={[
              { value: 'internal', label: t.internal || 'Internal' },
              { value: 'external', label: t.external || 'External' },
            ]}
            value={formData.userType}
            onChange={(value) => handleChange('userType', value)}
          />

          <Select
            label={t.status}
            options={[
              { value: 'active', label: t.active },
              { value: 'inactive', label: t.inactive },
              { value: 'suspended', label: t.suspended },
            ]}
            value={formData.status}
            onChange={(value) => handleChange('status', value)}
          />

          <Select
            label={t.primaryTenant || 'Primary Tenant (Optional)'}
            options={[
              { value: '', label: t.selectTenant || 'Select tenant...' },
              ...tenants.map(tenant => ({
                value: tenant.id,
                label: tenant.name,
              })),
            ]}
            value={formData.primaryTenantId}
            onChange={(value) => handleChange('primaryTenantId', value)}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/admin/users')}
              disabled={loading}
            >
              {t.cancel}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t.creating : t.create}
            </Button>
          </div>
        </form>
      </div>
    </AuthorizedComponent>
  );
};

export default UserCreatePage;
