import { create } from 'zustand';
import { NameTranslator, TranslationResult } from '../utils/translator';

interface NameState {
  input: string;
  results: { [key: string]: TranslationResult[] };
  loading: boolean;
  error: string | null;
  translator: NameTranslator;
  setInput: (input: string) => void;
  translate: () => Promise<void>;
  clearError: () => void;
}

export const useNameStore = create<NameState>()((set, get) => ({
  input: '',
  results: {},
  loading: false,
  error: null,
  translator: new NameTranslator(),

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

      set({ results, loading: false });
    } catch (error) {
      console.error('翻译错误:', error);
      set({
        loading: false,
        error: '翻译服务暂时不可用，请稍后再试'
      });
    }
  }
}));