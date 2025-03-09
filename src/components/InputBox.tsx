import { useState, useEffect, useCallback } from 'react';
import { useNameStore } from '../store/nameStore';

export const InputBox = () => {
  const { input, setInput, translate } = useNameStore();
  const [debouncedValue, setDebouncedValue] = useState(input);

  // 使用 useCallback 优化防抖函数
  const debouncedTranslate = useCallback(() => {
    if (debouncedValue.trim()) {
      translate();
    }
  }, [debouncedValue, translate]);

  // 输入防抖处理
  useEffect(() => {
    const timer = setTimeout(() => {
      debouncedTranslate();
    }, 800); // 增加防抖时间到 800ms

    return () => clearTimeout(timer);
  }, [debouncedValue, debouncedTranslate]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    setDebouncedValue(value);
  };

  return (
    <div className="input-container">
      <input
        type="text"
        value={input}
        onChange={handleInput}
        placeholder="请输入中文描述..."
        className="name-input"
      />
    </div>
  );
};