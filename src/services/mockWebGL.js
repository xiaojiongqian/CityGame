/**
 * WebGL模拟服务
 * 为测试环境提供WebGL相关功能的模拟实现
 */

// 创建模拟的WebGL上下文
class MockWebGLRenderingContext {
  constructor() {
    // 模拟基本WebGL属性和方法
    this.canvas = null;
    this.drawingBufferWidth = 0;
    this.drawingBufferHeight = 0;
  }

  // 模拟基本WebGL方法
  clearColor() {}
  clear() {}
  enable() {}
  createBuffer() { return {}; }
  bindBuffer() {}
  bufferData() {}
  createProgram() { return {}; }
  createShader() { return {}; }
  // 可以根据需要添加更多方法
}

// 在Node环境中模拟HTMLCanvasElement的getContext方法
function setupMockWebGL() {
  // 检查是否在Node环境中
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    
    // 重写getContext方法以返回模拟的WebGL上下文
    HTMLCanvasElement.prototype.getContext = function(contextType, ...args) {
      if (contextType === 'webgl' || contextType === 'experimental-webgl') {
        return new MockWebGLRenderingContext();
      }
      // 对于其他类型的上下文，使用原始方法
      return originalGetContext.call(this, contextType, ...args);
    };
  }
}

// 恢复原始的getContext方法
function teardownMockWebGL() {
  if (typeof window !== 'undefined' && typeof document !== 'undefined' && 
      HTMLCanvasElement.prototype._originalGetContext) {
    HTMLCanvasElement.prototype.getContext = HTMLCanvasElement.prototype._originalGetContext;
    delete HTMLCanvasElement.prototype._originalGetContext;
  }
}

export {
  setupMockWebGL,
  teardownMockWebGL,
  MockWebGLRenderingContext
}; 