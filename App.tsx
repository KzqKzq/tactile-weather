import React, { useEffect, useState, useCallback } from 'react';
import { WeatherWidget } from './components/WeatherWidget';
import { fetchWeatherData } from './services/weatherService';
import { WeatherData, Location } from './types';

const LOCATIONS: Location[] = [
  { name: '秦皇岛', lat: 39.93, lon: 119.6 }, // China - Standard
  { name: '伦敦', lat: 51.5074, lon: -0.1278 }, // UK - Rain/Cloud
  { name: '三亚', lat: 18.2528, lon: 109.512 }, // China - Sun/Hot
  { name: '雷克雅未克', lat: 64.1466, lon: -21.9426 }, // Iceland - Cold/Snow/Wind
  { name: '东京', lat: 35.6762, lon: 139.6503 }, // Japan - Urban
];

const App: React.FC = () => {
  const [currentLocationIndex, setCurrentLocationIndex] = useState<number>(0);
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [unit, setUnit] = useState<'C' | 'F'>('C');

  const currentLocation = LOCATIONS[currentLocationIndex];

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate network delay for UI feel
      await new Promise(r => setTimeout(r, 400)); 
      const weather = await fetchWeatherData(currentLocation.lat, currentLocation.lon);
      setData(weather);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentLocation]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleUnit = () => {
    setUnit(prev => prev === 'C' ? 'F' : 'C');
  };

  const handleLocationChange = (index: number) => {
    if (index === currentLocationIndex) return;
    setCurrentLocationIndex(index);
  };

  const widgetProps = {
    data,
    loading,
    unit,
    locationName: currentLocation.name,
    onToggleUnit: toggleUnit,
    onRefresh: loadData,
  };

  return (
    <div className="min-h-screen bg-[#dcdcdc] flex flex-col items-center py-12 px-4 font-sans transition-colors duration-500 overflow-y-auto">
      
      {/* Location Selector */}
      <div className="mb-12 flex gap-3 z-10">
        {LOCATIONS.map((loc, index) => {
           const isActive = index === currentLocationIndex;
           return (
             <button
               key={index}
               onClick={() => handleLocationChange(index)}
               className={`
                 px-4 py-1 rounded-full text-sm font-medium transition-all duration-300
                 ${isActive 
                   ? 'bg-[#888] text-white shadow-inner' 
                   : 'bg-[#e6e6e6] text-gray-500 shadow-sm hover:bg-[#d6d6d6]'}
               `}
             >
               {loc.name}
             </button>
           );
        })}
      </div>

      <div className="w-full max-w-4xl flex flex-col items-center gap-12 pb-12">
        
        {/* Large Widget */}
        <div className="flex flex-col items-center gap-4 w-full">
           <span className="text-gray-400 text-sm font-medium uppercase tracking-widest">Large (4x4)</span>
           <WeatherWidget size="large" {...widgetProps} />
        </div>

        {/* Medium Widget */}
        <div className="flex flex-col items-center gap-4 w-full">
           <span className="text-gray-400 text-sm font-medium uppercase tracking-widest">Medium (4x2)</span>
           <WeatherWidget size="medium" {...widgetProps} />
        </div>

        {/* Small & Mini Widgets */}
        <div className="flex flex-wrap justify-center gap-12 w-full">
           <div className="flex flex-col items-center gap-4">
              <span className="text-gray-400 text-sm font-medium uppercase tracking-widest">Small (2x2)</span>
              <WeatherWidget size="small" {...widgetProps} />
           </div>

           <div className="flex flex-col items-center gap-4">
              <span className="text-gray-400 text-sm font-medium uppercase tracking-widest">Mini (1x1)</span>
              <WeatherWidget size="mini" {...widgetProps} />
           </div>
        </div>

      </div>
    </div>
  );
};

export default App;