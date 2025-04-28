/**
 * 游戏状态管理的reducer
 */

// 定义初始状态
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

// 定义action类型
export const ACTIONS = {
  START_GAME: 'START_GAME',
  SET_CITIES: 'SET_CITIES',
  SET_CITY_PAIRS: 'SET_CITY_PAIRS',
  SET_NEAREST_GUESS: 'SET_NEAREST_GUESS',
  SET_FARTHEST_GUESS: 'SET_FARTHEST_GUESS',
  SUBMIT_GUESS: 'SUBMIT_GUESS',
  RESET_GAME: 'RESET_GAME',
  ADD_LOG: 'ADD_LOG',
  SET_LOADING: 'SET_LOADING',
  TOGGLE_DEBUG: 'TOGGLE_DEBUG'
};

/**
 * 游戏状态的reducer函数
 * @param {Object} state - 当前状态
 * @param {Object} action - 分发的动作
 * @returns {Object} 新的状态
 */
export function gameReducer(state, action) {
  switch (action.type) {
    case ACTIONS.START_GAME:
      return {
        ...state,
        isLoading: true,
        gameResult: null,
        nearestGuess: null,
        farthestGuess: null
      };
      
    case ACTIONS.SET_CITIES:
      return {
        ...state,
        cities: action.payload
      };
      
    case ACTIONS.SET_CITY_PAIRS:
      return {
        ...state,
        cityPairs: action.payload
      };
      
    case ACTIONS.SET_NEAREST_GUESS:
      return {
        ...state,
        nearestGuess: action.payload
      };
      
    case ACTIONS.SET_FARTHEST_GUESS:
      return {
        ...state,
        farthestGuess: action.payload
      };
      
    case ACTIONS.SUBMIT_GUESS: {
      // 按距离排序城市对
      const sortedPairs = [...state.cityPairs].sort((a, b) => a.distance - b.distance);
      const actualNearest = sortedPairs[0];
      const actualFarthest = sortedPairs[sortedPairs.length - 1];
      
      // 检查猜测是否正确
      const nearestCorrect = state.nearestGuess.cities.every(city => 
        actualNearest.cities.includes(city));
      
      const farthestCorrect = state.farthestGuess.cities.every(city => 
        actualFarthest.cities.includes(city));
      
      // 设置游戏结果
      const gameResult = {
        success: nearestCorrect && farthestCorrect,
        nearestCorrect,
        farthestCorrect,
        actualNearest,
        actualFarthest
      };
      
      return {
        ...state,
        gameResult
      };
    }
    
    case ACTIONS.RESET_GAME:
      return {
        ...state,
        isLoading: true,
        gameResult: null,
        nearestGuess: null,
        farthestGuess: null
      };
      
    case ACTIONS.ADD_LOG: {
      const { message, type = 'info' } = action.payload;
      const now = new Date();
      const timestamp = now.toLocaleTimeString();
      const logEntry = { message, type, timestamp };
      
      return {
        ...state,
        logs: [...state.logs, logEntry]
      };
    }
    
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
      
    case ACTIONS.TOGGLE_DEBUG:
      return {
        ...state,
        debugVisible: !state.debugVisible
      };
      
    default:
      return state;
  }
} 