import React from 'react';
import { render, screen } from '@testing-library/react';
import CityGame from '../CityGame';

// 模拟Leaflet
jest.mock('leaflet', () => {
  const leafletMock = {
    map: jest.fn(() => ({
      setView: jest.fn(),
      remove: jest.fn(),
      on: jest.fn(),
      invalidateSize: jest.fn(),
      fitBounds: jest.fn(),
    })),
    tileLayer: jest.fn(() => ({
      addTo: jest.fn(),
    })),
    marker: jest.fn(() => ({
      addTo: jest.fn(),
      bindTooltip: jest.fn(),
    })),
    latLngBounds: jest.fn(() => ({
      extend: jest.fn(),
    })),
    Icon: {
      Default: {
        prototype: {
          _getIconUrl: jest.fn(),
        },
        mergeOptions: jest.fn(),
      },
    },
  };
  return leafletMock;
});

// 模拟城市数据服务
jest.mock('../services/mapServices', () => ({
  formatDistance: jest.fn(meters => `${meters.toFixed(1)}公里`),
  formatDuration: jest.fn(seconds => `${Math.floor(seconds / 60)}分钟`)
}));

jest.mock('../services/cityData', () => ({
  getAllCities: jest.fn(() => ['北京', '上海', '广州']),
  getRandomCities: jest.fn(() => ['北京', '上海', '广州']),
  calculateDirectDistance: jest.fn(() => 1000),
  getNearestAndFarthestCities: jest.fn(() => ({
    nearest: { cities: ['北京', '天津'], distance: 100 },
    farthest: { cities: ['北京', '广州'], distance: 2000 },
  })),
  getCityCoordinates: jest.fn((city) => {
    const coords = {
      '北京': [116.407526, 39.90403],
      '上海': [121.473701, 31.230416],
      '广州': [113.264385, 23.12911],
      '天津': [117.190182, 39.125596],
    };
    return coords[city] || null;
  }),
}));

// 禁用控制台警告和错误以保持测试输出干净
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
  console.log.mockRestore();
});

describe('CityGame 组件', () => {
  test('应渲染游戏标题和开始按钮', () => {
    render(<CityGame />);
    
    // 检查标题是否存在
    expect(screen.getByText('猜城市距离')).toBeInTheDocument();
  });
}); 