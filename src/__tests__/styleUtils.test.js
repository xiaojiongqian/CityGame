import { applyButtonHoverEffects, getCityPairStyle, applyDisabledStyles, mergeStyles } from '../styles/styleUtils';

describe('样式工具函数测试', () => {
  describe('applyButtonHoverEffects', () => {
    it('应该返回包含onMouseEnter和onMouseLeave处理函数的对象', () => {
      const baseStyle = { boxShadow: '0 2px 4px rgba(0,0,0,0.1)' };
      const hoverStyles = { backgroundColor: 'red', transform: 'scale(1.1)' };
      
      const result = applyButtonHoverEffects(baseStyle, hoverStyles);
      
      expect(result).toHaveProperty('onMouseEnter');
      expect(result).toHaveProperty('onMouseLeave');
      expect(typeof result.onMouseEnter).toBe('function');
      expect(typeof result.onMouseLeave).toBe('function');
    });
    
    it('应该在鼠标进入时应用悬停样式', () => {
      const baseStyle = { boxShadow: '0 2px 4px rgba(0,0,0,0.1)' };
      const hoverStyles = { backgroundColor: 'red', transform: 'scale(1.1)' };
      
      const result = applyButtonHoverEffects(baseStyle, hoverStyles);
      
      const mockEvent = {
        target: {
          style: {}
        }
      };
      
      result.onMouseEnter(mockEvent);
      
      expect(mockEvent.target.style.backgroundColor).toBe('red');
      expect(mockEvent.target.style.transform).toBe('scale(1.1)');
    });
    
    it('不应该在按钮禁用时应用悬停样式', () => {
      const baseStyle = { boxShadow: '0 2px 4px rgba(0,0,0,0.1)' };
      const hoverStyles = { backgroundColor: 'red', transform: 'scale(1.1)' };
      
      const result = applyButtonHoverEffects(baseStyle, hoverStyles);
      
      const mockEvent = {
        target: {
          disabled: true,
          style: {}
        }
      };
      
      result.onMouseEnter(mockEvent);
      
      expect(mockEvent.target.style.backgroundColor).toBeUndefined();
      expect(mockEvent.target.style.transform).toBeUndefined();
    });
    
    it('应该在鼠标离开时重置样式', () => {
      const baseStyle = { boxShadow: '0 2px 4px rgba(0,0,0,0.1)' };
      const hoverStyles = { backgroundColor: 'red', transform: 'scale(1.1)' };
      
      const result = applyButtonHoverEffects(baseStyle, hoverStyles);
      
      const mockEvent = {
        target: {
          style: {
            backgroundColor: 'red',
            transform: 'scale(1.1)',
            boxShadow: 'none'
          }
        }
      };
      
      result.onMouseLeave(mockEvent);
      
      expect(mockEvent.target.style.backgroundColor).toBe('');
      expect(mockEvent.target.style.transform).toBe(baseStyle.transform || '');
      expect(mockEvent.target.style.boxShadow).toBe(baseStyle.boxShadow);
    });
    
    it('应该在鼠标离开时使用baseStyle中的transform值', () => {
      const baseStyle = { 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transform: 'translateY(2px)'
      };
      const hoverStyles = { backgroundColor: 'red', transform: 'scale(1.1)' };
      
      const result = applyButtonHoverEffects(baseStyle, hoverStyles);
      
      const mockEvent = {
        target: {
          style: {
            backgroundColor: 'red',
            transform: 'scale(1.1)',
            boxShadow: 'none'
          }
        }
      };
      
      result.onMouseLeave(mockEvent);
      
      expect(mockEvent.target.style.backgroundColor).toBe('');
      expect(mockEvent.target.style.transform).toBe(baseStyle.transform);
      expect(mockEvent.target.style.boxShadow).toBe(baseStyle.boxShadow);
    });
  });
  
  describe('getCityPairStyle', () => {
    it('应该返回基本样式当未选中且游戏未结束', () => {
      const baseStyle = { color: 'black' };
      const selectedStyle = { color: 'blue' };
      const correctStyle = { color: 'green' };
      const incorrectStyle = { color: 'red' };
      
      const result = getCityPairStyle(
        baseStyle,
        selectedStyle,
        correctStyle,
        incorrectStyle,
        false, // 未选中
        null,  // 游戏未结束
        false  // 不正确
      );
      
      expect(result).toEqual(baseStyle);
    });
    
    it('应该返回选中样式当选中且游戏未结束', () => {
      const baseStyle = { color: 'black' };
      const selectedStyle = { color: 'blue' };
      const correctStyle = { color: 'green' };
      const incorrectStyle = { color: 'red' };
      
      const result = getCityPairStyle(
        baseStyle,
        selectedStyle,
        correctStyle,
        incorrectStyle,
        true,  // 选中
        null,  // 游戏未结束
        false  // 不正确
      );
      
      expect(result).toEqual({ ...baseStyle, ...selectedStyle });
    });
    
    it('应该返回正确样式当选中且游戏结束且猜测正确', () => {
      const baseStyle = { color: 'black' };
      const selectedStyle = { color: 'blue' };
      const correctStyle = { color: 'green' };
      const incorrectStyle = { color: 'red' };
      
      const result = getCityPairStyle(
        baseStyle,
        selectedStyle,
        correctStyle,
        incorrectStyle,
        true,  // 选中
        {},    // 游戏结束
        true   // 正确
      );
      
      expect(result).toEqual({ ...baseStyle, ...selectedStyle, ...correctStyle });
    });
    
    it('应该返回错误样式当选中且游戏结束且猜测错误', () => {
      const baseStyle = { color: 'black' };
      const selectedStyle = { color: 'blue' };
      const correctStyle = { color: 'green' };
      const incorrectStyle = { color: 'red' };
      
      const result = getCityPairStyle(
        baseStyle,
        selectedStyle,
        correctStyle,
        incorrectStyle,
        true,  // 选中
        {},    // 游戏结束
        false  // 错误
      );
      
      expect(result).toEqual({ ...baseStyle, ...selectedStyle, ...incorrectStyle });
    });
    
    it('应该合并自定义样式', () => {
      const baseStyle = { color: 'black' };
      const selectedStyle = { color: 'blue' };
      const correctStyle = { color: 'green' };
      const incorrectStyle = { color: 'red' };
      const customStyle = { fontSize: '16px' };
      
      const result = getCityPairStyle(
        baseStyle,
        selectedStyle,
        correctStyle,
        incorrectStyle,
        true,  // 选中
        {},    // 游戏结束
        true,  // 正确
        customStyle
      );
      
      expect(result).toEqual({ ...baseStyle, ...selectedStyle, ...correctStyle, ...customStyle });
    });
  });
  
  describe('applyDisabledStyles', () => {
    it('应该返回原样式当未禁用', () => {
      const baseStyle = { color: 'black' };
      
      const result = applyDisabledStyles(baseStyle, false, false);
      
      expect(result).toEqual(baseStyle);
    });
    
    it('应该添加禁用样式当禁用且未选中', () => {
      const baseStyle = { color: 'black' };
      
      const result = applyDisabledStyles(baseStyle, true, false);
      
      expect(result).toEqual({
        ...baseStyle,
        opacity: 0.6,
        pointerEvents: 'none'
      });
    });
    
    it('应该保持不透明度为1当禁用且选中', () => {
      const baseStyle = { color: 'black' };
      
      const result = applyDisabledStyles(baseStyle, true, true);
      
      expect(result).toEqual({
        ...baseStyle,
        opacity: 1,
        pointerEvents: 'none'
      });
    });
  });
  
  describe('mergeStyles', () => {
    it('应该合并多个样式对象', () => {
      const style1 = { color: 'red', fontSize: '12px' };
      const style2 = { backgroundColor: 'blue' };
      const style3 = { fontSize: '16px', margin: '10px' };
      
      const result = mergeStyles(style1, style2, style3);
      
      expect(result).toEqual({
        color: 'red',
        fontSize: '16px',
        backgroundColor: 'blue',
        margin: '10px'
      });
    });
    
    it('应该处理空对象', () => {
      const style1 = { color: 'red' };
      const style2 = {};
      
      const result = mergeStyles(style1, style2);
      
      expect(result).toEqual({ color: 'red' });
    });
  });
}); 