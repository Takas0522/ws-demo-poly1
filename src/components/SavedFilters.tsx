import React, { useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { SavedFilter, FilterType } from '../types/filters';
import { 
  getSavedFiltersByType, 
  saveFilter, 
  deleteFilter, 
  updateFilter 
} from '../utils/savedFilters';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Badge } from './ui/Badge';

interface SavedFiltersProps {
  filterType: FilterType;
  currentCriteria: any;
  onApplyFilter: (criteria: any) => void;
}

/**
 * Saved Filters Component
 * Allows users to save, load, and manage filter presets
 */
export const SavedFilters: React.FC<SavedFiltersProps> = ({
  filterType,
  currentCriteria,
  onApplyFilter,
}) => {
  const { t, language } = useI18n();
  const [filters, setFilters] = useState<SavedFilter[]>(() => getSavedFiltersByType(filterType));
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [saveError, setSaveError] = useState('');

  const refreshFilters = () => {
    setFilters(getSavedFiltersByType(filterType));
  };

  const handleSaveFilter = () => {
    if (!filterName.trim()) {
      setSaveError(language === 'ja' ? 'フィルター名を入力してください' : 'Please enter a filter name');
      return;
    }

    try {
      const newFilter = saveFilter({
        name: filterName.trim(),
        type: filterType,
        criteria: currentCriteria,
      } as any);

      refreshFilters();
      setShowSaveModal(false);
      setFilterName('');
      setSaveError('');
    } catch (error) {
      setSaveError(language === 'ja' ? 'フィルターの保存に失敗しました' : 'Failed to save filter');
    }
  };

  const handleDeleteFilter = (id: string) => {
    if (window.confirm(language === 'ja' ? 'このフィルターを削除しますか？' : 'Delete this filter?')) {
      deleteFilter(id);
      refreshFilters();
    }
  };

  const handleApplyFilter = (filter: SavedFilter) => {
    onApplyFilter(filter.criteria);
  };

  const getFilterLabel = (): string => {
    switch (filterType) {
      case 'tenant':
        return language === 'ja' ? 'テナントフィルター' : 'Tenant Filters';
      case 'user':
        return language === 'ja' ? 'ユーザーフィルター' : 'User Filters';
      case 'service':
        return language === 'ja' ? 'サービスフィルター' : 'Service Filters';
    }
  };

  return (
    <div className="space-y-2">
      {/* Quick Access Dropdown */}
      {filters.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ja' ? '保存済みフィルター' : 'Saved Filters'}
          </label>
          <select
            onChange={(e) => {
              const filter = filters.find(f => f.id === e.target.value);
              if (filter) {
                handleApplyFilter(filter);
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            defaultValue=""
          >
            <option value="">
              {language === 'ja' ? 'フィルターを選択...' : 'Select filter...'}
            </option>
            {filters.map((filter) => (
              <option key={filter.id} value={filter.id}>
                {filter.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowSaveModal(true)}
        >
          💾 {language === 'ja' ? '現在のフィルターを保存' : 'Save Current Filter'}
        </Button>
        
        {filters.length > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowManageModal(true)}
          >
            ⚙️ {language === 'ja' ? '管理' : 'Manage'}
          </Button>
        )}
      </div>

      {/* Save Filter Modal */}
      <Modal
        isOpen={showSaveModal}
        onClose={() => {
          setShowSaveModal(false);
          setFilterName('');
          setSaveError('');
        }}
        title={language === 'ja' ? 'フィルターを保存' : 'Save Filter'}
      >
        <div className="space-y-4">
          <Input
            label={language === 'ja' ? 'フィルター名' : 'Filter Name'}
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            placeholder={language === 'ja' ? '例: アクティブなエンタープライズテナント' : 'e.g., Active Enterprise Tenants'}
            error={saveError}
          />
          <div className="flex gap-2 justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setShowSaveModal(false);
                setFilterName('');
                setSaveError('');
              }}
            >
              {t.cancel}
            </Button>
            <Button onClick={handleSaveFilter}>
              {t.save}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Manage Filters Modal */}
      <Modal
        isOpen={showManageModal}
        onClose={() => setShowManageModal(false)}
        title={getFilterLabel()}
      >
        <div className="space-y-2">
          {filters.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              {language === 'ja' ? '保存されたフィルターがありません' : 'No saved filters'}
            </div>
          ) : (
            filters.map((filter) => (
              <div
                key={filter.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{filter.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {language === 'ja' ? '作成日' : 'Created'}:{' '}
                    {new Date(filter.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      handleApplyFilter(filter);
                      setShowManageModal(false);
                    }}
                  >
                    {language === 'ja' ? '適用' : 'Apply'}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteFilter(filter.id)}
                  >
                    {t.delete}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
};
