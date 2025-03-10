import { TranslationResult } from './translator';

export interface HistoryItem {
  id: string;
  query: string;
  timestamp: number;
  results: { [key: string]: TranslationResult[] };
}

const HISTORY_STORAGE_KEY = 'transfluent_history';
const MAX_HISTORY_ITEMS = 20;

// 获取所有历史记录
export const getHistory = (): HistoryItem[] => {
  try {
    const historyJson = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!historyJson) return [];

    const history = JSON.parse(historyJson);
    return Array.isArray(history) ? history : [];
  } catch (error) {
    console.error('读取历史记录失败:', error);
    return [];
  }
};

// 添加新的历史记录
export const addToHistory = (query: string, results: { [key: string]: TranslationResult[] }): void => {
  try {
    const history = getHistory();

    // 检查是否已存在相同查询
    const existingIndex = history.findIndex(item => item.query === query);

    // 如果存在，则更新结果和时间戳
    if (existingIndex !== -1) {
      history[existingIndex] = {
        ...history[existingIndex],
        timestamp: Date.now(),
        results
      };
    } else {
      // 否则添加新记录
      const newItem: HistoryItem = {
        id: generateId(),
        query,
        timestamp: Date.now(),
        results
      };

      // 添加到历史记录开头
      history.unshift(newItem);
    }

    // 限制历史记录数量
    const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);

    // 保存到本地存储
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('保存历史记录失败:', error);
  }
};

// 清除历史记录
export const clearHistory = (): void => {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (error) {
    console.error('清除历史记录失败:', error);
  }
};

// 删除单个历史记录
export const removeHistoryItem = (id: string): void => {
  try {
    const history = getHistory();
    const filteredHistory = history.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(filteredHistory));
  } catch (error) {
    console.error('删除历史记录失败:', error);
  }
};

// 生成唯一ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// 获取最近的一条历史记录
export const getLatestHistoryItem = (): HistoryItem | null => {
  try {
    const history = getHistory();
    return history.length > 0 ? history[0] : null;
  } catch (error) {
    console.error('获取最近历史记录失败:', error);
    return null;
  }
};