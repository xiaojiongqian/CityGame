/**
 * 城市数据服务
 * 提供城市数据和距离计算功能
 */

// 从原猜城市距离游戏.jsx中提取的城市坐标
const cityCoordinates = {
  '北京': [116.407526, 39.90403],
  '上海': [121.473701, 31.230416],
  '广州': [113.264385, 23.12911],
  '深圳': [114.085947, 22.547],
  '成都': [104.065735, 30.659462],
  '杭州': [120.15507, 30.274085],
  '武汉': [114.298572, 30.584355],
  '西安': [108.948024, 34.263161],
  '重庆': [106.504962, 29.533155],
  '南京': [118.76741, 32.041544],
  '天津': [117.190182, 39.125596],
  '苏州': [120.619585, 31.299379],
  '长沙': [112.982279, 28.19409],
  '沈阳': [123.429096, 41.796767],
  '青岛': [120.355173, 36.082982],
  '郑州': [113.665412, 34.757975],
  '大连': [121.618622, 38.91459],
  '东莞': [113.746262, 23.046237],
  '宁波': [121.549792, 29.868388],
  '厦门': [118.11022, 24.490474],
  '福州': [119.296494, 26.074507],
  '无锡': [120.301663, 31.574729],
  '合肥': [117.283042, 31.86119],
  '昆明': [102.712251, 25.040609],
  '哈尔滨': [126.642464, 45.756967],
  '济南': [117.12, 36.651216],
  '佛山': [113.121416, 23.021548],
  '长春': [125.3245, 43.886841],
  '温州': [120.672111, 28.000575],
  '石家庄': [114.502461, 38.045474]
};

/**
 * 获取所有城市名称列表
 * @returns {string[]} 城市名称数组
 */
function getAllCities() {
  return Object.keys(cityCoordinates);
}

/**
 * 获取指定城市的坐标
 * @param {string} cityName - 城市名称
 * @returns {number[]|null} 坐标数组 [经度, 纬度] 或 null
 */
function getCityCoordinates(cityName) {
  return cityCoordinates[cityName] || null;
}

/**
 * 随机获取指定数量的城市
 * @param {number} count - 需要的城市数量
 * @returns {string[]} 随机城市名称数组
 */
function getRandomCities(count = 2) {
  const cities = getAllCities();
  const result = [];
  const usedIndices = new Set();
  
  count = Math.min(count, cities.length);
  
  while (result.length < count) {
    const randomIndex = Math.floor(Math.random() * cities.length);
    if (!usedIndices.has(randomIndex)) {
      usedIndices.add(randomIndex);
      result.push(cities[randomIndex]);
    }
  }
  
  return result;
}

/**
 * 计算两个城市之间的直线距离（公里）
 * @param {string} city1 - 第一个城市名称
 * @param {string} city2 - 第二个城市名称
 * @returns {number|null} 距离（公里）或 null
 */
function calculateDirectDistance(city1, city2) {
  // 如果是同一个城市，则距离为0
  if (city1 === city2) {
    return 0;
  }
  
  const coords1 = getCityCoordinates(city1);
  const coords2 = getCityCoordinates(city2);
  
  if (!coords1 || !coords2) {
    return null;
  }
  
  return haversineDistance(coords1, coords2);
}

/**
 * 使用Haversine公式计算两点间的球面距离
 * @param {number[]} coords1 - 第一个点的坐标 [经度, 纬度]
 * @param {number[]} coords2 - 第二个点的坐标 [经度, 纬度]
 * @returns {number} 距离（公里）
 */
function haversineDistance(coords1, coords2) {
  const [lon1, lat1] = coords1;
  const [lon2, lat2] = coords2;
  
  const R = 6371; // 地球半径（公里）
  
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // 精确到0.1公里
}

/**
 * 角度转弧度
 * @param {number} degrees - 角度
 * @returns {number} 弧度
 */
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * 获取最近和最远的城市对
 * @returns {{nearest: {cities: string[], distance: number}, farthest: {cities: string[], distance: number}}}
 */
function getNearestAndFarthestCities() {
  const cities = getAllCities();
  let nearest = { cities: [], distance: Infinity };
  let farthest = { cities: [], distance: 0 };
  
  for (let i = 0; i < cities.length; i++) {
    for (let j = i + 1; j < cities.length; j++) {
      const city1 = cities[i];
      const city2 = cities[j];
      const distance = calculateDirectDistance(city1, city2);
      
      if (distance < nearest.distance) {
        nearest = { cities: [city1, city2], distance };
      }
      
      if (distance > farthest.distance) {
        farthest = { cities: [city1, city2], distance };
      }
    }
  }
  
  return { nearest, farthest };
}

export {
  cityCoordinates,
  getAllCities,
  getCityCoordinates,
  getRandomCities,
  calculateDirectDistance,
  getNearestAndFarthestCities
}; 