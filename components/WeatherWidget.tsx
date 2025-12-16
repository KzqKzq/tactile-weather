import React from 'react';
import { Header } from './Header';
import { MainCard } from './MainCard';
import { ForecastStrip } from './ForecastStrip';
import { WeatherData } from '../types';

interface WeatherWidgetProps {
  size: 'large' | 'medium' | 'small' | 'mini';
  data: WeatherData | null;
  loading: boolean;
  unit: 'C' | 'F';
  locationName: string;
  onToggleUnit: () => void;
  onRefresh: () => void;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  size,
  data,
  loading,
  unit,
  locationName,
  onToggleUnit,
  onRefresh,
}) => {
  // Styles based on size
  let containerClasses = "bg-[#fefefe] shadow-[0_50px_100px_-20px_rgba(50,50,93,0.25),0_30px_60px_-30px_rgba(0,0,0,0.3),inset_0_2px_0_rgba(255,255,255,0.5)] relative overflow-hidden flex flex-col items-center";
  
  if (size === 'large') {
    containerClasses += " w-full max-w-md rounded-[20px] p-8";
  } else if (size === 'medium') {
    containerClasses += " w-full max-w-md rounded-[20px] p-6";
  } else if (size === 'small') {
    containerClasses += " w-48 rounded-[18px] p-4"; 
  } else if (size === 'mini') {
    containerClasses += " w-32 rounded-[16px] p-3"; 
  }

  return (
    <div className={containerClasses}>
      <Header 
        locationName={locationName} 
        unit={unit} 
        onToggleUnit={onToggleUnit} 
        onRefresh={onRefresh}
        size={size}
      />

      <div className={`w-full ${size === 'large' ? 'space-y-6' : 'space-y-0'}`}>
         <MainCard data={data} loading={loading} unit={unit} size={size} locationName={locationName} />
         
         {/* Forecast only for Large */}
         {size === 'large' && <ForecastStrip data={data} unit={unit} />}
      </div>
    </div>
  );
};