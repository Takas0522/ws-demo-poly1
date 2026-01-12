import React from 'react';
import { useAuthorization } from '../hooks/useAuthorization';
import { AuthorizedComponent } from '../components/AuthorizedComponent';
import { useI18n } from '../i18n/I18nContext';
import { Button } from '../components/ui/Button';

/**
 * Demo page showing authorization examples
 */
const DemoPage: React.FC = () => {
  const { hasPermission, user, checkAndExecute } = useAuthorization();
  const { t } = useI18n();

  const handleDelete = checkAndExecute(
    'admin.delete',
    () => alert(t.itemDeleted),
    () => alert(t.noDeletePermission)
  );

  const handleEdit = checkAndExecute(
    'editor.edit',
    () => alert(t.editingItem),
    () => alert(t.noEditPermission)
  );

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{t.authorizationDemo}</h1>
      
      <div className="mb-5 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">{t.currentUser}: {user?.username || t.notLoggedIn}</h3>
        <p className="text-gray-700">{t.permissions}: {user?.permissions.length || 0}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.buttonLevelAuthExamples}</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.simplePermissionCheck}</h3>
          <AuthorizedComponent permissions="admin.delete">
            <Button variant="danger" onClick={handleDelete}>
              {t.deleteAdminOnly}
            </Button>
          </AuthorizedComponent>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.multiplePermissionsAnyOne}</h3>
          <AuthorizedComponent permissions={['editor.edit', 'admin.edit']}>
            <Button variant="primary" onClick={handleEdit}>
              {t.editEditorOrAdmin}
            </Button>
          </AuthorizedComponent>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.allPermissionsRequired}</h3>
          <AuthorizedComponent
            permissions={['admin.view', 'admin.edit']}
            requireAll
            fallback={<div className="text-gray-500">{t.needBothViewAndEdit}</div>}
          >
            <Button className="bg-green-600 hover:bg-green-700 focus:ring-green-500">
              {t.adminPanelAllPermissions}
            </Button>
          </AuthorizedComponent>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.withFallbackContent}</h3>
          <AuthorizedComponent
            permissions="premium.feature"
            fallback={
              <div className="px-5 py-2.5 bg-yellow-400 text-gray-900 rounded">
                {t.upgradeToPremium}
              </div>
            }
          >
            <Button className="bg-purple-600 hover:bg-purple-700 focus:ring-purple-500">
              {t.premiumFeature}
            </Button>
          </AuthorizedComponent>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.conditionalRenderingWithHook}</h3>
          {hasPermission('user.view') && (
            <Button className="bg-cyan-600 hover:bg-cyan-700 focus:ring-cyan-500">
              {t.viewUsersHookBased}
            </Button>
          )}
        </div>
      </div>

      <div className="mb-5">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">{t.permissionInformation}</h2>
        <p className="text-gray-700 leading-relaxed">
          {t.permissionInfoText}
        </p>
      </div>
    </div>
  );
};

export default DemoPage;
