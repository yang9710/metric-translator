import { create } from 'zustand';
import { NameTranslator, TranslationResult } from '../utils/translator';
import {
  addToHistory,
  getHistory,
  HistoryItem,
  removeHistoryItem,
  clearHistory,
  getLatestHistoryItem
} from '../utils/historyStorage';

interface NameState {
  input: string;
  results: { [key: string]: TranslationResult[] };
  loading: boolean;
  error: string | null;
  translator: NameTranslator;
  history: HistoryItem[];
  showHistory: boolean;
  setInput: (input: string) => void;
  translate: () => Promise<void>;
  clearError: () => void;
  loadHistory: () => void;
  loadLatestQuery: () => void;
  toggleHistory: () => void;
  removeFromHistory: (id: string) => void;
  clearAllHistory: () => void;
  useHistoryItem: (item: HistoryItem) => void;
}

export const useNameStore = create<NameState>()((set, get) => ({
  input: '',
  results: {},
  loading: false,
  error: null,
  translator: new NameTranslator(),
  history: [],
  showHistory: false,

  setInput: (input: string) => set({ input }),

  clearError: () => set({ error: null }),

  translate: async () => {
    const { translator, input } = get();

    if (!input.trim()) {
      set({ error: '请输入中文描述' });
      return;
    }

    set({ loading: true, error: null });

    try {
      const results = await translator.translate(input);

      if (Object.keys(results).length === 0 || Object.keys(results).includes('error')) {
        set({
          loading: false,
          error: '翻译失败，请稍后再试'
        });
        return;
      }

      // 添加到历史记录
      addToHistory(input, results);

      // 更新状态并重新加载历史记录
      set({
        results,
        loading: false,
        history: getHistory()
      });
    } catch (error) {
      console.error('翻译错误:', error);
      set({
        loading: false,
        error: '翻译服务暂时不可用，请稍后再试'
      });
    }
  },

  loadHistory: () => {
    set({ history: getHistory() });
  },

  loadLatestQuery: () => {
    const latestItem = getLatestHistoryItem();
    if (latestItem) {
      set({
        input: latestItem.query,
        results: latestItem.results
      });
    }
  },

  toggleHistory: () => {
    const { showHistory } = get();
    set({ showHistory: !showHistory });

    // 如果正在显示历史记录，确保历史记录是最新的
    if (!showHistory) {
      set({ history: getHistory() });
    }
  },

  removeFromHistory: (id: string) => {
    removeHistoryItem(id);
    set({ history: getHistory() });
  },

  clearAllHistory: () => {
    clearHistory();
    set({ history: [] });
  },

  useHistoryItem: (item: HistoryItem) => {
    set({
      input: item.query,
      results: item.results,
      showHistory: false
    });
  }
}));