import { useState, useEffect, useCallback } from 'react';
import { useNameStore } from '../store/nameStore';

export const InputBox = () => {
  const { input, setInput, translate, toggleHistory, showHistory } = useNameStore();
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
      <div className="input-wrapper">
        <input
          type="text"
          value={input}
          onChange={handleInput}
          placeholder="请输入中文描述..."
          className="name-input"
        />
        <button
          className={`history-toggle-button ${showHistory ? 'active' : ''}`}
          onClick={toggleHistory}
          title="历史记录"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.05 11C3.27151 8.68261 4.51919 6.56428 6.48114 5.13446C8.4431 3.70464 10.9422 3.07123 13.3229 3.37156C15.7037 3.67188 17.8485 4.88345 19.2716 6.74205C20.6947 8.60064 21.2945 10.9467 20.9502 13.2549C20.6059 15.5631 19.3476 17.6563 17.4083 19.0644C15.469 20.4725 13.0133 21.0999 10.6247 20.8015C8.23608 20.5032 6.07753 19.3122 4.63088 17.4677C3.18423 15.6232 2.55798 13.2826 2.87 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};