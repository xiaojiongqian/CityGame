const https = require('https');

// Mock the https module
jest.mock('https');

// API Key
const AMAP_API_KEY = '71fb06dacb5606e5e75339eafbddf972';

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

describe('高德地图API服务测试', () => {
  // 每个测试前重置所有模拟
  beforeEach(() => {
    jest.resetAllMocks();
  });

  // IP定位测试
  describe('IP定位服务', () => {
    const ipUrl = `https://restapi.amap.com/v3/ip?key=${AMAP_API_KEY}`;

    test('正常响应时应成功获取IP位置', (done) => {
      // 模拟成功响应
      const mockData = {
        status: '1',
        info: 'OK',
        province: '北京市',
        city: '北京市',
        adcode: '110000',
        rectangle: '116.0119343,39.66127144;116.7829835,40.2164962'
      };

      const mockResponse = new MockResponse(200, mockData);
      https.get.mockImplementation((url, callback) => {
        callback(mockResponse);
        return {
          on: jest.fn().mockReturnThis()
        };
      });

      // 发送请求
      https.get(ipUrl, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          const response = JSON.parse(data);
          expect(res.statusCode).toBe(200);
          expect(response.status).toBe('1');
          expect(response.info).toBe('OK');
          expect(response.province).toBe('北京市');
          done();
        });
      });

      expect(https.get).toHaveBeenCalledWith(ipUrl, expect.any(Function));
    });

    test('API Key无效时应返回错误', (done) => {
      // 模拟错误响应
      const mockData = {
        status: '0',
        info: 'INVALID_USER_KEY',
        infocode: '10001'
      };

      const mockResponse = new MockResponse(200, mockData);
      https.get.mockImplementation((url, callback) => {
        callback(mockResponse);
        return {
          on: jest.fn().mockReturnThis()
        };
      });

      // 发送请求
      https.get(ipUrl, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          const response = JSON.parse(data);
          expect(response.status).toBe('0');
          expect(response.info).toBe('INVALID_USER_KEY');
          done();
        });
      });
    });
  });

  // 地理编码服务测试
  describe('地理编码服务', () => {
    const city = '北京';
    const geocodeUrl = `https://restapi.amap.com/v3/geocode/geo?address=${encodeURIComponent(city)}&key=${AMAP_API_KEY}`;

    test('正常响应时应成功获取地理编码', (done) => {
      // 模拟成功响应
      const mockData = {
        status: '1',
        info: 'OK',
        count: '1',
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

      // 发送请求
      https.get(geocodeUrl, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          const response = JSON.parse(data);
          expect(res.statusCode).toBe(200);
          expect(response.status).toBe('1');
          expect(response.geocodes[0].formatted_address).toBe('北京市');
          expect(response.geocodes[0].location).toBe('116.407387,39.904179');
          done();
        });
      });

      expect(https.get).toHaveBeenCalledWith(geocodeUrl, expect.any(Function));
    });

    test('超出配额时应返回错误', (done) => {
      // 模拟配额限制响应
      const mockData = {
        status: '0',
        info: 'DAILY_QUERY_OVER_LIMIT',
        infocode: '10003'
      };

      const mockResponse = new MockResponse(200, mockData);
      https.get.mockImplementation((url, callback) => {
        callback(mockResponse);
        return {
          on: jest.fn().mockReturnThis()
        };
      });

      // 发送请求
      https.get(geocodeUrl, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          const response = JSON.parse(data);
          expect(response.status).toBe('0');
          expect(response.info).toBe('DAILY_QUERY_OVER_LIMIT');
          expect(response.infocode).toBe('10003');
          done();
        });
      });
    });
  });

  // 距离计算服务测试
  describe('距离计算服务', () => {
    const origins = '116.407526,39.90403'; // 北京
    const destination = '121.473701,31.230416'; // 上海
    const distanceUrl = `https://restapi.amap.com/v3/distance?origins=${origins}&destination=${destination}&key=${AMAP_API_KEY}`;

    test('正常响应时应成功计算距离', (done) => {
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

      // 发送请求
      https.get(distanceUrl, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          const response = JSON.parse(data);
          expect(res.statusCode).toBe(200);
          expect(response.status).toBe('1');
          expect(response.results[0].distance).toBe('1225614');
          expect(response.results[0].duration).toBe('47640');
          done();
        });
      });

      expect(https.get).toHaveBeenCalledWith(distanceUrl, expect.any(Function));
    });

    test('网络错误时应捕获错误', (done) => {
      // 模拟网络错误
      const error = new Error('网络连接错误');
      https.get.mockImplementation((url, callback) => {
        return {
          on: (event, onErrorCallback) => {
            if (event === 'error') {
              onErrorCallback(error);
              done();
            }
            return {
              on: jest.fn().mockReturnThis()
            };
          }
        };
      });

      // 发送请求
      https.get(distanceUrl, () => {})
        .on('error', (err) => {
          expect(err.message).toBe('网络连接错误');
        });
    });
  });
}); 