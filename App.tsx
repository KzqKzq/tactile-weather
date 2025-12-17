
import React, { useEffect, useState, useCallback } from 'react';
import { WeatherWidget } from './components/WeatherWidget';
import { fetchWeatherData } from './services/weatherService';
import { WeatherData, Location } from './types';
import { translations, Language } from './constants/translations';
import { Globe, Type, Palette } from 'lucide-react';

const INITIAL_LOCATIONS: Location[] = [
  { name: '秦皇岛', lat: 39.93, lon: 119.6 }, // China - Standard
  { name: 'London', lat: 51.5074, lon: -0.1278 }, // UK - Rain/Cloud
  { name: 'Sanya', lat: 18.2528, lon: 109.512 }, // China - Sun/Hot
];

const App: React.FC = () => {
  // Global App State
  const [lang, setLang] = useState<Language>('zh');
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  
  // Widget Data State (Shared for demo purposes)
  const [locations, setLocations] = useState<Location[]>(INITIAL_LOCATIONS);
  const [currentLocationIndex, setCurrentLocationIndex] = useState<number>(0);
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const currentLocation = locations[currentLocationIndex];
  const t = translations[lang];

  const loadData = useCallback(async () => {
    if (!currentLocation) return;
    
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

  // Global Handlers
  const toggleUnit = () => setUnit(prev => prev === 'C' ? 'F' : 'C');
  const toggleLang = () => setLang(prev => prev === 'zh' ? 'en' : 'zh');

  const handleLocationSelect = (newLocation: Location) => {
    const existingIndex = locations.findIndex(
      loc => Math.abs(loc.lat - newLocation.lat) < 0.01 && Math.abs(loc.lon - newLocation.lon) < 0.01
    );
    if (existingIndex !== -1) {
      setCurrentLocationIndex(existingIndex);
    } else {
      setLocations([newLocation, ...locations]);
      setCurrentLocationIndex(0);
    }
  };

  const commonProps = {
    data,
    loading,
    unit,
    locationName: currentLocation.name,
    onToggleUnit: toggleUnit,
    onRefresh: loadData,
    onLocationSelect: handleLocationSelect,
    lang
  };

  return (
    <div className="min-h-screen bg-[#f2f2f2] font-sans text-[#333]">
      
      {/* --- SHOWCASE HEADER --- */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md z-50 border-b border-black/5 px-6 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-sm flex items-center justify-center text-white font-bold">
               S
            </div>
            <div>
               <h1 className="text-base font-semibold tracking-tight leading-none">{t.demoTitle}</h1>
               <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">{t.demoSubtitle}</p>
            </div>
         </div>

         <div className="flex items-center gap-4">
            <button 
               onClick={toggleUnit}
               className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium"
            >
               <span className={unit === 'C' ? 'text-black' : 'text-gray-400'}>°C</span>
               <span className="w-px h-3 bg-gray-300"></span>
               <span className={unit === 'F' ? 'text-black' : 'text-gray-400'}>°F</span>
            </button>

            <button 
               onClick={toggleLang}
               className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black text-white hover:bg-gray-800 transition-colors shadow-lg shadow-black/10"
            >
               <Globe size={14} />
               <span className="text-xs font-semibold">{lang === 'zh' ? 'English' : '中文'}</span>
            </button>
         </div>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto space-y-16">
         
         {/* Introduction / Location Picker */}
         <section className="flex flex-col items-center justify-center gap-6">
            <div className="flex gap-2 flex-wrap justify-center">
               {locations.map((loc, index) => (
                  <button
                     key={`${loc.name}-${index}`}
                     onClick={() => setCurrentLocationIndex(index)}
                     className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                     ${index === currentLocationIndex 
                        ? 'bg-[#333] text-white shadow-lg shadow-black/20 transform scale-105' 
                        : 'bg-white text-gray-500 shadow-sm hover:bg-gray-50'}`}
                  >
                     {loc.name}
                  </button>
               ))}
            </div>
         </section>

         {/* 1. Standard Sizes */}
         <section>
            <h2 className="text-xl font-bold text-[#333] mb-8 pb-4 border-b border-gray-200 flex items-center gap-2">
               <Palette className="text-gray-400" size={20}/>
               {t.sectionStandard}
            </h2>
            <div className="flex flex-wrap gap-12 justify-center lg:justify-start items-start">
               {/* Large Widget */}
               <div className="flex flex-col gap-3">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{t.sizeLarge}</span>
                  <WeatherWidget size="large" {...commonProps} />
               </div>
               
               {/* Medium Widget */}
               <div className="flex flex-col gap-3">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{t.sizeMedium}</span>
                  <WeatherWidget size="medium" {...commonProps} />
               </div>
            </div>
         </section>

         {/* 2. Panoramic Sizes */}
         <section>
            <h2 className="text-xl font-bold text-[#333] mb-8 pb-4 border-b border-gray-200 flex items-center gap-2">
               <Type className="text-gray-400" size={20}/>
               {t.sectionPanoramic}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* Wide Medium */}
               <div className="flex flex-col gap-3 w-full">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{t.sizeWideMedium}</span>
                  <div className="flex">
                    <WeatherWidget size="wide-medium" {...commonProps} />
                  </div>
               </div>

               {/* Wide Small */}
               <div className="flex flex-col gap-3 w-full">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{t.sizeWideSmall}</span>
                  <div className="flex gap-4 flex-wrap">
                     <WeatherWidget size="wide-small" {...commonProps} />
                     <WeatherWidget size="wide-small" {...commonProps} />
                  </div>
               </div>
            </div>
         </section>

         {/* 3. Compact Sizes */}
         <section>
            <h2 className="text-xl font-bold text-[#333] mb-8 pb-4 border-b border-gray-200 flex items-center gap-2">
               <div className="w-5 h-5 rounded-md border-2 border-gray-400 border-dashed"></div>
               {t.sectionCompact}
            </h2>
            <div className="flex flex-wrap gap-10 items-end">
               {/* Small */}
               <div className="flex flex-col gap-3">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{t.sizeSmall}</span>
                  <WeatherWidget size="small" {...commonProps} />
               </div>

               {/* Mini */}
               <div className="flex flex-col gap-3">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{t.sizeMini}</span>
                  <div className="grid grid-cols-2 gap-4">
                     <WeatherWidget size="mini" {...commonProps} />
                     <WeatherWidget size="mini" {...commonProps} />
                  </div>
               </div>

               {/* Micro */}
               <div className="flex flex-col gap-3">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{t.sizeMicro}</span>
                  <div className="grid grid-cols-1 gap-3">
                     <WeatherWidget size="micro" {...commonProps} />
                     <WeatherWidget size="micro" {...commonProps} />
                     <WeatherWidget size="micro" {...commonProps} />
                  </div>
               </div>
            </div>
         </section>
      </main>

      <footer className="py-8 text-center text-gray-400 text-sm">
         <p>© 2024 tactile-weather Component Library. Design inspired by Smartisan OS.</p>
      </footer>
    </div>
  );
};

export default App;
