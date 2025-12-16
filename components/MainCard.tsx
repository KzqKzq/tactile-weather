import React, { useState } from 'react';
import { WeatherData } from '../types';
import { getWeatherDescription } from '../services/weatherService';
import { WeatherIcon } from './WeatherIcon';
import { ChevronRight, ChevronLeft, Wind, Droplets, Thermometer } from 'lucide-react';

interface MainCardProps {
  data: WeatherData | null;
  loading: boolean;
  unit: 'C' | 'F';
  size?: 'large' | 'medium' | 'small' | 'mini';
  locationName?: string;
}

export const MainCard: React.FC<MainCardProps> = ({ data, loading, unit, size = 'large', locationName }) => {
  const [view, setView] = useState<'main' | 'detail'>('main');

  // Define dimensions based on size
  const getContainerHeight = () => {
    switch(size) {
      case 'medium': return 'h-44';
      case 'small': return 'h-36'; // Slightly taller to breathe
      case 'mini': return 'h-24';
      default: return 'h-80'; // Large
    }
  };

  const getShadowClass = () => {
    // Reduce shadow depth for smaller sizes to avoid "muddy" look
    if (size === 'small' || size === 'mini') {
       return 'shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(0,0,0,0.06),inset_0_1px_2px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,1)]';
    }
    return 'shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15),inset_0_4px_8px_rgba(0,0,0,0.06),inset_0_1px_2px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,1)]';
  };

  const getContainerClass = () => {
     // Recessed shadow style
     return `relative w-full ${getContainerHeight()} bg-white 
      ${getShadowClass()}
      border border-black/[0.02] overflow-hidden transition-all duration-500 ease-in-out`;
  };
  
  // Radius adjustment for smaller sizes - significantly reduced
  const radiusClass = size === 'mini' ? 'rounded-[10px]' : size === 'small' ? 'rounded-[12px]' : 'rounded-[14px]';

  if (loading || !data) {
    return (
      <div className={`${getContainerClass()} ${radiusClass} animate-pulse flex items-center justify-center`}>
        <span className="text-gray-400 font-light drop-shadow-[0_1px_0_rgba(255,255,255,1)] text-sm">...</span>
      </div>
    );
  }

  const { current_weather, hourly } = data;
  const currentTemp = unit === 'C' 
    ? Math.round(current_weather.temperature) 
    : Math.round(current_weather.temperature * 9/5 + 32);
    
  const currentHour = new Date().getHours();
  const humidity = hourly.relative_humidity_2m[currentHour] || 50;
  const feelsLikeC = hourly.apparent_temperature[currentHour] || current_weather.temperature;
  const feelsLike = unit === 'C' ? Math.round(feelsLikeC) : Math.round(feelsLikeC * 9/5 + 32);

  // --- RENDER LOGIC BASED ON SIZE ---

  // MINI: Layout with Location Name inside
  if (size === 'mini') {
    return (
      <div className={`${getContainerClass()} ${radiusClass} flex flex-col items-center justify-center py-2 px-1`}>
         {/* Location Name at top */}
         <span className="text-[11px] font-medium text-[#666] mb-1 drop-shadow-[0_1px_0_rgba(255,255,255,1)] truncate max-w-full">
            {locationName}
         </span>
         
         <div className="filter drop-shadow-sm text-[#444] mb-0.5">
            <WeatherIcon code={current_weather.weathercode} isDay={current_weather.is_day} size={26} strokeWidth={2.5} className="text-[#3a3a3a]" />
         </div>
         <span className="text-lg font-semibold text-[#333] drop-shadow-[0_1px_1px_rgba(255,255,255,1)] leading-none">
           {currentTemp}°
         </span>
      </div>
    );
  }

  // SMALL: Vertical layout, City is in header outside, so just Icon + Temp + Status
  if (size === 'small') {
    return (
      <div className={`${getContainerClass()} ${radiusClass} flex flex-col items-center justify-center gap-1 py-3`}>
         <div className="filter drop-shadow-md text-[#444]">
            <WeatherIcon code={current_weather.weathercode} isDay={current_weather.is_day} size={42} strokeWidth={2.5} className="text-[#3a3a3a]" />
         </div>
         <div className="flex items-start -mr-2">
            <span className="text-4xl font-light tracking-tighter text-[#2a2a2a] drop-shadow-[0_1px_1px_rgba(255,255,255,1)]">
               {currentTemp}
            </span>
            <span className="text-lg mt-1 text-[#555]">°</span>
         </div>
         <span className="text-xs text-[#666] drop-shadow-[0_1px_0_rgba(255,255,255,1)]">
            {getWeatherDescription(current_weather.weathercode)}
         </span>
      </div>
    );
  }

  // MEDIUM: Horizontal Layout
  if (size === 'medium') {
    return (
      <div className={`${getContainerClass()} ${radiusClass} flex items-center px-6 justify-between`}>
         {/* Left: Icon */}
         <div className="filter drop-shadow-md text-[#444]">
            <WeatherIcon code={current_weather.weathercode} isDay={current_weather.is_day} size={80} strokeWidth={2.5} className="text-[#3a3a3a]" />
         </div>

         {/* Right: Info */}
         <div className="flex flex-col items-end">
            <div className="flex items-start">
               <span className="text-6xl font-thin tracking-tighter text-[#2a2a2a] drop-shadow-[0_1px_1px_rgba(255,255,255,1)]">
                 {currentTemp}
               </span>
               <span className="text-2xl mt-2 font-light text-[#555]">°</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-[#555] drop-shadow-[0_1px_0_rgba(255,255,255,1)]">
              <span>{getWeatherDescription(current_weather.weathercode)}</span>
              <span className="w-px h-3 bg-gray-300"></span>
              <span>空气 优</span>
            </div>
         </div>
      </div>
    );
  }

  // LARGE: Original Full Layout
  return (
    <div className={`${getContainerClass()} ${radiusClass}`}>
      
      {/* Navigation Arrow (Right Side Only for Main View) */}
      {view === 'main' && (
         <button 
           onClick={() => setView('detail')}
           className="absolute right-6 top-0 bottom-0 flex items-center justify-center z-10 group cursor-pointer"
         >
            <ChevronRight size={28} className="text-gray-300 group-hover:text-gray-400 transition-colors drop-shadow-[0_1px_0_rgba(255,255,255,1)]" />
         </button>
      )}

      {/* Navigation Arrow (Left Side Only for Detail View) */}
      {view === 'detail' && (
        <button 
          onClick={() => setView('main')}
          className="absolute left-4 top-0 bottom-0 w-12 flex items-center justify-center z-10 group cursor-pointer"
        >
           <ChevronLeft size={28} className="text-gray-300 group-hover:text-gray-400 transition-colors drop-shadow-[0_1px_0_rgba(255,255,255,1)]" />
        </button>
      )}

      <div className="w-full h-full flex flex-col justify-center">
        {view === 'main' ? (
          /* MAIN VIEW */
          <div className="flex items-center justify-center w-full px-8 animate-in fade-in slide-in-from-right-4 duration-300">
            
            {/* Left: Big Icon */}
            <div className="flex-1 flex justify-end pr-8">
               <div className="filter drop-shadow-md text-[#444]">
                 <WeatherIcon 
                   code={current_weather.weathercode} 
                   isDay={current_weather.is_day} 
                   size={140} 
                   strokeWidth={2.5}
                   className="text-[#3a3a3a]"
                 />
               </div>
            </div>

            {/* Right: Info Stack */}
            <div className="flex-1 flex flex-col items-start space-y-1">
              {/* Temperature: Very Thin, Very Large */}
              <div className="flex items-start -ml-1">
                <span className="text-[7rem] leading-none font-thin tracking-tighter text-[#2a2a2a] drop-shadow-[0_1px_1px_rgba(255,255,255,1)] font-[Inter]">
                  {currentTemp}
                </span>
                <span className="text-3xl mt-4 font-light text-[#555] drop-shadow-[0_1px_0_rgba(255,255,255,1)]">°{unit}</span>
              </div>
              
              {/* Weather Description */}
              <p className="text-[#4a4a4a] text-2xl font-normal tracking-wide drop-shadow-[0_1px_0_rgba(255,255,255,1)] pb-2">
                {getWeatherDescription(current_weather.weathercode)}
              </p>
              
              {/* Air Quality Badge */}
              <div className="flex items-center gap-2">
                 <span className="text-sm text-[#999] drop-shadow-[0_1px_0_rgba(255,255,255,1)]">空气质量</span>
                 <div className="bg-[#8cc63f] px-2 py-0.5 rounded-md shadow-[0_1px_1px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.2)] flex items-center gap-1">
                   <span className="text-white text-xs font-bold drop-shadow-sm">优</span>
                   <span className="text-white text-xs font-medium opacity-90">32</span>
                 </div>
              </div>

              {/* Update Time */}
              <p className="text-xs text-[#aaa] mt-1 font-medium drop-shadow-[0_1px_0_rgba(255,255,255,1)]">
                更新于 {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ) : (
          /* DETAIL VIEW */
          <div className="px-16 animate-in fade-in slide-in-from-left-4 duration-300 h-full flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
               <WeatherIcon 
                 code={current_weather.weathercode} 
                 isDay={current_weather.is_day} 
                 size={32} 
                 strokeWidth={2}
                 className="text-[#444]"
               />
               <span className="text-2xl text-[#333] font-normal drop-shadow-[0_1px_0_rgba(255,255,255,1)]">天气详情</span>
            </div>

            <div className="grid grid-cols-2 gap-y-8 gap-x-12">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)]">
                    <Thermometer className="text-[#888]" size={20}/>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-xs text-[#999] font-medium uppercase tracking-wider">体感温度</span>
                   <span className="text-xl text-[#333] font-medium">{feelsLike}°</span>
                 </div>
              </div>

              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)]">
                    <Droplets className="text-[#888]" size={20}/>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-xs text-[#999] font-medium uppercase tracking-wider">湿度</span>
                   <span className="text-xl text-[#333] font-medium">{humidity}%</span>
                 </div>
              </div>

              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)]">
                    <Wind className="text-[#888]" size={20}/>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-xs text-[#999] font-medium uppercase tracking-wider">风力</span>
                   <span className="text-xl text-[#333] font-medium">{current_weather.windspeed} km/h</span>
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};