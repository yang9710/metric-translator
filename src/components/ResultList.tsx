import { useNameStore } from '../store/nameStore';
import { useState } from 'react';
import { TranslationResult } from '../utils/translator';

export const ResultList = () => {
  const { results, loading, error } = useNameStore();
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('camelCase');

  const copyToClipboard = (text: string, resultId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(resultId);

    // 2秒后重置状态
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <span>正在生成...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 8V12" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 16H12.01" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>{error}</span>
      </div>
    );
  }

  if (Object.keys(results).length === 0) {
    return null;
  }

  // 获取所有可用的样式标签
  const availableStyles = Object.keys(results).filter(style => style !== 'error');

  return (
    <div className="results-section">
      <div className="tabs">
        {availableStyles.map(style => (
          <div
            key={style}
            className={`tab ${activeTab === style ? 'active' : ''}`}
            onClick={() => setActiveTab(style)}
          >
            {getStyleShortName(style)}
          </div>
        ))}
      </div>

      {results[activeTab] && (
        <div className="results-container">
          {results[activeTab].map((result: TranslationResult, index: number) => {
            const resultId = `${activeTab}-${index}`;
            return (
              <div key={resultId} className="result-item">
                <div className="result-left">
                  <span className="result-text">{result.text}</span>
                  <div className="result-meta">
                    <span className={`source-tag source-${result.source.toLowerCase()}`}>
                      {result.source}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(result.text, resultId)}
                  className={`copy-button ${copiedIndex === resultId ? 'copied' : ''}`}
                  title="复制到剪贴板"
                >
                  {copiedIndex === resultId ? (
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 4V16C8 16.5304 8.21071 17.0391 8.58579 17.4142C8.96086 17.7893 9.46957 18 10 18H18C18.5304 18 19.0391 17.7893 19.4142 17.4142C19.7893 17.0391 20 16.5304 20 16V7.242C20 6.97556 19.9467 6.71181 19.8433 6.46624C19.7399 6.22068 19.5885 5.99824 19.398 5.812L16.188 2.602C16.0018 2.41148 15.7793 2.26012 15.5338 2.15672C15.2882 2.05333 15.0244 2 14.758 2H10C9.46957 2 8.96086 2.21071 8.58579 2.58579C8.21071 2.96086 8 3.46957 8 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 18V20C16 20.5304 15.7893 21.0391 15.4142 21.4142C15.0391 21.7893 14.5304 22 14 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V8C4 7.46957 4.21071 6.96086 4.58579 6.58579C4.96086 6.21071 5.46957 6 6 6H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// 辅助函数：获取样式的显示名称
function getStyleDisplayName(style: string): string {
  switch (style) {
    case 'camelCase': return '驼峰命名 (camelCase)';
    case 'snakeCase': return '蛇形命名 (snake_case)';
    case 'constantCase': return '常量命名 (CONSTANT_CASE)';
    case 'pascalCase': return '帕斯卡命名 (PascalCase)';
    case 'kebabCase': return '短横线命名 (kebab-case)';
    default: return style;
  }
}

// 辅助函数：获取样式的简短名称（用于标签页）
function getStyleShortName(style: string): string {
  switch (style) {
    case 'camelCase': return '驼峰';
    case 'snakeCase': return '蛇形';
    case 'constantCase': return '常量';
    case 'pascalCase': return '帕斯卡';
    case 'kebabCase': return '短横线';
    default: return style;
  }
}