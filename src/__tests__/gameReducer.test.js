import { gameReducer, initialGameState, ACTIONS } from '../reducers/gameReducer';

describe('游戏状态Reducer测试', () => {
  describe('游戏初始化相关操作', () => {
    it('应该正确处理START_GAME动作', () => {
      const initialState = {
        ...initialGameState,
        isLoading: false,
        gameResult: { success: true },
        nearestGuess: { cities: ['北京', '上海'] },
        farthestGuess: { cities: ['广州', '哈尔滨'] }
      };
      
      const action = { type: ACTIONS.START_GAME };
      const newState = gameReducer(initialState, action);
      
      expect(newState.isLoading).toBe(true);
      expect(newState.gameResult).toBeNull();
      expect(newState.nearestGuess).toBeNull();
      expect(newState.farthestGuess).toBeNull();
    });
    
    it('应该正确处理SET_CITIES动作', () => {
      const cities = ['北京', '上海', '广州'];
      const action = { type: ACTIONS.SET_CITIES, payload: cities };
      const newState = gameReducer(initialGameState, action);
      
      expect(newState.cities).toEqual(cities);
    });
    
    it('应该正确处理SET_CITY_PAIRS动作', () => {
      const cityPairs = [
        { cities: ['北京', '上海'], distance: 1000 },
        { cities: ['北京', '广州'], distance: 2000 },
        { cities: ['上海', '广州'], distance: 1500 }
      ];
      const action = { type: ACTIONS.SET_CITY_PAIRS, payload: cityPairs };
      const newState = gameReducer(initialGameState, action);
      
      expect(newState.cityPairs).toEqual(cityPairs);
    });
  });
  
  describe('游戏猜测相关操作', () => {
    it('应该正确处理SET_NEAREST_GUESS动作', () => {
      const nearestGuess = { cities: ['北京', '上海'], distance: 1000 };
      const action = { type: ACTIONS.SET_NEAREST_GUESS, payload: nearestGuess };
      const newState = gameReducer(initialGameState, action);
      
      expect(newState.nearestGuess).toEqual(nearestGuess);
    });
    
    it('应该正确处理SET_FARTHEST_GUESS动作', () => {
      const farthestGuess = { cities: ['北京', '广州'], distance: 2000 };
      const action = { type: ACTIONS.SET_FARTHEST_GUESS, payload: farthestGuess };
      const newState = gameReducer(initialGameState, action);
      
      expect(newState.farthestGuess).toEqual(farthestGuess);
    });
    
    it('应该正确处理SUBMIT_GUESS动作', () => {
      const initialState = {
        ...initialGameState,
        cityPairs: [
          { cities: ['北京', '上海'], distance: 1000 },
          { cities: ['北京', '广州'], distance: 2000 },
          { cities: ['上海', '广州'], distance: 1500 }
        ],
        nearestGuess: { cities: ['北京', '上海'], distance: 1000 },
        farthestGuess: { cities: ['北京', '广州'], distance: 2000 }
      };
      
      const action = { type: ACTIONS.SUBMIT_GUESS };
      const newState = gameReducer(initialState, action);
      
      expect(newState.gameResult).toBeDefined();
      expect(newState.gameResult.success).toBe(true);
      expect(newState.gameResult.nearestCorrect).toBe(true);
      expect(newState.gameResult.farthestCorrect).toBe(true);
      expect(newState.gameResult.actualNearest).toEqual(initialState.cityPairs[0]);
      expect(newState.gameResult.actualFarthest).toEqual(initialState.cityPairs[1]);
    });
    
    it('应该正确处理错误猜测的SUBMIT_GUESS动作', () => {
      const initialState = {
        ...initialGameState,
        cityPairs: [
          { cities: ['北京', '上海'], distance: 1000 },
          { cities: ['北京', '广州'], distance: 2000 },
          { cities: ['上海', '广州'], distance: 1500 }
        ],
        nearestGuess: { cities: ['上海', '广州'], distance: 1500 }, // 错误的最近猜测
        farthestGuess: { cities: ['上海', '广州'], distance: 1500 }  // 错误的最远猜测
      };
      
      const action = { type: ACTIONS.SUBMIT_GUESS };
      const newState = gameReducer(initialState, action);
      
      expect(newState.gameResult).toBeDefined();
      expect(newState.gameResult.success).toBe(false);
      expect(newState.gameResult.nearestCorrect).toBe(false);
      expect(newState.gameResult.farthestCorrect).toBe(false);
    });
  });
  
  describe('其他操作', () => {
    it('应该正确处理RESET_GAME动作', () => {
      const initialState = {
        ...initialGameState,
        isLoading: false,
        gameResult: { success: true },
        nearestGuess: { cities: ['北京', '上海'] },
        farthestGuess: { cities: ['广州', '哈尔滨'] }
      };
      
      const action = { type: ACTIONS.RESET_GAME };
      const newState = gameReducer(initialState, action);
      
      expect(newState.isLoading).toBe(true);
      expect(newState.gameResult).toBeNull();
      expect(newState.nearestGuess).toBeNull();
      expect(newState.farthestGuess).toBeNull();
    });
    
    it('应该正确处理ADD_LOG动作', () => {
      const message = '测试日志';
      const type = 'info';
      const action = { type: ACTIONS.ADD_LOG, payload: { message, type } };
      const newState = gameReducer(initialGameState, action);
      
      expect(newState.logs.length).toBe(1);
      expect(newState.logs[0].message).toBe(message);
      expect(newState.logs[0].type).toBe(type);
      expect(newState.logs[0].timestamp).toBeDefined();
    });
    
    it('应该正确处理SET_LOADING动作', () => {
      const action = { type: ACTIONS.SET_LOADING, payload: false };
      const newState = gameReducer(initialGameState, action);
      
      expect(newState.isLoading).toBe(false);
    });
    
    it('应该正确处理TOGGLE_DEBUG动作', () => {
      const initialState = {
        ...initialGameState,
        debugVisible: false
      };
      
      const action = { type: ACTIONS.TOGGLE_DEBUG };
      const newState = gameReducer(initialState, action);
      
      expect(newState.debugVisible).toBe(true);
      
      // 再次切换
      const newState2 = gameReducer(newState, action);
      expect(newState2.debugVisible).toBe(false);
    });
    
    it('应该在未知动作时返回原状态', () => {
      const action = { type: 'UNKNOWN_ACTION' };
      const newState = gameReducer(initialGameState, action);
      
      expect(newState).toEqual(initialGameState);
    });
  });
}); 