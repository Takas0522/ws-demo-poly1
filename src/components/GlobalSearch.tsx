import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { globalSearch } from '../api/searchApi';
import { SearchResult, SearchCategory } from '../types/search';
import { Badge } from './ui/Badge';
import { Spinner } from './ui/Spinner';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Global Search Modal Component
 * Provides keyboard-accessible search across all entities
 */
export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const { t, language } = useI18n();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<SearchCategory>('all');
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [categories, setCategories] = useState({ tenant: 0, user: 0, service: 0 });
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || !isOpen) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [query, selectedCategory, isOpen]);

  const performSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await globalSearch({
        query: query.trim(),
        category: selectedCategory,
        limit: 20,
      });
      setResults(response.results);
      setCategories(response.categories);
      setSelectedIndex(0);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(result.path);
    onClose();
    setQuery('');
    setResults([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        }
        break;
    }
  };

  const getCategoryLabel = (category: SearchCategory): string => {
    switch (category) {
      case 'all':
        return language === 'ja' ? 'すべて' : 'All';
      case 'tenant':
        return language === 'ja' ? 'テナント' : 'Tenants';
      case 'user':
        return language === 'ja' ? 'ユーザー' : 'Users';
      case 'service':
        return language === 'ja' ? 'サービス' : 'Services';
    }
  };

  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'tenant':
        return '🏢';
      case 'user':
        return '👤';
      case 'service':
        return '📦';
      default:
        return '📝';
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={language === 'ja' ? '検索... (Cmd+K または Ctrl+K)' : 'Search... (Cmd+K or Ctrl+K)'}
              className="w-full px-4 py-3 pl-12 pr-4 text-lg border-none focus:outline-none"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
            {loading && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Spinner />
              </div>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="px-4 py-2 border-b border-gray-200 flex gap-2">
          {(['all', 'tenant', 'user', 'service'] as SearchCategory[]).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {getCategoryLabel(category)}
              {category !== 'all' && categories[category] > 0 && (
                <span className="ml-1">({categories[category]})</span>
              )}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {!query.trim() && (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg mb-2">🔍</p>
              <p>{language === 'ja' ? '検索キーワードを入力してください' : 'Enter search keywords'}</p>
              <p className="text-sm mt-2">
                {language === 'ja' 
                  ? '矢印キーで移動、Enterで選択、Escで閉じる'
                  : 'Navigate with arrows, Enter to select, Esc to close'
                }
              </p>
            </div>
          )}

          {query.trim() && !loading && results.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg mb-2">😔</p>
              <p>{language === 'ja' ? '結果が見つかりませんでした' : 'No results found'}</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="py-2">
              {results.map((result, index) => (
                <button
                  key={`${result.category}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className={`w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors ${
                    index === selectedIndex ? 'bg-primary-50' : ''
                  }`}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="text-2xl mt-0.5">{getCategoryIcon(result.category)}</div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 truncate">{result.title}</span>
                      <Badge variant="default" size="sm">
                        {getCategoryLabel(result.category)}
                      </Badge>
                    </div>
                    {result.subtitle && (
                      <p className="text-sm text-gray-600 truncate">{result.subtitle}</p>
                    )}
                    {result.description && (
                      <p className="text-xs text-gray-500 truncate mt-1">{result.description}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer Shortcuts */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>↑↓ {language === 'ja' ? '移動' : 'Navigate'}</span>
            <span>↵ {language === 'ja' ? '選択' : 'Select'}</span>
            <span>ESC {language === 'ja' ? '閉じる' : 'Close'}</span>
          </div>
          <div>
            {results.length > 0 && (
              <span>{results.length} {language === 'ja' ? '件の結果' : 'results'}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
