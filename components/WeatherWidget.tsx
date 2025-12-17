
import React from 'react';
import { Header } from './Header';
import { MainCard } from './MainCard';
import { ForecastStrip } from './ForecastStrip';
import { WeatherData, Location } from '../types';
import { Language } from '../constants/translations';

interface WeatherWidgetProps {
  size: 'large' | 'medium' | 'small' | 'mini' | 'wide-small' | 'wide-medium' | 'micro';
  data: WeatherData | null;
  loading: boolean;
  unit: 'C' | 'F';
  locationName: string;
  onToggleUnit: () => void;
  onRefresh: () => void;
  onLocationSelect?: (location: Location) => void;
  lang: Language;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  size,
  data,
  loading,
  unit,
  locationName,
  onToggleUnit,
  onRefresh,
  onLocationSelect,
  lang,
}) => {
  // Styles based on size
  let containerClasses = "bg-[var(--twx-bg-widget)] shadow-[0_50px_100px_-20px_var(--twx-shadow-heavy),0_30px_60px_-30px_var(--twx-shadow-medium),inset_0_2px_0_var(--twx-highlight)] relative overflow-hidden flex flex-col items-center";
  
  // Padding logic
  if (size === 'large') {
    containerClasses += " w-full max-w-md rounded-[12px] p-8";
  } else if (size === 'medium') {
    containerClasses += " w-full max-w-md rounded-[12px] p-6";
  } else if (size === 'small') {
    containerClasses += " w-48 rounded-[10px] p-4"; 
  } else if (size === 'wide-small') {
    containerClasses += " w-48 rounded-[8px] p-3"; // 2x1
  } else if (size === 'wide-medium') {
    containerClasses += " w-full max-w-md rounded-[8px] p-3"; // 4x1
  } else if (size === 'mini') {
    containerClasses += " w-32 rounded-[8px] p-3"; 
  } else if (size === 'micro') {
    containerClasses += " w-32 rounded-[8px] p-2"; // 1x0.5, reduced padding
  }

  return (
    <div className={containerClasses}>
      <Header 
        locationName={locationName} 
        unit={unit} 
        onToggleUnit={onToggleUnit} 
        onRefresh={onRefresh}
        onLocationSelect={onLocationSelect}
        size={size}
        lang={lang}
      />

      <div className={`w-full ${size === 'large' ? 'space-y-6' : 'space-y-0'}`}>
         <MainCard 
            data={data} 
            loading={loading} 
            unit={unit} 
            size={size} 
            locationName={locationName} 
            lang={lang}
         />
         
         {/* Forecast only for Large */}
         {size === 'large' && <ForecastStrip data={data} unit={unit} lang={lang} />}
      </div>
    </div>
  );
};
