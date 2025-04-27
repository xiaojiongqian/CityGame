// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// 模拟ResizeObserver
class ResizeObserverMock {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

// 挂载到全局
global.ResizeObserver = ResizeObserverMock;

// 模拟IntersectionObserver
class IntersectionObserverMock {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

// 挂载到全局
global.IntersectionObserver = IntersectionObserverMock;

// 模拟URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-url');

// 模拟matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// 模拟Leaflet依赖
jest.mock('leaflet', () => {
  const leafletMock = {
    map: jest.fn(() => ({
      setView: jest.fn(),
      remove: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
      invalidateSize: jest.fn(),
      fitBounds: jest.fn(),
      getContainer: jest.fn().mockReturnValue({ style: {} }),
      eachLayer: jest.fn((callback) => {
        // 模拟没有任何图层
      }),
      removeLayer: jest.fn(),
    })),
    tileLayer: jest.fn(() => ({
      addTo: jest.fn(),
    })),
    marker: jest.fn(() => ({
      addTo: jest.fn(),
      bindTooltip: jest.fn(),
    })),
    polyline: jest.fn(() => ({
      addTo: jest.fn(),
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

// 模拟document.createElement以处理地图容器
const originalCreateElement = document.createElement.bind(document);
document.createElement = jest.fn((tagName) => {
  const element = originalCreateElement(tagName);
  if (tagName.toLowerCase() === 'div') {
    // 为地图容器元素添加所需方法
    Object.defineProperty(element, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        width: 800,
        height: 600,
        top: 0,
        left: 0,
        bottom: 600,
        right: 800,
      }),
    });
  }
  return element;
});
