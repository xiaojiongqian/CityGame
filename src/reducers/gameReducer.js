/**
 * 游戏状态管理的reducer
 * 
 * 该reducer处理城市游戏的所有状态变化，包括：
 * - 游戏初始化和重置
 * - 加载状态管理
 * - 城市数据处理
 * - 玩家猜测处理
 * - 游戏结果计算
 */

// 定义action类型
export const GAME_ACTIONS = {
  INIT_GAME: 'INIT_GAME',
  SET_LOADING: 'SET_LOADING',
  SET_CITIES: 'SET_CITIES',
  SET_CITY_PAIRS: 'SET_CITY_PAIRS',
  SELECT_NEAREST: 'SELECT_NEAREST',
  SELECT_FARTHEST: 'SELECT_FARTHEST', 
  SUBMIT_GUESS: 'SUBMIT_GUESS',
  RESET_GAME: 'RESET_GAME',
  ADD_LOG: 'ADD_LOG',
  TOGGLE_DEBUG: 'TOGGLE_DEBUG'
};

// 初始状态
export const initialGameState = {
  cities: [],
  cityPairs: [],
  nearestGuess: null,
  farthestGuess: null,
  gameResult: null,
  isLoading: true,
  logs: [],
  debugVisible: false
};

/**
 * 游戏状态reducer函数
 * @param {Object} state - 当前状态
 * @param {Object} action - 分发的action
 * @returns {Object} 新状态
 */
export const gameReducer = (state, action) => {
  switch (action.type) {
    case GAME_ACTIONS.INIT_GAME:
      return {
        ...initialGameState,
        isLoading: true,
        logs: [...state.logs, {
          message: '开始新游戏',
          type: 'info',
          timestamp: new Date().toLocaleTimeString()
        }]
      };
      
    case GAME_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
      
    case GAME_ACTIONS.SET_CITIES:
      return {
        ...state,
        cities: action.payload,
        logs: [...state.logs, {
          message: `已选择城市: ${action.payload.join(', ')}`,
          type: 'info',
          timestamp: new Date().toLocaleTimeString()
        }]
      };
      
    case GAME_ACTIONS.SET_CITY_PAIRS:
      return {
        ...state,
        cityPairs: action.payload,
        logs: [...state.logs, ...action.payload.map(pair => ({
          message: `${pair.cities[0]} 到 ${pair.cities[1]} 的距离: ${pair.distance.toFixed(1)} 公里`,
          type: 'info',
          timestamp: new Date().toLocaleTimeString()
        }))]
      };
      
    case GAME_ACTIONS.SELECT_NEAREST:
      // 只有在游戏结果未出时才允许选择
      if (state.gameResult) return state;
      return {
        ...state,
        nearestGuess: action.payload
      };
      
    case GAME_ACTIONS.SELECT_FARTHEST:
      // 只有在游戏结果未出时才允许选择
      if (state.gameResult) return state;
      return {
        ...state,
        farthestGuess: action.payload
      };
      
    case GAME_ACTIONS.SUBMIT_GUESS: {
      // 需要有最近和最远的猜测才能提交
      if (!state.nearestGuess || !state.farthestGuess) {
        return {
          ...state,
          logs: [...state.logs, {
            message: '请先选择最近和最远的城市对',
            type: 'error',
            timestamp: new Date().toLocaleTimeString()
          }]
        };
      }
      
      const { actualNearest, actualFarthest } = action.payload;
      const nearestCorrect = state.nearestGuess.cities.every(city => 
        actualNearest.cities.includes(city));
      const farthestCorrect = state.farthestGuess.cities.every(city => 
        actualFarthest.cities.includes(city));
        
      const gameResult = {
        success: nearestCorrect && farthestCorrect,
        nearestCorrect,
        farthestCorrect,
        actualNearest,
        actualFarthest
      };
      
      // 创建新日志
      let newLogs = [...state.logs, {
        message: `猜测结果: ${nearestCorrect && farthestCorrect ? '全部正确' : '有错误'}`,
        type: 'info',
        timestamp: new Date().toLocaleTimeString()
      }];
      
      // 添加错误日志
      if (!nearestCorrect) {
        newLogs.push({
          message: `最近的城市对应为: ${actualNearest.cities.join(' 和 ')} (${actualNearest.distance.toFixed(1)} 公里)`,
          type: 'info',
          timestamp: new Date().toLocaleTimeString()
        });
      }
      
      if (!farthestCorrect) {
        newLogs.push({
          message: `最远的城市对应为: ${actualFarthest.cities.join(' 和 ')} (${actualFarthest.distance.toFixed(1)} 公里)`,
          type: 'info',
          timestamp: new Date().toLocaleTimeString()
        });
      }
      
      return {
        ...state,
        gameResult,
        logs: newLogs
      };
    }
      
    case GAME_ACTIONS.RESET_GAME:
      return {
        ...initialGameState,
        debugVisible: state.debugVisible,
        logs: [...state.logs, {
          message: '重置游戏',
          type: 'info',
          timestamp: new Date().toLocaleTimeString()
        }]
      };
      
    case GAME_ACTIONS.ADD_LOG: {
      const { message, type = 'info' } = action.payload;
      const now = new Date();
      const timestamp = now.toLocaleTimeString();
      
      return {
        ...state,
        logs: [...state.logs, { message, type, timestamp }]
      };
    }
      
    case GAME_ACTIONS.TOGGLE_DEBUG:
      return {
        ...state,
        debugVisible: !state.debugVisible
      };
      
    default:
      return state;
  }
}; 