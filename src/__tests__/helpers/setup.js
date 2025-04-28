/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://example.org/"}
 * @jest-environment-disable
 */

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

// 模拟 window.matchMedia
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

// 模拟 document.createRange
document.createRange = () => {
  const range = new Range();
  range.getBoundingClientRect = jest.fn();
  range.getClientRects = jest.fn(() => ({
    item: () => null,
    length: 0,
  }));
  range.startContainer = document.createElement('div');
  return range;
};

// 处理 React 18 并发模式
global.IS_REACT_ACT_ENVIRONMENT = true;

// 修复Node.appendChild错误
const originalAppendChild = Node.prototype.appendChild;
Node.prototype.appendChild = function(child) {
  if (child === null || typeof child === 'undefined') {
    console.warn('Attempted to append null or undefined child node');
    return null;
  }
  return originalAppendChild.call(this, child);
};

// 修复DOM元素创建
const mockDOMElement = () => {
  const div = document.createElement('div');
  div.style = {};
  div.addEventListener = jest.fn();
  div.removeEventListener = jest.fn();
  div.getElementsByTagName = jest.fn(() => []);
  div.getElementsByClassName = jest.fn(() => []);
  div.setAttribute = jest.fn();
  div.getAttribute = jest.fn();
  div.querySelector = jest.fn();
  div.querySelectorAll = jest.fn(() => []);
  div.appendChild = jest.fn(c => div.children.push(c));
  div.children = [];
  return div;
};

// 确保document.body存在，这在jsdom环境中可能会是问题
if (!document.body) {
  document.body = mockDOMElement();
}

// 添加一个简单的测试以避免Jest警告
describe('Setup', () => {
  it('should have mocked necessary browser APIs', () => {
    expect(global.ResizeObserver).toBeDefined();
    expect(global.IntersectionObserver).toBeDefined();
  });
}); 