import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 导入服务和组件
import { 
  getRandomCities, 
  calculateDirectDistance,
  cityCoordinates
} from './services/cityData';
import GameMap from './components/GameMap';

// 样式
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)',
  },
  gameContainer: {
    maxWidth: '800px',
    width: '100%',
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
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05), 0 5px 10px rgba(0, 0, 0, 0.03)',
    padding: '28px',
    margin: '0 0 24px 0',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(0, 0, 0, 0.05)',
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
    padding: '14px 28px',
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
    marginBottom: '28px',
    background: '#f2f8fc',
    position: 'relative',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(0, 0, 0, 0.05)',
  },
  cityPairsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '28px',
  },
  cityPair: {
    padding: '16px 20px',
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
  copyButton: {
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
  // 猜测提示样式（非按钮风格）
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
};

// 主游戏组件
function CityGame() {
  // 响应式检测
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [cities, setCities] = useState([]);
  const [cityPairs, setCityPairs] = useState([]);
  const [logs, setLogs] = useState([]);
  const [debugVisible, setDebugVisible] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [nearestGuess, setNearestGuess] = useState(null);
  const [farthestGuess, setFarthestGuess] = useState(null);
  
  // 添加日志
  const addLog = (message, type = 'info') => {
    const now = new Date();
    const timestamp = now.toLocaleTimeString();
    const logEntry = { message, type, timestamp };
    setLogs(prev => [...prev, logEntry]);
    console[type === 'error' ? 'error' : 'log'](`[${timestamp}] ${message}`);
  };
  
  // 生成城市对
  const generateCityPairs = (selectedCities) => {
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
  };
  
  // 开始游戏
  const startGame = () => {
    setIsLoading(true);
    setGameResult(null);
    setNearestGuess(null);
    setFarthestGuess(null);
    
    try {
      addLog('开始新游戏');
      console.log('开始新游戏');
      
      // 从城市数据中获取三个随机城市
      const randomCities = getRandomCities(3);
      console.log('随机选择的城市:', randomCities);
      
      if (!randomCities || randomCities.length < 3) {
        throw new Error('城市数据加载失败');
      }
      
      setCities(randomCities);
      addLog(`已选择城市: ${randomCities.join(', ')}`);
      
      // 生成所有可能的城市对并计算距离
      const pairs = generateCityPairs(randomCities);
      
      if (!pairs || pairs.length === 0) {
        throw new Error('城市对生成失败');
      }
      
      setCityPairs(pairs);
      
      // 记录每个城市对的距离
      pairs.forEach(pair => {
        const [city1, city2] = pair.cities;
        addLog(`${city1} 到 ${city2} 的距离: ${pair.distance.toFixed(1)} 公里`);
      });
      
      // 直接设置加载完成，不依赖地图回调
      console.log('游戏数据准备完成，结束加载');
      setIsLoading(false);
      
    } catch (error) {
      console.error('游戏初始化错误:', error);
      addLog(`游戏初始化错误: ${error.message}`, 'error');
      setIsLoading(false);
    }
  };
  
  // 自动开始游戏
  useEffect(() => {
    startGame();
  }, []);
  
  // 处理地图加载消息 (不再控制加载状态)
  const handleMapMessage = (message) => {
    addLog(message);
    console.log('地图消息:', message);
  };
  
  // 处理地图错误 (不再控制加载状态)
  const handleMapError = (error) => {
    addLog(error, 'error');
    console.error('地图错误:', error);
  };
  
  // 处理猜测最近的一对城市
  const handleNearestGuess = (pair) => {
    if (gameResult) return;
    setNearestGuess(pair);
  };
  
  // 处理猜测最远的一对城市
  const handleFarthestGuess = (pair) => {
    if (gameResult) return;
    setFarthestGuess(pair);
  };
  
  // 提交猜测
  const submitGuess = () => {
    if (!nearestGuess || !farthestGuess) {
      addLog('请先选择最近和最远的城市对', 'error');
      return;
    }
    
    // 按距离排序城市对
    const sortedPairs = [...cityPairs].sort((a, b) => a.distance - b.distance);
    const actualNearest = sortedPairs[0];
    const actualFarthest = sortedPairs[sortedPairs.length - 1];
    
    const nearestCorrect = nearestGuess.cities.every(city => 
      actualNearest.cities.includes(city));
    
    const farthestCorrect = farthestGuess.cities.every(city => 
      actualFarthest.cities.includes(city));
    
    // 设置游戏结果
    setGameResult({
      success: nearestCorrect && farthestCorrect,
      nearestCorrect,
      farthestCorrect,
      actualNearest,
      actualFarthest
    });
    
    addLog(`猜测结果: ${nearestCorrect && farthestCorrect ? '全部正确' : '有错误'}`);
    if (!nearestCorrect) {
      addLog(`最近的城市对应为: ${actualNearest.cities.join(' 和 ')} (${actualNearest.distance.toFixed(1)} 公里)`);
    }
    if (!farthestCorrect) {
      addLog(`最远的城市对应为: ${actualFarthest.cities.join(' 和 ')} (${actualFarthest.distance.toFixed(1)} 公里)`);
    }
  };
  
  // 重新开始游戏
  const resetGame = () => {
    startGame();
  };
  
  // 获取城市对状态类
  const getCityPairClassName = (pair) => {
    const isNearest = nearestGuess && pair.cities.every(city => nearestGuess.cities.includes(city));
    const isFarthest = farthestGuess && pair.cities.every(city => farthestGuess.cities.includes(city));
    
    if (!isNearest && !isFarthest) {
      return styles.cityPair;
    }
    
    if (gameResult) {
      if (isNearest) {
        return gameResult.nearestCorrect 
          ? {...styles.cityPair, ...styles.cityPairCorrect} 
          : {...styles.cityPair, ...styles.cityPairIncorrect};
      }
      if (isFarthest) {
        return gameResult.farthestCorrect 
          ? {...styles.cityPair, ...styles.cityPairCorrect} 
          : {...styles.cityPair, ...styles.cityPairIncorrect};
      }
    }
    
    return {...styles.cityPair, ...styles.cityPairSelected};
  };
  
  // 复制日志到剪贴板
  const copyLogs = () => {
    const logsText = logs.map(log => `[${log.timestamp}] ${log.message}`).join('\n');
    navigator.clipboard.writeText(logsText);
    addLog('日志已复制到剪贴板');
  };
  
  // 渲染猜测状态
  const renderGuesses = () => {
    return (
      <div style={styles.guessContainer}>
        <div style={
          nearestGuess
            ? {...styles.guessBox, ...styles.guessBoxFilled}
            : styles.guessPrompt
        }>
          <div style={styles.guessType}>
            <MapPin size={18} style={{marginRight: '6px', display: 'inline'}} />
            最近的城市对
          </div>
          <div style={styles.guessValue}>
            {nearestGuess ? nearestGuess.cities.join(' - ') : '请选择'}
          </div>
        </div>
        <div style={
          farthestGuess
            ? {...styles.guessBox, ...styles.guessBoxFilled}
            : styles.guessPrompt
        }>
          <div style={styles.guessType}>
            <Navigation size={18} style={{marginRight: '6px', display: 'inline'}} />
            最远的城市对
          </div>
          <div style={styles.guessValue}>
            {farthestGuess ? farthestGuess.cities.join(' - ') : '请选择'}
          </div>
        </div>
      </div>
    );
  };
  
  // 渲染加载状态
  const renderLoading = () => {
    if (!isLoading) return null;
    
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner} />
        <div style={styles.loadingText}>正在准备城市数据...</div>
      </div>
    );
  };
  
  // 渲染结果
  const renderResult = () => {
    if (!gameResult) return null;
    
    return (
      <div style={{
        ...styles.resultContainer, 
        ...(gameResult.success ? styles.resultSuccess : styles.resultError)
      }}>
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
  };
  
  // 渲染城市对
  const renderCityPairs = () => {
    return (
      <div style={{
        ...styles.cityPairsContainer,
        flexDirection: isMobile ? 'row' : styles.cityPairsContainer.flexDirection,
        overflowX: isMobile ? 'auto' : 'visible',
      }}>
        {cityPairs.map((pair, index) => {
          const isNearest = nearestGuess && pair.cities.every(city => nearestGuess.cities.includes(city));
          const isFarthest = farthestGuess && pair.cities.every(city => farthestGuess.cities.includes(city));
          
          let pairStyle = {...styles.cityPair};
          
          if (isNearest || isFarthest) {
            pairStyle = {...pairStyle, ...styles.cityPairSelected};
          }
          
          if (gameResult) {
            if (isNearest) {
              pairStyle = gameResult.nearestCorrect 
                ? {...pairStyle, ...styles.cityPairCorrect} 
                : {...pairStyle, ...styles.cityPairIncorrect};
            }
            if (isFarthest) {
              pairStyle = gameResult.farthestCorrect 
                ? {...pairStyle, ...styles.cityPairCorrect} 
                : {...pairStyle, ...styles.cityPairIncorrect};
            }
          }
          
          return (
            <div 
              key={index}
              style={pairStyle}
              onClick={() => {
                if (gameResult) return;
                // 双击处理逻辑
                if (isNearest) {
                  setNearestGuess(null);
                } else if (isFarthest) {
                  setFarthestGuess(null);
                } else if (!nearestGuess) {
                  handleNearestGuess(pair);
                } else if (!farthestGuess) {
                  handleFarthestGuess(pair);
                }
              }}
              className="city-pair-card"
            >
              <div style={styles.cityPairNames}>
                <MapPin size={20} style={{marginRight: '8px', color: '#4F46E5'}} />
                <span>{pair.cities.join(' - ')}</span>
                {(isNearest || isFarthest) && (
                  <span style={{
                    display: 'inline-block',
                    marginLeft: '10px',
                    padding: '3px 8px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: isNearest ? 'rgba(79, 70, 229, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: isNearest ? '#4F46E5' : '#EF4444'
                  }}>
                    {isNearest ? '最近' : '最远'}
                  </span>
                )}
              </div>
              {gameResult && (
                <div style={styles.cityPairDistance}>
                  {pair.distance.toFixed(1)} 公里
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  
  // 渲染调试面板
  const renderDebugPanel = () => {
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
  };
  
  // 渲染地图
  const renderMap = () => {
    if (!cities.length) return null;
    
    return (
      <div style={{...styles.map, position: 'relative', height: isMobile ? '220px' : styles.map.height}}>
        <GameMap 
          cities={cities}
          cityCoordinates={cityCoordinates}
          showLabels={!!gameResult}
        />
      </div>
    );
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.gameContainer}>
        
        <div style={styles.card}>
          {isLoading ? (
            renderLoading()
          ) : (
            <>
              {renderMap()}
              
              {renderCityPairs()}
              {renderGuesses()}
              {renderResult()}
              
              <div style={styles.buttonContainer}>
                {!gameResult ? (
                  <button 
                    style={{
                      ...styles.button, 
                      width: isMobile ? '100%' : 'auto',
                      ...(!nearestGuess || !farthestGuess ? styles.buttonDisabled : {})
                    }}
                    onClick={submitGuess}
                    disabled={!nearestGuess || !farthestGuess}
                    onMouseEnter={(e) => {
                      if (nearestGuess && farthestGuess) {
                        e.target.style.backgroundColor = styles.buttonHover.backgroundColor;
                        e.target.style.transform = styles.buttonHover.transform;
                        e.target.style.boxShadow = styles.buttonHover.boxShadow;
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = styles.button.boxShadow;
                    }}
                  >
                    提交猜测
                  </button>
                ) : (
                  <button 
                    style={{...styles.button, width: isMobile ? '100%' : 'auto'}}
                    onClick={resetGame}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = styles.buttonHover.backgroundColor;
                      e.target.style.transform = styles.buttonHover.transform;
                      e.target.style.boxShadow = styles.buttonHover.boxShadow;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = styles.button.boxShadow;
                    }}
                  >
                    再玩一次
                  </button>
                )}
              </div>
            </>
          )}
        </div>
        
        <button 
          style={styles.debugButton}
          onClick={() => setDebugVisible(!debugVisible)}
        >
          <div style={{color: '#94A3B8', fontSize: '14px'}}>
            {debugVisible ? '隐藏调试信息' : '显示调试信息'}
          </div>
        </button>
        
        {renderDebugPanel()}
        
        <div style={styles.footer}>
          © 2023 猜城市距离 - 中国城市地理知识小游戏
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        body {
          margin: 0;
          padding: 0;
          background-color: #F3F4F6;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        
        .city-tooltip {
          background-color: #4F46E5;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
          font-weight: bold;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          white-space: nowrap;
          z-index: 1000;
        }
        
        /* 防止地图元素溢出 */
        .leaflet-container {
          z-index: 1;
          border-radius: 16px;
        }
        
        /* 禁用不需要的交互元素 */
        .leaflet-control-container {
          display: none;
        }
        
        /* 城市对卡片悬停动画 */
        .city-pair-hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: all 0.2s ease;
        }
        
        /* 按钮波纹效果 */
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default CityGame; 
