// 测试高德地图API Key是否可用
const https = require('https');

// 从猜城市距离游戏.jsx中提取的API Key
const AMAP_API_KEY = '71fb06dacb5606e5e75339eafbddf972';

// 构建高德地图IP定位API请求URL
const url = `https://restapi.amap.com/v3/ip?key=${AMAP_API_KEY}`;

console.log('正在测试高德地图API连接...');
console.log(`API Key: ${AMAP_API_KEY}`);
console.log(`请求URL: ${url}`);

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
        console.log('✅ API Key有效，请求成功!');
        if (response.info === 'OK') {
          console.log('✅ 返回状态正常');
          console.log(`📍 当前IP定位: ${response.province}${response.city}`);
        } else {
          console.log(`⚠️ 返回状态异常: ${response.info}`);
        }
      } else {
        console.log(`❌ API Key无效或请求失败: ${response.info}`);
      }
    } catch (e) {
      console.error('解析响应失败:', e.message);
    }
  });
}).on('error', (err) => {
  console.error('请求失败:', err.message);
}); 