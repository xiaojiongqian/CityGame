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

/**
 * 创建响应式样式，根据屏幕大小应用不同样式
 * @param {Object} defaultStyle - 默认样式对象
 * @param {Object} mobileStyle - 移动端样式对象
 * @param {boolean} isMobile - 是否为移动端 
 * @returns {Object} 合并后的样式对象
 */
export const createResponsiveStyle = (defaultStyle, mobileStyle, isMobile) => {
  return isMobile ? { ...defaultStyle, ...mobileStyle } : defaultStyle;
};

/**
 * 动态创建带有过渡效果的样式
 * @param {Object} baseStyle - 基本样式对象
 * @param {string} property - 要过渡的属性 (如 'all', 'opacity', 'transform' 等)
 * @param {string} duration - 过渡持续时间 (如 '0.3s', '500ms' 等)
 * @param {string} timingFunction - 过渡计时函数 (如 'ease', 'linear', 'ease-in-out' 等)
 * @returns {Object} 添加了过渡效果的样式对象
 */
export const withTransition = (baseStyle, property = 'all', duration = '0.3s', timingFunction = 'ease') => {
  return {
    ...baseStyle,
    transition: `${property} ${duration} ${timingFunction}`
  };
};

/**
 * 创建卡片样式 
 * @param {string} backgroundColor - 背景色
 * @param {string} borderColor - 边框颜色
 * @param {string} shadowColor - 阴影颜色
 * @param {Object} customStyle - 自定义样式
 * @returns {Object} 卡片样式对象
 */
export const createCardStyle = (
  backgroundColor = 'white', 
  borderColor = 'rgba(0, 0, 0, 0.05)', 
  shadowColor = 'rgba(0, 0, 0, 0.08)',
  customStyle = {}
) => {
  return {
    background: backgroundColor,
    borderRadius: '16px',
    boxShadow: `0 4px 15px ${shadowColor}`,
    padding: '16px',
    transition: 'all 0.3s ease',
    border: `1px solid ${borderColor}`,
    ...customStyle
  };
};

/**
 * 确保按钮高度一致性
 * @param {Object} buttonStyle - 按钮样式对象 
 * @param {string} height - 按钮高度
 * @param {string} lineHeight - 按钮文本行高
 * @returns {Object} 修正后的按钮样式
 */
export const ensureButtonHeight = (buttonStyle, height = '48px', lineHeight = '28px') => {
  return {
    ...buttonStyle,
    height,
    lineHeight,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };
}; 