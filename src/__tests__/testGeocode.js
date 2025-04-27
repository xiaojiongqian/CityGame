// 测试高德地图地理编码API是否可用
const https = require('https');

// 从猜城市距离游戏.jsx中提取的API Key
const AMAP_API_KEY = '71fb06dacb5606e5e75339eafbddf972';

// 测试城市
const city = '北京';

// 构建高德地图地理编码API请求URL
const url = `https://restapi.amap.com/v3/geocode/geo?address=${encodeURIComponent(city)}&key=${AMAP_API_KEY}`;

console.log('正在测试高德地图地理编码API...');
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
        console.log('✅ API Key有效，地理编码请求成功!');
        if (response.info === 'OK') {
          console.log('✅ 返回状态正常');
          console.log(`📍 地理编码结果:`);
          response.geocodes?.forEach((item, index) => {
            console.log(`  结果 ${index+1}: ${item.formatted_address}, 坐标: ${item.location}`);
          });
          
          // 检查每日配额
          const count = response.count;
          if (count) {
            console.log(`ℹ️ 查询结果数量: ${count}`);
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