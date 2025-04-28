/**
 * 样式工具函数 - 用于处理重复的样式应用逻辑
 */

/**
 * 应用按钮悬停效果
 * @param {Object} baseButtonStyle - 基本按钮样式对象
 * @param {Object} hoverStyles - 悬停样式对象
 * @returns {Object} 包含onMouseEnter和onMouseLeave函数的对象
 */
export const applyButtonHoverEffects = (baseButtonStyle, hoverStyles) => {
  return {
    onMouseEnter: (e) => {
      if (e.target.disabled) return;
      
      Object.entries(hoverStyles).forEach(([key, value]) => {
        e.target.style[key] = value;
      });
    },
    onMouseLeave: (e) => {
      e.target.style.backgroundColor = '';
      e.target.style.transform = baseButtonStyle.transform || '';
      e.target.style.boxShadow = baseButtonStyle.boxShadow || '';
    }
  };
};

/**
 * 根据选择和游戏状态获取城市对样式
 * @param {Object} baseStyle - 基本样式对象
 * @param {Object} selectedStyle - 选中样式对象
 * @param {Object} correctStyle - 正确样式对象
 * @param {Object} incorrectStyle - 错误样式对象
 * @param {boolean} isSelected - 是否选中
 * @param {Object} gameResult - 游戏结果对象
 * @param {boolean} isCorrect - 选择是否正确
 * @param {Object} customStyle - 自定义样式对象
 * @returns {Object} 合并后的样式对象
 */
export const getCityPairStyle = (
  baseStyle,
  selectedStyle,
  correctStyle,
  incorrectStyle,
  isSelected,
  gameResult,
  isCorrect,
  customStyle = {}
) => {
  let resultStyle = { ...baseStyle };
  
  if (isSelected) {
    resultStyle = { ...resultStyle, ...selectedStyle };
  }
  
  if (gameResult && isSelected) {
    resultStyle = { ...resultStyle, ...(isCorrect ? correctStyle : incorrectStyle) };
  }
  
  return { ...resultStyle, ...customStyle };
};

/**
 * 应用禁用状态样式
 * @param {Object} baseStyle - 基本样式对象
 * @param {boolean} isDisabled - 是否禁用
 * @param {boolean} isSelected - 是否选中
 * @returns {Object} 添加了禁用样式的对象
 */
export const applyDisabledStyles = (baseStyle, isDisabled, isSelected) => {
  if (!isDisabled) return baseStyle;
  
  return {
    ...baseStyle,
    opacity: isDisabled && !isSelected ? 0.6 : 1,
    pointerEvents: isDisabled ? 'none' : 'auto'
  };
};

/**
 * 合并多个样式对象
 * @param  {...Object} styles - 样式对象列表
 * @returns {Object} 合并后的样式对象
 */
export const mergeStyles = (...styles) => {
  return Object.assign({}, ...styles);
}; 