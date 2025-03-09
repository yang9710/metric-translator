import { InputBox } from './components/InputBox';
import { ResultList } from './components/ResultList';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <h1>指标命名助手</h1>
      <InputBox />
      <ResultList />
    </div>
  );
}

export default App;
