import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { applyButtonHoverEffects, getCityPairStyle, applyDisabledStyles } from '../styles/styleUtils';

/**
 * 游戏内容组件，包含城市对列表和猜测功能
 */
const GameContent = ({ 
  cityPairs, 
  nearestGuess, 
  farthestGuess, 
  gameResult, 
  handleNearestGuess, 
  handleFarthestGuess,
  submitGuess,
  resetGame,
  styles, 
  isMobile 
}) => {
  // 使用useMemo缓存按钮悬停效果 - 所有hooks必须在条件语句之前调用
  const buttonHoverProps = useMemo(() => 
    applyButtonHoverEffects(styles.button, styles.buttonHover),
  [styles.button, styles.buttonHover]);
  
  // 使用useMemo缓存提交按钮的禁用状态和样式
  const submitButtonStyle = useMemo(() => ({
    ...styles.button, 
    width: isMobile ? '100%' : 'auto',
    ...(!nearestGuess || !farthestGuess ? styles.buttonDisabled : {})
  }), [styles.button, styles.buttonDisabled, isMobile, nearestGuess, farthestGuess]);
  
  // 使用useMemo缓存重置按钮样式
  const resetButtonStyle = useMemo(() => ({
    ...styles.button, 
    width: isMobile ? '100%' : 'auto'
  }), [styles.button, isMobile]);
  
  // 使用useMemo缓存最近城市对渲染
  const nearestCityPairs = useMemo(() => (
    cityPairs.map((pair, idx) => {
      const isSelected = nearestGuess && pair.cities.every(city => nearestGuess.cities.includes(city));
      const isDisabled = !!gameResult;
      
      // 使用样式工具函数统一处理样式
      const pairStyle = getCityPairStyle(
        styles.cityPair,
        styles.cityPairSelected,
        styles.cityPairCorrect,
        styles.cityPairIncorrect,
        isSelected,
        gameResult,
        gameResult && isSelected ? gameResult.nearestCorrect : false,
        {
          borderWidth: isSelected ? 2 : 1,
          borderColor: isSelected ? '#4F46E5' : '#E2E8F0',
          background: isSelected ? 'linear-gradient(90deg, #f5f7fa 60%, #e0e7ff 100%)' : 'white',
          transition: 'all 0.2s',
          boxShadow: isSelected ? '0 4px 16px rgba(79,70,229,0.08)' : styles.cityPair.boxShadow
        }
      );
      
      // 应用禁用样式
      const finalStyle = applyDisabledStyles(pairStyle, isDisabled, isSelected);
      
      return (
        <label key={"nearest-"+idx} style={finalStyle}>
          <input
            type="radio"
            name="nearestPair"
            disabled={isDisabled}
            checked={isSelected}
            onChange={() => { if (!gameResult) handleNearestGuess(pair); }}
            style={{marginRight: '12px', accentColor: '#4F46E5', width: '18px', height: '18px'}}
          />
          <span style={styles.cityPairNames}>{pair.cities.join(' - ')}</span>
          {gameResult && (
            <span style={styles.cityPairDistance}>{pair.distance.toFixed(1)} 公里</span>
          )}
        </label>
      );
    })
  ), [cityPairs, nearestGuess, gameResult, styles, handleNearestGuess]);
  
  // 使用useMemo缓存最远城市对渲染
  const farthestCityPairs = useMemo(() => (
    cityPairs.map((pair, idx) => {
      const isSelected = farthestGuess && pair.cities.every(city => farthestGuess.cities.includes(city));
      const isDisabled = !!gameResult;
      
      // 使用样式工具函数统一处理样式
      const pairStyle = getCityPairStyle(
        styles.cityPair,
        styles.cityPairSelected,
        styles.cityPairCorrect,
        styles.cityPairIncorrect,
        isSelected,
        gameResult,
        gameResult && isSelected ? gameResult.farthestCorrect : false,
        {
          borderWidth: isSelected ? 2 : 1,
          borderColor: isSelected ? '#EF4444' : '#E2E8F0',
          background: isSelected ? 'linear-gradient(90deg, #fef2f2 60%, #fee2e2 100%)' : 'white',
          transition: 'all 0.2s',
          boxShadow: isSelected ? '0 4px 16px rgba(239,68,68,0.08)' : styles.cityPair.boxShadow
        }
      );
      
      // 应用禁用样式
      const finalStyle = applyDisabledStyles(pairStyle, isDisabled, isSelected);
      
      return (
        <label key={"farthest-"+idx} style={finalStyle}>
          <input
            type="radio"
            name="farthestPair"
            disabled={isDisabled}
            checked={isSelected}
            onChange={() => { if (!gameResult) handleFarthestGuess(pair); }}
            style={{marginRight: '12px', accentColor: '#EF4444', width: '18px', height: '18px'}}
          />
          <span style={styles.cityPairNames}>{pair.cities.join(' - ')}</span>
          {gameResult && (
            <span style={styles.cityPairDistance}>{pair.distance.toFixed(1)} 公里</span>
          )}
        </label>
      );
    })
  ), [cityPairs, farthestGuess, gameResult, styles, handleFarthestGuess]);
  
  // 条件检查应该在所有hooks之后
  if (!cityPairs.length) return null;
  
  return (
    <div style={{ ...styles.cityPairsContainer, flexDirection: "column", overflowX: "visible" }}>
      <div style={{marginBottom: '14px'}}>
        <div style={{fontWeight: 'bold', color: '#4F46E5', marginBottom: '8px', fontSize: '18px', letterSpacing: '1px'}}>请选择最近的城市对：</div>
        <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
          {nearestCityPairs}
        </div>
      </div>
      <div>
        <div style={{fontWeight: 'bold', color: '#EF4444', marginBottom: '8px', fontSize: '18px', letterSpacing: '1px'}}>请选择最远的城市对：</div>
        <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
          {farthestCityPairs}
        </div>
      </div>
      
      <div style={styles.buttonContainer}>
        {!gameResult ? (
          <button 
            style={submitButtonStyle}
            onClick={submitGuess}
            disabled={!nearestGuess || !farthestGuess}
            {...buttonHoverProps}
          >
            提交猜测
          </button>
        ) : (
          <button 
            style={resetButtonStyle}
            onClick={resetGame}
            {...buttonHoverProps}
          >
            再玩一次
          </button>
        )}
      </div>
    </div>
  );
};

GameContent.propTypes = {
  cityPairs: PropTypes.array.isRequired,
  nearestGuess: PropTypes.object,
  farthestGuess: PropTypes.object,
  gameResult: PropTypes.object,
  handleNearestGuess: PropTypes.func.isRequired,
  handleFarthestGuess: PropTypes.func.isRequired,
  submitGuess: PropTypes.func.isRequired,
  resetGame: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired,
  isMobile: PropTypes.bool.isRequired
};

export default React.memo(GameContent); 