import React from 'react';
import { WeatherData } from '../types';
import { WeatherIcon } from './WeatherIcon';

interface ForecastStripProps {
  data: WeatherData | null;
  unit: 'C' | 'F';
}

export const ForecastStrip: React.FC<ForecastStripProps> = ({ data, unit }) => {
  if (!data) return null;

  const { daily } = data;

  const getDayName = (dateStr: string, index: number) => {
    if (index === 0) return '今天';
    const date = new Date(dateStr);
    const dayMap = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return dayMap[date.getDay()];
  };

  const convert = (temp: number) => unit === 'C' ? Math.round(temp) : Math.round(temp * 9/5 + 32);

  const forecastDays = daily.time.slice(0, 5).map((time, i) => ({
    time,
    code: daily.weather_code[i],
    max: daily.temperature_2m_max[i],
    min: daily.temperature_2m_min[i],
  }));

  return (
    // Matches MainCard shadow style with reduced border radius
    <div className="w-full bg-[#fbfbfb] rounded-[14px] 
      shadow-[0_15px_30px_rgba(0,0,0,0.1),inset_0_3px_6px_rgba(0,0,0,0.06),inset_0_1px_2px_rgba(0,0,0,0.08),0_1px_0_rgba(255,255,255,1)]
      border border-black/[0.03] p-6 mt-6">
       <div className="flex justify-between items-center px-2">
         {forecastDays.map((day, index) => (
           <div key={day.time} className="flex flex-col items-center justify-between gap-3 flex-1 group cursor-default">
             <span className={`text-sm drop-shadow-[0_1px_0_rgba(255,255,255,1)] ${index === 0 ? 'text-[#333] font-medium' : 'text-gray-400'}`}>
               {getDayName(day.time, index)}
             </span>
             
             <div className="my-1 filter drop-shadow-md transition-transform group-hover:scale-110 duration-200">
               <WeatherIcon code={day.code} size={24} className="text-[#555]" />
             </div>

             <div className="flex gap-2 text-sm font-light">
               <span className="text-[#333] drop-shadow-[0_1px_0_rgba(255,255,255,1)]">{convert(day.max)}°</span>
               <span className="text-gray-400 drop-shadow-[0_1px_0_rgba(255,255,255,1)]">{convert(day.min)}°</span>
             </div>
           </div>
         ))}
       </div>
    </div>
  );
};