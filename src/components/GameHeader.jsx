import React from 'react';
import { MapPin } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * 游戏头部组件，显示游戏标题和描述
 */
const GameHeader = ({ isMobile, styles }) => {
  return (
    <div style={styles.header}>
      <div style={styles.headerIcon} data-testid="header-icon">
        <MapPin size={isMobile ? 30 : 40} />
      </div>
      <h1 style={styles.title}>猜城市距离</h1>
      <div style={styles.subtitle}>
        选择最近和最远的城市对，测试你的地理知识！
      </div>
      <div style={styles.description}>
        在地图上的三个城市中，选择你认为距离最近和最远的两个城市对。
        提交后，系统会告诉你答案是否正确！
      </div>
    </div>
  );
};

GameHeader.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  styles: PropTypes.object.isRequired
};

// 使用React.memo优化渲染，因为这个组件很少变化
export default React.memo(GameHeader); 