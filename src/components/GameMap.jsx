import React, { useRef, useState, useEffect, useMemo } from 'react';
import { MapPin, Globe, AlertCircle } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

/**
 * 游戏地图组件
 * 显示城市位置及连线，支持交互式地图功能
 * 包含错误处理和加载状态显示
 */
const GameMap = ({ 
  cities = [], 
  cityCoordinates = {},
  showLabels = true
}) => {
  const [mapError, setMapError] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRefs = useRef([]); // 存储circleMarker引用
  
  // 仅在开发环境下记录调试信息
  if (process.env.NODE_ENV === 'development') {
    console.log('渲染地图组件', { cities });
  }
  
  // 尝试加载地图
  useEffect(() => {
    // 避免重复初始化
    if (mapInstanceRef.current || !cities.length || !mapContainerRef.current) {
      return;
    }
    
    let leaflet;
    let mapInstance;
    
    // 尝试加载地图
    const initMap = async () => {
      try {
        console.log('开始加载地图库');
        setMapLoading(true);
        
        // 导入Leaflet
        leaflet = await import('leaflet');
        
        // 等待DOM更新
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (!mapContainerRef.current) {
          console.log('地图容器不存在，取消初始化');
          return;
        }
        
        // 检查容器尺寸
        if (mapContainerRef.current.clientWidth === 0 || mapContainerRef.current.clientHeight === 0) {
          console.log('地图容器尺寸为0，取消初始化');
          setMapError(true);
          return;
        }
        
        console.log('初始化地图实例');
        
        // 修复Leaflet图标问题
        delete leaflet.Icon.Default.prototype._getIconUrl;
        leaflet.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        });
        
        // 创建简单地图，避免复杂设置
        mapInstance = leaflet.map(mapContainerRef.current, {
          center: [35, 105], // 中国中心点附近
          zoom: 4,
          zoomControl: true,
          attributionControl: false,
          dragging: true,      // 启用拖动
          scrollWheelZoom: true, // 启用滚轮缩放
          doubleClickZoom: true, // 启用双击缩放
          touchZoom: true,     // 启用触摸缩放
          boxZoom: true,       // 启用框选缩放
          tap: true,           // 启用触摸事件
          keyboard: true,      // 启用键盘
          preferCanvas: false,  // 使用SVG渲染
          renderer: leaflet.svg() // 明确使用SVG渲染器
        });
        
        // 添加美化版底图
        leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(mapInstance);
        
        // 保存地图实例
        mapInstanceRef.current = mapInstance;
        
        // 重置markerRefs
        markerRefs.current = [];
        const bounds = [];
        
        cities.forEach(city => {
          const coords = cityCoordinates[city];
          if (!coords) return;
          
          const [lng, lat] = coords;
          const latlng = [lat, lng];
          bounds.push(latlng);
          
          // 使用美化版标记
          const marker = leaflet.circleMarker(latlng, {
            radius: 8,
            color: '#4F46E5',
            weight: 2,
            opacity: 1,
            fillColor: '#fff',
            fillOpacity: 1
          }).addTo(mapInstance);
          
          // 添加脉冲动画效果
          const pulseIcon = leaflet.divIcon({
            className: 'pulse-icon',
            html: '<div class="pulse-circle"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });
          
          leaflet.marker(latlng, { icon: pulseIcon }).addTo(mapInstance);
          
          // 添加城市名称标签
          marker.bindTooltip(showLabels ? city : "**", {
            permanent: true,
            direction: 'top',
            className: 'city-tooltip'
          });
          markerRefs.current.push(marker);
        });
        
        // 城市间连线，使用美化版样式
        if (cities.length >= 2) {
          for (let i = 0; i < cities.length; i++) {
            for (let j = i + 1; j < cities.length; j++) {
              const city1 = cities[i];
              const city2 = cities[j];
              const coords1 = cityCoordinates[city1];
              const coords2 = cityCoordinates[city2];
              
              if (!coords1 || !coords2) continue;
              
              // 带虚线动画效果的连线
              leaflet.polyline([
                [coords1[1], coords1[0]],
                [coords2[1], coords2[0]]
              ], {
                color: '#4F46E5',
                weight: 3,
                opacity: 0.7,
                dashArray: '5, 10',
                className: 'animated-line'
              }).addTo(mapInstance);
            }
          }
        }
        
        // 调整地图视图以包含所有标记
        if (bounds.length > 1) {
          try {
            mapInstance.fitBounds(leaflet.latLngBounds(bounds), {
              padding: [40, 40],
              maxZoom: 6
            });
          } catch (e) {
            console.error('调整边界错误:', e);
          }
        }
        
        // 确保地图尺寸正确
        mapInstance.invalidateSize();
        
        console.log('地图加载成功');
        setMapReady(true);
        setMapLoading(false);
        
      } catch (error) {
        console.error('地图加载错误:', error);
        setMapError(true);
        setMapLoading(false);
      }
    };
    
    // 延迟初始化地图，确保DOM已准备好
    const timer = setTimeout(initMap, 500);
    
    // 清理函数
    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        console.log('销毁地图实例');
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.error('地图销毁错误:', e);
        }
        mapInstanceRef.current = null;
      }
    };
  }, [cities, cityCoordinates, showLabels]);
  
  // 当showLabels或cities改变时，更新tooltip内容
  useEffect(() => {
    if (!mapInstanceRef.current || markerRefs.current.length !== cities.length) {
      return;
    }
    
    markerRefs.current.forEach((marker, idx) => {
      const city = cities[idx];
      if (city) {
        const label = showLabels ? city : "**";
        marker.setTooltipContent(label);
      }
    });
  }, [showLabels, cities]);
  
  // 使用useMemo优化备用方案渲染
  const renderFallbackView = useMemo(() => {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)',
        borderRadius: '16px'
      }}>
        <AlertCircle size={32} color="#EF4444" style={{marginBottom: '16px'}} />
        <div style={{ fontWeight: 'bold', marginBottom: '20px', fontSize: '18px', color: '#1F2937' }}>
          地图加载失败，显示城市信息
        </div>
        
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '20px'
        }}>
          {cities.map((city) => (
            <div key={city} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              minWidth: '120px',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'default',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
              }
            }}>
              <MapPin size={28} color="#4F46E5" />
              <div style={{ 
                marginTop: '12px', 
                fontWeight: 'bold', 
                fontSize: '18px', 
                color: '#111827' 
              }}>
                {city}
              </div>
              <div style={{ 
                fontSize: '14px', 
                color: '#6B7280', 
                marginTop: '8px',
                background: 'rgba(79, 70, 229, 0.1)',
                padding: '4px 10px',
                borderRadius: '20px',
                fontWeight: '500'
              }}>
                {cityCoordinates[city] ? 
                  `${cityCoordinates[city][0].toFixed(2)}, ${cityCoordinates[city][1].toFixed(2)}` : 
                  '未知坐标'}
              </div>
            </div>
          ))}
        </div>
        
        {cities.length >= 2 && (
          <div style={{ 
            marginTop: '24px', 
            fontSize: '15px', 
            color: '#4B5563',
            textAlign: 'center',
            maxWidth: '90%',
            lineHeight: '1.6'
          }}>
            猜测最近和最远的城市对。地图不可用，但游戏仍然可以继续。
          </div>
        )}
      </div>
    );
  }, [cities, cityCoordinates]);
  
  // 地图加载状态
  const renderLoading = useMemo(() => {
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 1000,
        borderRadius: '16px',
      }}>
        <Globe size={36} color="#4F46E5" style={{
          animation: 'pulse 2s infinite'
        }} />
        <div style={{ 
          marginTop: '16px', 
          color: '#4B5563', 
          fontWeight: 'bold',
          fontSize: '16px'
        }}>
          加载地图中...
        </div>
      </div>
    );
  }, []);
  
  // 使用useMemo优化版权信息组件
  const copyrightComponent = useMemo(() => {
    if (mapError || !mapReady) return null;
    
    return (
      <div style={{
        position: 'absolute',
        bottom: '8px',
        right: '8px',
        fontSize: '11px',
        color: '#666',
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: '3px 6px',
        borderRadius: '4px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        zIndex: 1000
      }}>
        © OpenStreetMap Contributors
      </div>
    );
  }, [mapError, mapReady]);
  
  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      backgroundColor: '#f2f8fc',
      borderRadius: '16px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(0, 0, 0, 0.05)',
    }}>
      {/* 地图容器 */}
      <div 
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '100%',
          display: mapError ? 'none' : 'block',
          borderRadius: '16px',
        }}
      />
      
      {/* 如果地图加载失败，显示备用界面 */}
      {mapError && renderFallbackView}
      
      {/* 地图加载中状态 */}
      {mapLoading && !mapError && renderLoading}
      
      {/* 版权信息 */}
      {copyrightComponent}
      
      <style jsx global>{`
        /* 脉冲标记动画 */
        .pulse-circle {
          width: 16px;
          height: 16px;
          background-color: rgba(79, 70, 229, 0.3);
          border-radius: 50%;
          position: absolute;
          top: 2px;
          left: 2px;
          animation: pulse-animation 2s infinite;
        }
        
        @keyframes pulse-animation {
          0% {
            transform: scale(0.5);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        /* 线条动画 */
        .animated-line {
          stroke-dashoffset: 20;
          animation: dash-animation 1.5s linear infinite;
        }
        
        @keyframes dash-animation {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
};

// 性能优化：使用React.memo避免不必要的重新渲染
export default React.memo(GameMap, (prevProps, nextProps) => {
  // 只在城市数组或标签显示状态变化时重新渲染
  return (
    prevProps.showLabels === nextProps.showLabels &&
    prevProps.cities.length === nextProps.cities.length &&
    prevProps.cities.every((city, index) => city === nextProps.cities[index])
  );
}); 