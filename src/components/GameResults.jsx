import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { mergeStyles } from '../styles/styleUtils';

/**
 * 游戏结果组件，显示游戏结果和调试信息
 */
const GameResults = ({ 
  gameResult, 
  debugVisible,
  logs,
  setDebugVisible,
  copyLogs,
  styles
}) => {
  // 使用useMemo缓存游戏结果渲染
  const resultComponent = useMemo(() => {
    if (!gameResult) return null;
    
    // 使用mergeStyles合并样式
    const resultContainerStyle = mergeStyles(
      styles.resultContainer, 
      gameResult.success ? styles.resultSuccess : styles.resultError
    );
    
    return (
      <div style={resultContainerStyle}>
        <div style={styles.resultText}>
          {gameResult.success ? '🎉 恭喜，你答对了！' : '😕 很遗憾，有错误！'}
        </div>
        <div style={styles.resultDetails}>
          {!gameResult.nearestCorrect && (
            <div>最近的城市对是: {gameResult.actualNearest.cities.join(' 和 ')} 
              <strong>({gameResult.actualNearest.distance.toFixed(1)} 公里)</strong>
            </div>
          )}
          {!gameResult.farthestCorrect && (
            <div>最远的城市对是: {gameResult.actualFarthest.cities.join(' 和 ')} 
              <strong>({gameResult.actualFarthest.distance.toFixed(1)} 公里)</strong>
            </div>
          )}
        </div>
      </div>
    );
  }, [gameResult, styles]);
  
  // 使用useMemo缓存调试面板渲染
  const debugPanelComponent = useMemo(() => {
    if (!debugVisible) return null;
    
    return (
      <div style={styles.debugPanel}>
        <div style={styles.debugHeader}>
          <div style={styles.debugTitle}>调试日志</div>
          <button 
            style={styles.copyButton}
            onClick={copyLogs}
          >
            复制
          </button>
        </div>
        {logs.map((log, index) => (
          <div key={index} style={{ color: log.type === 'error' ? '#EF4444' : '#F3F4F6' }}>
            [{log.timestamp}] {log.message}
          </div>
        ))}
      </div>
    );
  }, [debugVisible, logs, styles, copyLogs]);
  
  // 使用useMemo缓存调试按钮文本
  const debugButtonText = useMemo(() => 
    debugVisible ? '隐藏调试信息' : '显示调试信息'
  , [debugVisible]);

  return (
    <>
      {resultComponent}
      
      <button 
        style={styles.debugButton}
        onClick={() => setDebugVisible(!debugVisible)}
      >
        <div style={{color: '#94A3B8', fontSize: '14px'}}>
          {debugButtonText}
        </div>
      </button>
      
      {debugPanelComponent}
    </>
  );
};

GameResults.propTypes = {
  gameResult: PropTypes.object,
  debugVisible: PropTypes.bool.isRequired,
  logs: PropTypes.array.isRequired,
  setDebugVisible: PropTypes.func.isRequired,
  copyLogs: PropTypes.func.isRequired,
  styles: PropTypes.object.isRequired
};

// 使用React.memo优化渲染
export default React.memo(GameResults); 