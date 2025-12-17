
# Smartisan Weather React Component Kit

A high-fidelity recreation of the Smartisan OS (锤子科技) Weather app aesthetics, built as a modern React component library. This project features a skeuomorphic yet clean design style ("Nu-Skeuomorphism"), paying homage to the detail-obsessed design language of Smartisan.

![Preview](./preview.png)

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
3.  **Run the development server**:
    ```bash
    npm start
    ```

## 📦 Usage

The core component is `<WeatherWidget />`.

```tsx
import { WeatherWidget } from './components/WeatherWidget';

// ... inside your component
<WeatherWidget 
  size="large" // 'large' | 'medium' | 'small' | 'mini' | ...
  data={weatherData} // WeatherData object
  loading={isLoading} 
  unit="C" // 'C' | 'F'
  locationName="Beijing"
  lang="en" // 'zh' | 'en'
  onToggleUnit={() => {}}
  onRefresh={() => {}}
  onLocationSelect={(loc) => {}}
/>
```

## 🌍 Internationalization

The app supports `zh` (Chinese) and `en` (English).

To switch languages programmatically, pass the `lang` prop to the `WeatherWidget`. The demo `App.tsx` includes a global toggle example.

## 📄 License

MIT License. Designed for educational purposes and UI research.
Original design inspiration credit to Smartisan OS.
