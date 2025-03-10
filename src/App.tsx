import { InputBox } from './components/InputBox';
import { ResultList } from './components/ResultList';
import { HistoryList } from './components/HistoryList';
import { useNameStore } from './store/nameStore';
import { useEffect } from 'react';
import './App.css';

function App() {
  const { showHistory, loadHistory, loadLatestQuery } = useNameStore();

  // 组件挂载时加载历史记录和最近查询
  useEffect(() => {
    loadHistory();
    loadLatestQuery();
  }, [loadHistory, loadLatestQuery]);

  return (
    <div className="app-container">
      <h1>指标命名助手</h1>
      <InputBox />
      {showHistory ? <HistoryList /> : <ResultList />}
    </div>
  );
}

export default App;
