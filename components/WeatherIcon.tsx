import React from 'react';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  CloudFog, 
  Moon,
  CloudSun
} from 'lucide-react';

interface WeatherIconProps {
  code: number;
  isDay?: number; // 1 for day, 0 for night
  className?: string;
  size?: number;
  strokeWidth?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ code, isDay = 1, className, size = 24, strokeWidth = 2.5 }) => {
  const commonProps = {
    size,
    className,
    strokeWidth
  };

  // Simple mapping logic
  if (code === 0 || code === 1) {
    return isDay ? <Sun {...commonProps} /> : <Moon {...commonProps} />;
  }
  if (code === 2) {
    return isDay ? <CloudSun {...commonProps} /> : <Cloud {...commonProps} />;
  }
  if (code === 3) return <Cloud {...commonProps} />;
  if (code >= 45 && code <= 48) return <CloudFog {...commonProps} />;
  if (code >= 51 && code <= 67) return <CloudRain {...commonProps} />;
  if (code >= 71 && code <= 77) return <CloudSnow {...commonProps} />;
  if (code >= 95) return <CloudLightning {...commonProps} />;

  return <Sun {...commonProps} />;
};