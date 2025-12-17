# Smartisan Weather React Component Kit

[English](./README.md) | [中文](./README.zh-CN.md)

A high-fidelity recreation of the Smartisan OS (锤子科技) Weather app aesthetics, built as a modern React component library. This project features a skeuomorphic yet clean design style ("Nu-Skeuomorphism"), paying homage to the detail-obsessed design language of Smartisan.

![Preview](./asset/preview1.png)
![Preview](./asset/preview2.png)

## ✨ Features

*   **7 Responsive Sizes**:
    *   `Large` (4x4): Full details, forecast, air quality.
    *   `Medium` (4x2): Horizontal layout for dashboards.
    *   `Wide Medium` (4x1): Banner style.
    *   `Wide Small` (2x1): Horizontal compact.
    *   `Small` (2x2): Compact vertical.
    *   `Mini` (1x1): Minimalist square.
    *   `Micro` (1x0.5): Ultra-compact pill.
*   **Internationalization (i18n)**: Built-in support for English and Chinese (Simplified).
*   **Real-time Weather**: Powered by the Open-Meteo API (No API key required).
*   **Location Search**: Integrated Geocoding API to search and switch global cities.
*   **Aesthetic Details**:
    *   Custom SVG icons with animation support.
    *   "Engraved" text effects and soft shadows.
    *   Skeuomorphic toggle switches and buttons.
    *   Physical switch interactions for Unit conversion (°C/°F).

## 🛠 Tech Stack

*   **Framework**: React 18+
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React
*   **Data Source**: Open-Meteo (Forecast API & Geocoding API)
*   **Language**: TypeScript

## 🚀 Getting Started

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Start the development server**:
    ```bash
    npm run dev
    ```

## 📦 Usage

### Installation

```bash
npm install tactile-weather
```

### Prerequisites

This library uses **Tailwind CSS** for styling. Ensure your project has Tailwind CSS configured.

You also need to include the library CSS variables file:

```ts
import 'tactile-weather/dist/tactile-weather.css';
```

### Basic Example

```tsx
import 'tactile-weather/dist/tactile-weather.css';
import { WeatherWidget } from 'tactile-weather';

// ... inside your component
<WeatherWidget 
  size="large" 
  data={weatherData} 
  loading={false} 
  unit="C" 
  locationName="Beijing"
  lang="en"
  onToggleUnit={() => {}}
  onRefresh={() => {}}
/>
```

### Theming (Light/Dark + Custom Presets)

Dark mode is just another theme. Use `ThemeProvider` to set the mode and/or override theme variables:

```tsx
import 'tactile-weather/dist/tactile-weather.css';
import { ThemeProvider, WeatherWidget } from 'tactile-weather';

const customTheme = {
  '--twx-bg-app': '#0f172a',
  '--twx-text-primary': '#f8fafc',
};

<ThemeProvider initialTheme="dark" customTheme={customTheme}>
  <WeatherWidget {...props} />
</ThemeProvider>;
```

### Component API

#### `<WeatherWidget />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'large' \| 'medium' \| 'small' \| 'mini' \| 'wide-small' \| 'wide-medium' \| 'micro'` | Required | Controls the layout and dimensions of the widget. |
| `data` | `WeatherData \| null` | Required | The weather data object. |
| `loading` | `boolean` | `false` | Shows a loading skeleton when true. |
| `unit` | `'C' \| 'F'` | `'C'` | Temperature unit. |
| `locationName` | `string` | Required | Name of the city to display. |
| `lang` | `'zh' \| 'en'` | `'zh'` | Language for UI elements. |
| `onToggleUnit` | `() => void` | Required | Callback when unit switch is toggled. |
| `onRefresh` | `() => void` | Required | Callback when refresh button is clicked. |
| `onLocationSelect` | `(loc: Location) => void` | Optional | Callback when a new location is selected from search. |

#### Data Structure (`WeatherData`)

```typescript
interface WeatherData {
  current: {
    temp: number;
    weatherCode: number;
    humidity: number;
    windSpeed: number;
    aqi: number; // 0-500
  };
  forecast: Array<{
    date: string; // YYYY-MM-DD
    maxTemp: number;
    minTemp: number;
    weatherCode: number;
  }>;
}
```

## 🌍 Internationalization

The app supports `zh` (Chinese) and `en` (English).

To switch languages programmatically, pass the `lang` prop to the `WeatherWidget`. The demo `App.tsx` includes a global toggle example.

## 📄 License

MIT License. Designed for educational purposes and UI research.
Original design inspiration credit to Smartisan OS.
