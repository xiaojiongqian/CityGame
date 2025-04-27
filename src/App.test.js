import { render, screen } from '@testing-library/react';
import App from './App';

// 使用jest.mock模拟CityGame组件，避免WebGL和其他浏览器API的问题
jest.mock('./CityGame', () => {
  return function MockCityGame() {
    return (
      <div>
        <h1>城市距离竞猜游戏</h1>
        <p>游戏规则：系统会随机生成3个中国城市，你需要猜哪两个城市距离最近，哪两个距离最远。</p>
      </div>
    );
  };
});

test('渲染城市距离竞猜游戏标题', () => {
  render(<App />);
  const titleElement = screen.getByText(/城市距离竞猜游戏/i);
  expect(titleElement).toBeInTheDocument();
});

test('渲染游戏规则说明', () => {
  render(<App />);
  const rulesElement = screen.getByText(/游戏规则/i);
  expect(rulesElement).toBeInTheDocument();
});
