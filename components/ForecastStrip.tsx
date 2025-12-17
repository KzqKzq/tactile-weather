
import React from 'react';
import { WeatherData } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { translations, Language } from '../constants/translations';

interface ForecastStripProps {
  data: WeatherData | null;
  unit: 'C' | 'F';
  lang: Language;
}

export const ForecastStrip: React.FC<ForecastStripProps> = ({ data, unit, lang }) => {
  if (!data) return null;

  const { daily } = data;
  const t = translations[lang];

  const getDayName = (dateStr: string, index: number) => {
    if (index === 0) return t.today;
    const date = new Date(dateStr);
    return t.weekDays[date.getDay()];
  };

  const convert = (temp: number) => unit === 'C' ? Math.round(temp) : Math.round(temp * 9/5 + 32);

  const forecastDays = daily.time.slice(0, 5).map((time, i) => ({
    time,
    code: daily.weather_code[i],
    max: daily.temperature_2m_max[i],
    min: daily.temperature_2m_min[i],
  }));

  return (
    // Matches MainCard shadow style with reduced border radius (now 6px)
    <div className="w-full bg-[var(--twx-bg-panel)] rounded-[6px] 
      shadow-[0_15px_30px_var(--twx-shadow-heavy),inset_0_3px_6px_var(--twx-shadow-inner),inset_0_1px_2px_var(--twx-shadow-subtle),0_1px_0_var(--twx-highlight-strong)]
      border border-[var(--twx-border-light)] p-6 mt-6">
       <div className="flex justify-between items-center px-2">
         {forecastDays.map((day, index) => (
           <div key={day.time} className="flex flex-col items-center justify-between gap-3 flex-1 group cursor-default">
             <span className={`text-sm drop-shadow-[var(--twx-text-shadow)] ${index === 0 ? 'text-[var(--twx-text-primary)] font-medium' : 'text-[var(--twx-text-muted)]'}`}>
               {getDayName(day.time, index)}
             </span>
             
             <div className="my-1 filter drop-shadow-md transition-transform group-hover:scale-110 duration-200">
               <WeatherIcon code={day.code} size={24} className="text-[var(--twx-text-secondary)]" />
             </div>

             <div className="flex gap-2 text-sm font-light">
               <span className="text-[var(--twx-text-primary)] drop-shadow-[var(--twx-text-shadow)]">{convert(day.max)}°</span>
               <span className="text-[var(--twx-text-muted)] drop-shadow-[var(--twx-text-shadow)]">{convert(day.min)}°</span>
             </div>
           </div>
         ))}
       </div>
    </div>
  );
};
