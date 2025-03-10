import { useNameStore } from '../store/nameStore';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useState, useEffect } from 'react';

export const HistoryList = () => {
  const { history, removeFromHistory, clearAllHistory, useHistoryItem } = useNameStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHistory, setFilteredHistory] = useState(history);

  // 当历史记录或搜索词变化时，更新过滤后的历史记录
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredHistory(history);
    } else {
      const filtered = history.filter(item =>
        item.query.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredHistory(filtered);
    }
  }, [history, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (history.length === 0) {
    return (
      <div className="empty-history">
        <p>暂无历史记录</p>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h3>历史记录</h3>
        <button
          className="clear-history-button"
          onClick={clearAllHistory}
          title="清空历史记录"
        >
          清空
        </button>
      </div>

      <div className="history-search">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="搜索历史记录..."
          className="history-search-input"
        />
        {searchTerm && (
          <button
            className="clear-search-button"
            onClick={() => setSearchTerm('')}
            title="清除搜索"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>

      <div className="history-list">
        {filteredHistory.length === 0 ? (
          <div className="empty-search-result">
            <p>未找到匹配的记录</p>
          </div>
        ) : (
          filteredHistory.map(item => (
            <div key={item.id} className="history-item">
              <div
                className="history-content"
                onClick={() => useHistoryItem(item)}
              >
                <div className="history-query">{item.query}</div>
                <div className="history-time">
                  {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true, locale: zhCN })}
                </div>
              </div>
              <button
                className="remove-history-button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromHistory(item.id);
                }}
                title="删除记录"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};