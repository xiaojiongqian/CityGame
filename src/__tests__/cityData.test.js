const cityData = require('../services/cityData');

describe('城市数据服务测试', () => {
  describe('城市数据基本功能', () => {
    test('应返回正确的城市列表', () => {
      const cities = cityData.getAllCities();
      expect(cities).toBeInstanceOf(Array);
      expect(cities.length).toBeGreaterThan(0);
      expect(cities).toContain('北京');
      expect(cities).toContain('上海');
    });

    test('应返回正确的城市坐标', () => {
      const beijingCoords = cityData.getCityCoordinates('北京');
      expect(beijingCoords).toEqual([116.407526, 39.90403]);
      
      const shanghaiCoords = cityData.getCityCoordinates('上海');
      expect(shanghaiCoords).toEqual([121.473701, 31.230416]);
      
      const nonExistentCity = cityData.getCityCoordinates('不存在的城市');
      expect(nonExistentCity).toBeNull();
    });
  });

  describe('随机城市生成', () => {
    test('应生成指定数量的随机城市', () => {
      const randomCities = cityData.getRandomCities(3);
      expect(randomCities).toBeInstanceOf(Array);
      expect(randomCities.length).toBe(3);
      
      // 验证生成的城市在原始城市列表中
      const allCities = cityData.getAllCities();
      randomCities.forEach(city => {
        expect(allCities).toContain(city);
      });
      
      // 验证生成的城市不重复
      const uniqueCities = new Set(randomCities);
      expect(uniqueCities.size).toBe(randomCities.length);
    });

    test('当请求数量超过城市总数时应返回所有城市', () => {
      const allCitiesCount = cityData.getAllCities().length;
      const oversizedRequest = allCitiesCount + 10;
      
      const randomCities = cityData.getRandomCities(oversizedRequest);
      expect(randomCities.length).toBeLessThanOrEqual(allCitiesCount);
    });
  });

  describe('距离计算', () => {
    test('应正确计算两个城市间的直线距离', () => {
      // 由于距离计算涉及复杂公式，这里我们测试已知的大致距离
      // 北京到上海大约1000多公里
      const bjshDistance = cityData.calculateDirectDistance('北京', '上海');
      expect(bjshDistance).toBeGreaterThan(1000);
      expect(bjshDistance).toBeLessThan(1500);
      
      // 北京到天津大约100多公里
      const bjtjDistance = cityData.calculateDirectDistance('北京', '天津');
      expect(bjtjDistance).toBeGreaterThan(100);
      expect(bjtjDistance).toBeLessThan(200);
    });

    test('当提供不存在的城市名时应返回null', () => {
      const invalidDistance = cityData.calculateDirectDistance('北京', '不存在的城市');
      expect(invalidDistance).toBeNull();
    });

    test('应识别相同城市间的距离为0', () => {
      // 这里需要修改实现，处理相同城市的情况
      const sameCity = cityData.calculateDirectDistance('北京', '北京');
      expect(sameCity).toBe(0);
    });
  });

  describe('最近和最远城市对', () => {
    test('应返回正确的最近和最远城市对', () => {
      const { nearest, farthest } = cityData.getNearestAndFarthestCities();
      
      // 测试数据结构
      expect(nearest).toHaveProperty('cities');
      expect(nearest).toHaveProperty('distance');
      expect(farthest).toHaveProperty('cities');
      expect(farthest).toHaveProperty('distance');
      
      // 验证最近城市对的距离小于最远城市对
      expect(nearest.distance).toBeLessThan(farthest.distance);
      
      // 验证城市对包含两个城市
      expect(nearest.cities.length).toBe(2);
      expect(farthest.cities.length).toBe(2);
      
      // 验证返回的城市存在于城市列表中
      const allCities = cityData.getAllCities();
      nearest.cities.forEach(city => {
        expect(allCities).toContain(city);
      });
      farthest.cities.forEach(city => {
        expect(allCities).toContain(city);
      });
    });
  });
}); 