import React, { useState, useEffect, useMemo, useReducer, useCallback } from 'react';
import 'leaflet/dist/leaflet.css';
import './styles/animations.css';

import { 
  getRandomCities, 
  calculateDirectDistance,
  cityCoordinates
} from './services/cityData';
import GameMap from './components/GameMap';
import GameHeader from './components/GameHeader';
import GameContent from './components/GameContent';
import GameResults from './components/GameResults';
import { 
  createResponsiveStyle,
  withTransition
} from './styles/styleUtils';
import { gameReducer, initialGameState, GAME_ACTIONS } from './reducers/gameReducer';

function CityGame() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // 使用useReducer重构状态管理
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const { 
    cities, 
    cityPairs, 
    nearestGuess, 
    farthestGuess, 
    gameResult, 
    isLoading, 
    logs, 
    debugVisible 
  } = state;
  
  // 定义样式
  const styles = useMemo(() => ({
    container: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: isMobile ? '0' : '10px',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)',
      width: '100%',
      maxWidth: isMobile ? '100%' : '650px',
      margin: '0 auto'
    },
    gameContainer: {
      width: '100%',
      maxWidth: isMobile ? '100%' : '600px',
      margin: '0 auto'
    },
    header: {
      marginBottom: '32px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: 1,
      transform: 'translateY(0)',
      padding: '10px',
    },
    headerIcon: {
      color: '#4F46E5',
      marginBottom: '12px',
      filter: 'drop-shadow(0 4px 6px rgba(79, 70, 229, 0.2))',
    },
    title: {
      fontSize: '36px',
      fontWeight: '800',
      margin: 0,
      background: 'linear-gradient(45deg, #4F46E5, #6366F1)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      textAlign: 'center',
      letterSpacing: '-0.5px',
    },
    subtitle: {
      fontSize: '16px',
      color: '#6B7280',
      textAlign: 'center',
      marginTop: '8px',
    },
    card: {
      background: 'white',
      borderRadius: isMobile ? '12px' : '16px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05), 0 5px 10px rgba(0, 0, 0, 0.03)',
      padding: isMobile ? '12px' : '16px',
      margin: isMobile ? '0 auto 12px' : '0 auto 16px',
      transition: 'all 0.3s ease',
      border: isMobile ? 'none' : '1px solid rgba(0, 0, 0, 0.05)',
      width: '100%',
      maxWidth: '100%'
    },
    description: {
      fontSize: '18px',
      lineHeight: 1.6,
      color: '#4B5563',
      textAlign: 'center',
      marginBottom: '32px',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
    },
    button: {
      color: 'white',
      fontWeight: 'bold',
      padding: '10px 24px',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)',
      background: 'linear-gradient(45deg, #4F46E5, #6366F1)',
      border: 'none',
      fontSize: '16px',
      letterSpacing: '0.5px',
      position: 'relative',
      overflow: 'hidden',
      height: '48px',
      lineHeight: '28px'
    },
    buttonHover: {
      backgroundColor: '#4338CA',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 16px rgba(79, 70, 229, 0.3)',
    },
    buttonDisabled: {
      opacity: 0.7,
      cursor: 'not-allowed',
    },
    map: {
      width: '100%',
      height: '350px',
      borderRadius: '16px',
      overflow: 'hidden',
      marginBottom: '20px',
      background: '#f2f8fc',
      position: 'relative',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(0, 0, 0, 0.05)',
    },
    cityPairsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      marginBottom: '20px',
    },
    cityPair: {
      padding: '12px 16px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      border: '1px solid #E2E8F0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      backgroundColor: 'white',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      },
    },
    cityPairSelected: {
      border: '2px solid #4F46E5',
      backgroundColor: 'rgba(79, 70, 229, 0.05)',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(79, 70, 229, 0.15)',
    },
    cityPairCorrect: {
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      border: '2px solid #10B981',
      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
    },
    cityPairIncorrect: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      border: '2px solid #EF4444',
      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)',
    },
    cityPairNames: {
      fontWeight: 'bold',
      fontSize: '18px',
      display: 'flex',
      alignItems: 'center',
      flex: '1 1 auto',
      minWidth: 0,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    cityPairIcon: {
      marginRight: '8px',
      color: '#4F46E5',
    },
    cityPairDistance: {
      color: '#6B7280',
      fontSize: '16px',
      fontWeight: '600',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      padding: '4px 10px',
      borderRadius: '8px',
    },
    guessContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '28px',
      gap: '16px',
    },
    guessBox: {
      flex: 1,
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #E2E8F0',
      textAlign: 'center',
      background: 'white',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.3s ease',
    },
    guessBoxFilled: {
      background: 'rgba(79, 70, 229, 0.05)',
      border: '1px solid #4F46E5',
      boxShadow: '0 4px 12px rgba(79, 70, 229, 0.1)',
    },
    guessType: {
      fontWeight: 'bold',
      marginBottom: '10px',
      fontSize: '16px',
      color: '#4F46E5',
    },
    guessValue: {
      color: '#4B5563',
      fontSize: '18px',
      fontWeight: '500',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    resultContainer: {
      padding: '24px',
      borderRadius: '12px',
      marginBottom: '28px',
      textAlign: 'center',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
      animation: 'fadeIn 0.5s ease',
    },
    resultSuccess: {
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      border: '1px solid #10B981',
    },
    resultError: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid #EF4444',
    },
    resultText: {
      fontWeight: 'bold',
      fontSize: '22px',
      marginBottom: '12px',
    },
    resultDetails: {
      fontSize: '16px',
      color: '#4B5563',
      lineHeight: '1.6',
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px',
    },
    loadingText: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginTop: '16px',
      color: '#4B5563',
      animation: 'pulse 2s infinite',
    },
    loadingSpinner: {
      borderRadius: '50%',
      width: '48px',
      height: '48px',
      border: '4px solid rgba(79, 70, 229, 0.1)',
      borderTopColor: '#4F46E5',
      animation: 'spin 1s linear infinite',
      boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)',
    },
    debugPanel: {
      marginTop: '32px',
      padding: '20px',
      borderRadius: '12px',
      backgroundColor: '#1F2937',
      color: '#F3F4F6',
      fontFamily: 'monospace',
      fontSize: '14px',
      whiteSpace: 'pre-wrap',
      overflowX: 'auto',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    },
    debugHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '12px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      paddingBottom: '8px',
    },
    debugTitle: {
      fontWeight: 'bold',
      fontSize: '16px',
      color: '#F3F4F6',
    },
    debugButton: {
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: '#94A3B8',
      transition: 'color 0.2s ease',
      '&:hover': {
        color: 'white',
      },
    },
    utilityButton: {
      color: '#94A3B8',
      marginRight: '12px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      padding: '4px 8px',
      borderRadius: '4px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: 'white',
      },
    },
    toggleButton: {
      color: 'white',
      cursor: 'pointer',
    },
    guessPrompt: {
      flex: 1,
      padding: '16px',
      borderRadius: '12px',
      border: 'none',
      background: 'transparent',
      color: '#94A3B8',
      fontStyle: 'italic',
      textAlign: 'center',
      cursor: 'pointer',
    },
    footer: {
      marginTop: '20px',
      textAlign: 'center',
      color: '#9CA3AF',
      fontSize: '14px',
    },
  }), [isMobile]);
  
  // 使用useCallback优化事件处理函数
  const addLog = useCallback((message, type = 'info') => {
    dispatch({ 
      type: GAME_ACTIONS.ADD_LOG, 
      payload: { message, type } 
    });
    console[type === 'error' ? 'error' : 'log'](`[${new Date().toLocaleTimeString()}] ${message}`);
  }, []);
  
  const generateCityPairs = useCallback((selectedCities) => {
    const pairs = [];
    for (let i = 0; i < selectedCities.length; i++) {
      for (let j = i + 1; j < selectedCities.length; j++) {
        const city1 = selectedCities[i];
        const city2 = selectedCities[j];
        const distance = calculateDirectDistance(city1, city2);
        pairs.push({
          cities: [city1, city2],
          distance: distance
        });
      }
    }
    return pairs;
  }, []);
  
  /**
   * 启动新游戏
   * 初始化游戏状态、随机选择城市、生成城市对
   */
  const startGame = useCallback(() => {
    dispatch({ type: GAME_ACTIONS.INIT_GAME });
    
    try {
      const randomCities = getRandomCities(3);
      console.log('随机选择的城市:', randomCities);
      
      if (!randomCities || randomCities.length < 3) {
        throw new Error('城市数据加载失败');
      }
      
      dispatch({ type: GAME_ACTIONS.SET_CITIES, payload: randomCities });
      
      const pairs = generateCityPairs(randomCities);
      
      if (!pairs || pairs.length === 0) {
        throw new Error('城市对生成失败');
      }
      
      dispatch({ type: GAME_ACTIONS.SET_CITY_PAIRS, payload: pairs });
      dispatch({ type: GAME_ACTIONS.SET_LOADING, payload: false });
      
    } catch (error) {
      console.error('游戏初始化错误:', error);
      addLog(`游戏初始化错误: ${error.message}`, 'error');
      dispatch({ type: GAME_ACTIONS.SET_LOADING, payload: false });
    }
  }, [generateCityPairs, addLog]);
  
  useEffect(() => {
    startGame();
  }, [startGame]);
  
  /**
   * 处理选择最近城市对事件
   * @param {Object} pair - 选中的城市对
   */
  const handleNearestGuess = useCallback((pair) => {
    dispatch({ type: GAME_ACTIONS.SELECT_NEAREST, payload: pair });
  }, []);
  
  /**
   * 处理选择最远城市对事件
   * @param {Object} pair - 选中的城市对
   */
  const handleFarthestGuess = useCallback((pair) => {
    dispatch({ type: GAME_ACTIONS.SELECT_FARTHEST, payload: pair });
  }, []);
  
  // 使用useMemo优化城市对排序
  const sortedCityPairs = useMemo(() => {
    if (!cityPairs.length) return [];
    return [...cityPairs].sort((a, b) => a.distance - b.distance);
  }, [cityPairs]);
  
  // 使用useMemo计算实际的最近和最远城市对
  const actualNearestAndFarthest = useMemo(() => {
    if (!sortedCityPairs.length) return { nearest: null, farthest: null };
    return {
      nearest: sortedCityPairs[0],
      farthest: sortedCityPairs[sortedCityPairs.length - 1]
    };
  }, [sortedCityPairs]);
  
  /**
   * 处理提交猜测事件
   * 验证猜测结果并更新游戏状态
   */
  const handleSubmitGuess = useCallback(() => {
    if (!nearestGuess || !farthestGuess) {
      addLog('请先选择最近和最远的城市对', 'error');
      return;
    }
    
    const { nearest: actualNearest, farthest: actualFarthest } = actualNearestAndFarthest;
    
    dispatch({ 
      type: GAME_ACTIONS.SUBMIT_GUESS, 
      payload: { actualNearest, actualFarthest } 
    });
  }, [nearestGuess, farthestGuess, actualNearestAndFarthest, addLog]);
  
  /**
   * 处理重置游戏事件
   * 清空选择并重新开始游戏
   */
  const handleResetGame = useCallback(() => {
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
      radio.checked = false;
    });
    startGame();
  }, [startGame]);
  
  /**
   * 处理复制日志事件
   * 将日志内容复制到剪贴板
   */
  const handleCopyLogs = useCallback(() => {
    const logsText = logs.map(log => `[${log.timestamp}] ${log.message}`).join('\n');
    navigator.clipboard.writeText(logsText);
    addLog('日志已复制到剪贴板');
  }, [logs, addLog]);
  
  /**
   * 处理切换调试面板显示状态事件
   */
  const handleToggleDebug = useCallback(() => {
    dispatch({ type: GAME_ACTIONS.TOGGLE_DEBUG });
  }, []);
  
  // 使用useMemo优化渲染函数
  const renderLoading = useMemo(() => {
    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px 0'}}>
        <div style={{position: 'relative', width: '40px', height: '40px', marginBottom: '20px'}}>
          <div style={{
            position: 'absolute',
            border: '4px solid rgba(79, 70, 229, 0.1)',
            borderRadius: '50%',
            borderTop: '4px solid #4F46E5',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
        <div style={{color: '#6B7280', fontSize: '18px', animation: 'pulse 1.5s infinite ease-in-out'}}>正在初始化游戏...</div>
      </div>
    );
  }, []);
  
  const renderMap = useMemo(() => {
    if (!cities.length) return null;
    
    const mapStyle = createResponsiveStyle(
      styles.map, 
      { height: '220px' },
      isMobile
    );
    
    return (
      <div style={{...mapStyle, position: 'relative'}}>
        <GameMap 
          cities={cities}
          cityCoordinates={cityCoordinates}
          showLabels={!!gameResult}
        />
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          background: 'rgba(255, 255, 255, 0.8)',
          padding: '6px 10px',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#4B5563',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          pointerEvents: 'none'
        }}>
          <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            可缩放和拖动
          </span>
        </div>
      </div>
    );
  }, [cities, gameResult, isMobile, styles]);
  
  // 使用useMemo优化容器样式以适应移动端
  const containerStyle = useMemo(() => {
    return {
      ...styles.container,
    };
  }, [styles]);
  
  const gameContainerStyle = useMemo(() => {
    return withTransition({
      ...styles.gameContainer,
    });
  }, [styles]);
  
  const cardStyle = useMemo(() => {
    return {
      ...styles.card,
    };
  }, [styles]);
  
  return (
    <div style={containerStyle}>
      <div style={gameContainerStyle}>
        <GameHeader
          isMobile={isMobile}
          styles={styles}
        />
        
        <div style={cardStyle}>
          {isLoading ? (
            renderLoading
          ) : (
            <>
              {renderMap}
              
              {cities.length > 0 && (
                <div style={{
                  ...cardStyle, 
                  padding: isMobile ? '12px' : '20px'
                }}>
                  <GameContent 
                    cityPairs={cityPairs} 
                    nearestGuess={nearestGuess} 
                    farthestGuess={farthestGuess}
                    gameResult={gameResult}
                    handleNearestGuess={handleNearestGuess}
                    handleFarthestGuess={handleFarthestGuess}
                    submitGuess={handleSubmitGuess}
                    resetGame={handleResetGame}
                    styles={styles}
                    isMobile={isMobile}
                  />
                </div>
              )}
              
              <GameResults 
                gameResult={gameResult}
                debugVisible={debugVisible}
                logs={logs}
                setDebugVisible={handleToggleDebug}
                copyLogs={handleCopyLogs}
                styles={styles}
              />
            </>
          )}
        </div>
        
        <div style={styles.footer}>
          © 2023 猜城市距离 - 中国城市地理知识小游戏
        </div>
      </div>
    </div>
  );
}

export default React.memo(CityGame);
