const mapServices = require('../services/mapServices');
const https = require('https');

// Mock the https module
jest.mock('https');

// 创建一个模拟响应类
class MockResponse {
  constructor(statusCode, data) {
    this.statusCode = statusCode;
    this.data = JSON.stringify(data);
  }

  on(event, callback) {
    if (event === 'data') {
      callback(this.data);
    }
    if (event === 'end') {
      callback();
    }
    return this;
  }
}

describe('地图服务模块测试', () => {
  // 每个测试前重置所有模拟
  beforeEach(() => {
    jest.resetAllMocks();
  });

  // IP定位测试
  describe('getIpLocation', () => {
    test('应正确获取IP位置信息', async () => {
      // 模拟成功响应
      const mockData = {
        status: '1',
        info: 'OK',
        province: '北京市',
        city: '北京市'
      };

      const mockResponse = new MockResponse(200, mockData);
      https.get.mockImplementation((url, callback) => {
        callback(mockResponse);
        return {
          on: jest.fn().mockReturnThis()
        };
      });

      const result = await mapServices.getIpLocation();
      expect(result).toEqual(mockData);
      expect(https.get).toHaveBeenCalledWith(
        expect.stringContaining('https://restapi.amap.com/v3/ip'),
        expect.any(Function)
      );
    });

    test('API返回错误状态时应抛出异常', async () => {
      // 模拟错误响应
      const mockData = {
        status: '0',
        info: 'INVALID_USER_KEY'
      };

      const mockResponse = new MockResponse(200, mockData);
      https.get.mockImplementation((url, callback) => {
        callback(mockResponse);
        return {
          on: jest.fn().mockReturnThis()
        };
      });

      await expect(mapServices.getIpLocation()).rejects.toThrow('API请求失败');
    });

    test('网络错误时应抛出异常', async () => {
      // 模拟网络错误
      https.get.mockImplementation((url, callback) => {
        return {
          on: (event, onErrorCallback) => {
            if (event === 'error') {
              onErrorCallback(new Error('网络连接错误'));
            }
            return {
              on: jest.fn().mockReturnThis()
            };
          }
        };
      });

      await expect(mapServices.getIpLocation()).rejects.toThrow('请求失败');
    });
  });

  // 地理编码测试
  describe('getGeocode', () => {
    test('应正确获取地理编码信息', async () => {
      // 模拟成功响应
      const mockData = {
        status: '1',
        info: 'OK',
        geocodes: [
          {
            formatted_address: '北京市',
            location: '116.407387,39.904179'
          }
        ]
      };

      const mockResponse = new MockResponse(200, mockData);
      https.get.mockImplementation((url, callback) => {
        callback(mockResponse);
        return {
          on: jest.fn().mockReturnThis()
        };
      });

      const result = await mapServices.getGeocode('北京');
      expect(result).toEqual(mockData);
      expect(https.get).toHaveBeenCalledWith(
        expect.stringContaining('https://restapi.amap.com/v3/geocode/geo'),
        expect.any(Function)
      );
    });
  });

  // 距离计算测试
  describe('calculateDistance', () => {
    test('应正确计算两点间的距离', async () => {
      // 模拟成功响应
      const mockData = {
        status: '1',
        info: 'OK',
        results: [
          {
            distance: '1225614',
            duration: '47640'
          }
        ]
      };

      const mockResponse = new MockResponse(200, mockData);
      https.get.mockImplementation((url, callback) => {
        callback(mockResponse);
        return {
          on: jest.fn().mockReturnThis()
        };
      });

      const origins = '116.407526,39.90403'; // 北京
      const destination = '121.473701,31.230416'; // 上海
      
      const result = await mapServices.calculateDistance(origins, destination);
      expect(result).toEqual(mockData);
      expect(https.get).toHaveBeenCalledWith(
        expect.stringContaining('https://restapi.amap.com/v3/distance'),
        expect.any(Function)
      );
    });
  });

  // 格式化函数测试
  describe('格式化函数', () => {
    test('formatDistance应正确格式化距离', () => {
      expect(mapServices.formatDistance(500)).toBe('500米');
      expect(mapServices.formatDistance(1500)).toBe('1.5公里');
      expect(mapServices.formatDistance(10000)).toBe('10.0公里');
    });

    test('formatDuration应正确格式化时间', () => {
      expect(mapServices.formatDuration(300)).toBe('5分钟');
      expect(mapServices.formatDuration(3600)).toBe('1小时');
      expect(mapServices.formatDuration(5400)).toBe('1小时30分钟');
    });
  });

  // API Key检查测试
  describe('checkApiKeyValid', () => {
    test('API Key有效时应返回true', async () => {
      // 模拟成功响应
      const mockData = {
        status: '1',
        info: 'OK'
      };

      const mockResponse = new MockResponse(200, mockData);
      https.get.mockImplementation((url, callback) => {
        callback(mockResponse);
        return {
          on: jest.fn().mockReturnThis()
        };
      });

      const result = await mapServices.checkApiKeyValid();
      expect(result).toBe(true);
    });

    test('API Key无效时应返回false', async () => {
      // 模拟错误响应
      const mockData = {
        status: '0',
        info: 'INVALID_USER_KEY'
      };

      const mockResponse = new MockResponse(200, mockData);
      https.get.mockImplementation((url, callback) => {
        callback(mockResponse);
        return {
          on: jest.fn().mockReturnThis()
        };
      });

      // 捕获控制台错误
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const result = await mapServices.checkApiKeyValid();
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });
}); 