
import { WeatherData, GeocodingResponse, GeocodingResult } from '../types';
import { Language } from '../constants/translations';

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

export const searchLocations = async (query: string, lang: Language = 'zh'): Promise<GeocodingResult[]> => {
  if (!query || query.length < 2) return [];

  const params = new URLSearchParams({
    name: query,
    count: '5',
    language: lang, // Pass language to API
    format: 'json'
  });

  try {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`);
    if (!response.ok) return [];
    
    const data: GeocodingResponse = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Geocoding error:", error);
    return [];
  }
};

export const getWeatherDescription = (code: number, lang: Language = 'zh'): string => {
  const codesZh: Record<number, string> = {
    0: '晴', 1: '晴间多云', 2: '多云', 3: '阴',
    45: '雾', 48: '冻雾', 51: '毛毛雨', 53: '小雨', 55: '中雨',
    61: '小雨', 63: '中雨', 65: '大雨', 66: '冻雨', 67: '强冻雨',
    71: '小雪', 73: '中雪', 75: '大雪', 77: '雪粒',
    80: '阵雨', 81: '中阵雨', 82: '暴雨', 85: '阵雪', 86: '大阵雪',
    95: '雷雨', 96: '雷雨伴冰雹', 99: '强雷雨伴冰雹'
  };

  const codesEn: Record<number, string> = {
    0: 'Clear', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Rime Fog', 51: 'Light Drizzle', 53: 'Drizzle', 55: 'Heavy Drizzle',
    61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain', 66: 'Freezing Rain', 67: 'Heavy Freezing Rain',
    71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow', 77: 'Snow Grains',
    80: 'Showers', 81: 'Heavy Showers', 82: 'Violent Showers', 85: 'Snow Showers', 86: 'Heavy Snow Showers',
    95: 'Thunderstorm', 96: 'Thunderstorm w/ Hail', 99: 'Heavy Thunderstorm'
  };

  const map = lang === 'en' ? codesEn : codesZh;
  return map[code] || (lang === 'en' ? 'Unknown' : '未知');
};
