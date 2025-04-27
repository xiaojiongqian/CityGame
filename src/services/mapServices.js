/**
 * 地图工具函数
 * 提供距离计算和格式化功能
 */

/**
 * 格式化距离为易读的形式
 * @param {number} meters - 距离，单位：米
 * @returns {string} 格式化后的距离字符串
 */
function formatDistance(meters) {
  if (meters < 1000) {
    return `${meters.toFixed(0)}米`;
  } else {
    const kilometers = meters / 1000;
    return `${kilometers.toFixed(1)}公里`;
  }
}

/**
 * 格式化时间为易读的形式
 * @param {number} seconds - 时间，单位：秒
 * @returns {string} 格式化后的时间字符串
 */
function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${minutes}分钟`;
  } else {
    return `${hours}小时${remainingMinutes}分钟`;
  }
}

// 导出工具函数
export {
  formatDistance,
  formatDuration
}; 