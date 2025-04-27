// 测试高德地图距离计算API是否可用
const https = require('https');

// 从猜城市距离游戏.jsx中提取的API Key
const AMAP_API_KEY = '71fb06dacb5606e5e75339eafbddf972';

// 测试两个城市的坐标（北京和上海）
// 坐标格式：经度,纬度
const origins = '116.407526,39.90403'; // 北京
const destination = '121.473701,31.230416'; // 上海

// 构建高德地图距离计算API请求URL
const url = `https://restapi.amap.com/v3/distance?origins=${origins}&destination=${destination}&key=${AMAP_API_KEY}`;

console.log('正在测试高德地图距离计算API...');
console.log(`API Key: ${AMAP_API_KEY}`);
console.log(`请求URL: ${url}`);
console.log('测试城市: 北京 -> 上海');

// 发送请求测试API Key是否有效
https.get(url, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('API响应状态码:', res.statusCode);
      console.log('API响应数据:', response);
      
      if (response.status === '1') {
        console.log('✅ API Key有效，距离计算请求成功!');
        if (response.info === 'OK') {
          console.log('✅ 返回状态正常');
          
          const results = response.results;
          if (results && results.length > 0) {
            const distance = parseInt(results[0].distance);
            const duration = parseInt(results[0].duration);
            
            console.log(`📏 距离: ${(distance / 1000).toFixed(1)}公里`);
            console.log(`⏱️ 预计驾车时间: ${Math.floor(duration / 3600)}小时${Math.floor((duration % 3600) / 60)}分钟`);
          }
        } else {
          console.log(`⚠️ 返回状态异常: ${response.info}`);
        }
      } else {
        console.log(`❌ API Key无效或请求失败: ${response.info}`);
        if (response.infocode === '10003') {
          console.log('❌ 访问已超出日访问量限制，需要付费或等待配额重置');
        } else if (response.infocode === '10001') {
          console.log('❌ API Key不正确或无效');
        }
      }
    } catch (e) {
      console.error('解析响应失败:', e.message);
    }
  });
}).on('error', (err) => {
  console.error('请求失败:', err.message);
}); 