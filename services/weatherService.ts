import { WeatherData } from '../types';

export const fetchWeatherData = async (lat: number, lon: number): Promise<WeatherData> => {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current_weather: 'true',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    hourly: 'relative_humidity_2m,apparent_temperature',
    timezone: 'auto',
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  return response.json();
};

export const getWeatherDescription = (code: number): string => {
  const codes: Record<number, string> = {
    0: '晴',
    1: '晴间多云',
    2: '多云',
    3: '阴',
    45: '雾',
    48: '冻雾',
    51: '毛毛雨',
    53: '小雨',
    55: '中雨',
    61: '小雨',
    63: '中雨',
    65: '大雨',
    71: '小雪',
    73: '中雪',
    75: '大雪',
    95: '雷雨',
  };
  return codes[code] || '未知';
};