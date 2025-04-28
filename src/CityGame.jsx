import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import L from 'leaflet';
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

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)',
    width: '100%',
    maxWidth: '650px',
    margin: '0 auto'
  },
  gameContainer: {
    width: '100%',
    maxWidth: '600px',
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
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05), 0 5px 10px rgba(0, 0, 0, 0.03)',
    padding: '16px',
    margin: '0 auto 16px',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(0, 0, 0, 0.05)',
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
    height: '40px',
    lineHeight: '20px'
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

function CityGame() {
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
  
  const addLog = (message, type = 'info') => {
    const now = new Date();
    const timestamp = now.toLocaleTimeString();
    const logEntry = { message, type, timestamp };
    setLogs(prev => [...prev, logEntry]);
    console[type === 'error' ? 'error' : 'log'](`[${timestamp}] ${message}`);
  };
  
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
  
  const startGame = () => {
    setIsLoading(true);
    setGameResult(null);
    setNearestGuess(null);
    setFarthestGuess(null);
    
    try {
      addLog('开始新游戏');
      console.log('开始新游戏');
      
      const randomCities = getRandomCities(3);
      console.log('随机选择的城市:', randomCities);
      
      if (!randomCities || randomCities.length < 3) {
        throw new Error('城市数据加载失败');
      }
      
      setCities(randomCities);
      addLog(`已选择城市: ${randomCities.join(', ')}`);
      
      const pairs = generateCityPairs(randomCities);
      
      if (!pairs || pairs.length === 0) {
        throw new Error('城市对生成失败');
      }
      
      setCityPairs(pairs);
      
      pairs.forEach(pair => {
        const [city1, city2] = pair.cities;
        addLog(`${city1} 到 ${city2} 的距离: ${pair.distance.toFixed(1)} 公里`);
      });
      
      console.log('游戏数据准备完成，结束加载');
      setIsLoading(false);
      
    } catch (error) {
      console.error('游戏初始化错误:', error);
      addLog(`游戏初始化错误: ${error.message}`, 'error');
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    startGame();
  }, []);
  
  const handleMapMessage = (message) => {
    addLog(message);
    console.log('地图消息:', message);
  };
  
  const handleMapError = (error) => {
    addLog(error, 'error');
    console.error('地图错误:', error);
  };
  
  const handleNearestGuess = (pair) => {
    if (gameResult) return;
    setNearestGuess(pair);
  };
  
  const handleFarthestGuess = (pair) => {
    if (gameResult) return;
    setFarthestGuess(pair);
  };
  
  const submitGuess = () => {
    if (!nearestGuess || !farthestGuess) {
      addLog('请先选择最近和最远的城市对', 'error');
      return;
    }
    
    const sortedPairs = [...cityPairs].sort((a, b) => a.distance - b.distance);
    const actualNearest = sortedPairs[0];
    const actualFarthest = sortedPairs[sortedPairs.length - 1];
    
    const nearestCorrect = nearestGuess.cities.every(city => 
      actualNearest.cities.includes(city));
    
    const farthestCorrect = farthestGuess.cities.every(city => 
      actualFarthest.cities.includes(city));
    
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
  
  const resetGame = () => {
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
      radio.checked = false;
    });
    startGame();
  };
  
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
  
  const copyLogs = () => {
    const logsText = logs.map(log => `[${log.timestamp}] ${log.message}`).join('\n');
    navigator.clipboard.writeText(logsText);
    addLog('日志已复制到剪贴板');
  };
  
  const renderLoading = () => {
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
  };
  
  const renderMap = () => {
    if (!cities.length) return null;
    
    return (
      <div style={{...styles.map, position: 'relative', height: isMobile ? '220px' : styles.map.height}}>
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
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.gameContainer}>
        <GameHeader
          isMobile={isMobile}
          styles={styles}
        />
        
        <div style={styles.card}>
          {isLoading ? (
            renderLoading()
          ) : (
            <>
              {renderMap()}
              
              <GameContent
                cityPairs={cityPairs}
                nearestGuess={nearestGuess}
                farthestGuess={farthestGuess}
                gameResult={gameResult}
                handleNearestGuess={handleNearestGuess}
                handleFarthestGuess={handleFarthestGuess}
                submitGuess={submitGuess}
                resetGame={resetGame}
                styles={styles}
                isMobile={isMobile}
              />
              
              <GameResults
                gameResult={gameResult}
                debugVisible={debugVisible}
                logs={logs}
                setDebugVisible={setDebugVisible}
                copyLogs={copyLogs}
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

export default CityGame;
