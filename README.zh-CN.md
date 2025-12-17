# 锤子天气 React 组件库 (Smartisan Weather React Component Kit)

[English](./README.md) | [中文](./README.zh-CN.md)

高度复刻 Smartisan OS (锤子科技) 天气应用的精美设计，构建为现代化的 React 组件库。本项目采用拟物化与简洁设计相结合的风格 ("新拟物化")，致敬锤子科技对细节的极致追求。

![Preview](./preview.png)

## ✨ 特性

*   **7 种响应式尺寸**:
    *   `Large` (4x4): 完整详情，预报，空气质量。
    *   `Medium` (4x2): 仪表盘水平布局。
    *   `Wide Medium` (4x1): 横幅样式。
    *   `Wide Small` (2x1): 紧凑水平布局。
    *   `Small` (2x2): 紧凑垂直布局。
    *   `Mini` (1x1): 极简方形。
    *   `Micro` (1x0.5): 超紧凑胶囊形。
*   **国际化 (i18n)**: 内置支持中文（简体）和英文。
*   **实时天气**: 由 Open-Meteo API 提供支持（无需 API Key）。
*   **位置搜索**: 集成地理编码 API 以搜索并切换全球城市。
*   **美学细节**:
    *   支持动画的自定义 SVG 图标。
    *   "内陷"文字效果和柔和阴影。
    *   拟物化切换开关和按钮。
    *   物理开关交互用于单位转换 (°C/°F)。

## 🛠 技术栈

*   **框架**: React 18+
*   **样式**: Tailwind CSS
*   **图标**: Lucide React
*   **数据源**: Open-Meteo (Forecast API & Geocoding API)
*   **语言**: TypeScript

## 🚀 快速开始

1.  **克隆仓库**
2.  **安装依赖**:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **启动开发服务器**:
    ```bash
    npm start
    ```

## 📦 使用方法

核心组件是 `<WeatherWidget />`。

```tsx
import { WeatherWidget } from 'tactile-weather'; // 或者本地路径

// ... 在你的组件中
<WeatherWidget 
  size="large" // 'large' | 'medium' | 'small' | 'mini' | ...
  data={weatherData} // WeatherData object
  loading={isLoading} 
  unit="C" // 'C' | 'F'
  locationName="Beijing"
  lang="zh" // 'zh' | 'en'
  onToggleUnit={() => {}}
  onRefresh={() => {}}
  onLocationSelect={(loc) => {}}
/>
```

## 🌍 国际化

应用支持 `zh` (中文) 和 `en` (英文)。

要以编程方式切换语言，请将 `lang` 属性传递给 `WeatherWidget`。演示中的 `App.tsx` 包含了一个全局切换的示例。

## 📄 许可证

MIT License. Designed for educational purposes and UI research.
Original design inspiration credit to Smartisan OS.
