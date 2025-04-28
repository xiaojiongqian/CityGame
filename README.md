# Getting Started with Create React App
# 城市距离游戏 - 项目设计文档

## 项目结构

```
city-game/
├── public/                 // 静态资源文件
├── src/                    // 源代码目录
│   ├── components/         // 组件目录
│   │   └── GameMap.jsx     // 地图组件
│   ├── services/           // 服务层
│   │   ├── cityData.js     // 城市数据服务
│   │   └── mockWebGL.js    // WebGL模拟服务
│   ├── __tests__/          // 测试目录
│   │   ├── cityData.test.js       // 城市数据服务测试
│   │   ├── CityGame.test.js       // CityGame 组件测试
│   ├── App.js              // 应用根组件
│   ├── App.css             // 应用样式
│   ├── CityGame.jsx        // 主游戏组件
│   ├── index.js            // 应用入口点
│   ├── index.css           // 全局样式
│   └── DESIGN.md           // 设计文档
├── package.json            // 项目依赖配置
└── README.md               // 项目说明文档
```

## 代码调用关系

```
index.js                // 应用入口
   └── App.js           // 应用根组件
       └── CityGame.jsx // 主游戏组件
           ├── GameMap.jsx // 地图组件
           │   └── 负责地图初始化和渲染
           └── cityData.js 服务
               └── 提供城市坐标、距离计算等功能
```

## 组件层次

1. **App**: 应用根组件，负责提供应用容器和基本样式
2. **CityGame**: 主游戏组件，负责:
   - 游戏状态管理
   - 游戏逻辑控制
   - 用户交互处理
   - 结果展示
3. **GameMap**: 地图渲染组件，负责:
   - 地图初始化和加载
   - 城市标记渲染
   - 地图操作和交互

## 服务层

1. **cityData.js**: 城市数据管理
   - `cityCoordinates`: 城市坐标数据
   - `getAllCities()`: 获取所有城市
   - `getCityCoordinates()`: 获取城市坐标
   - `getRandomCities()`: 随机获取城市
   - `calculateDirectDistance()`: 计算城市间距离
   - `getNearestAndFarthestCities()`: 获取最近和最远城市对

## 主要功能流程

1. 游戏初始化和自动开始
   ```
   CityGame组件挂载
   ↓
   初始化状态和引用
   ↓
   自动随机选择3个城市(getRandomCities)
   ↓
   自动生成所有可能的城市对(3个城市组成3对)
   ↓
   计算并显示每对城市之间的距离
   ↓
   渲染地图组件并加载城市标记
   ```

2. 游戏交互
   ```
   用户从已生成的城市对中选择一对作为"最近的城市对"
   ↓
   用户从已生成的城市对中选择一对作为"最远的城市对"
   ↓
   用户点击"提交猜测"按钮
   ↓
   系统比较用户猜测与实际结果
   ↓
   显示游戏结果(正确与否)
   ↓
   用户可选择重新开始游戏
   ```

## 已完成的优化

1. **组件拆分**: 
   - 将地图相关逻辑提取到GameMap组件
   - 简化CityGame组件，专注于游戏逻辑

2. **冗余代码清理**:
   - 移除了未使用的`猜城市距离游戏.jsx`文件
   - 整理了测试文件到专门的`__tests__`目录
   - 删除了CityGame组件中未使用的变量和函数
   - 移除了手动地图渲染逻辑，改用GameMap组件

3. **代码结构优化**:
   - 优化了组件依赖关系
   - 改进了错误处理和日志记录

4. **地图加载优化**:
   - 使用条件渲染避免DOM操作冲突
   - 使用Leaflet库进行地图渲染
   - 统一了地图加载和错误处理逻辑

5. **游戏流程优化**:
   - 实现游戏自动开始和城市自动选择
   - 自动生成所有可能的城市对，同时显示距离信息
   - 简化用户界面，让用户只需从已生成的城市对中选择最近和最远的对
   - 使用卡片式布局展示城市对，提升用户体验

## 未来优化建议

1. **状态管理优化**:
   - 使用useReducer管理复杂状态
   - 考虑引入Context API管理全局状态

2. **性能优化**:
   - 实现记忆化（memoization）避免不必要的重新渲染
   - 优化地图标记和连线的渲染

3. **用户体验改进**:
   - 添加加载动画
   - 实现响应式设计，适应不同屏幕大小
   - 增加游戏难度选项

4. **可访问性改进**:
   - 添加适当的ARIA属性
   - 确保键盘导航支持
   - 改进颜色对比度

5. **扩展功能**:
   - 添加多语言支持
   - 实现用户成绩保存功能
   - 增加更多游戏模式 

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.
