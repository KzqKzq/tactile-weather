
import React, { useEffect, useState, useCallback, useRef } from 'react';
import './styles/theme.css';
import { WeatherWidget } from './components/WeatherWidget';
import { ThemeProvider, useTheme, ThemeConfig, ThemeMode } from './components/ThemeProvider';
import { fetchWeatherData } from './services/weatherService';
import { WeatherData, Location } from './types';
import { translations, Language } from './constants/translations';
import { Globe, Palette, Type, Check } from 'lucide-react';

const INITIAL_LOCATIONS: Location[] = [
  { name: '秦皇岛', lat: 39.93, lon: 119.6 }, // China - Standard
  { name: 'London', lat: 51.5074, lon: -0.1278 }, // UK - Rain/Cloud
  { name: 'Sanya', lat: 18.2528, lon: 109.512 }, // China - Sun/Hot
];

// --- THEME PRESETS ---

const MIDNIGHT_THEME: ThemeConfig = {
    '--twx-bg-widget': '#1e293b',
    '--twx-bg-app': '#0f172a',
    '--twx-bg-panel': '#1e293b', // Added missing panel bg
    '--twx-text-primary': '#f8fafc',
    '--twx-text-emphasis': '#ffffff', // Added missing emphasis text
    '--twx-text-secondary': '#cbd5e1',
    '--twx-text-tertiary': '#94a3b8',
    '--twx-text-icon': '#cbd5e1', // Added missing icon color
    '--twx-text-muted': '#64748b',
    '--twx-border-light': 'rgba(255,255,255,0.1)',
    '--twx-shadow-heavy': 'rgba(0,0,0,0.5)',
    '--twx-highlight': 'rgba(255,255,255,0.05)',
    '--twx-text-shadow': '0 1px 2px rgba(0,0,0,0.5)',
    '--twx-bg-input': '#334155',
    '--twx-bg-button': '#334155',
    '--twx-bg-button-hover': '#475569',
    '--twx-bg-item-hover': '#334155'
};

const FOREST_THEME: ThemeConfig = {
    '--twx-bg-widget': '#f0fdf4',
    '--twx-bg-app': '#dcfce7',
    '--twx-text-primary': '#14532d',
    '--twx-text-secondary': '#166534',
    '--twx-text-tertiary': '#15803d',
    '--twx-border-light': 'rgba(22, 101, 52, 0.1)',
    '--twx-shadow-heavy': 'rgba(20, 83, 45, 0.2)',
    '--twx-highlight': 'rgba(255,255,255,0.8)',
    '--twx-accent-success': '#22c55e',
    '--twx-bg-input': '#dcfce7',
    '--twx-bg-button': '#bbf7d0',
    '--twx-bg-item-hover': '#bbf7d0'
};

const SUNSET_THEME: ThemeConfig = {
    '--twx-bg-widget': '#fff7ed',
    '--twx-bg-app': '#ffedd5',
    '--twx-text-primary': '#7c2d12',
    '--twx-text-secondary': '#9a3412',
    '--twx-text-tertiary': '#c2410c',
    '--twx-border-light': 'rgba(124, 45, 18, 0.1)',
    '--twx-shadow-heavy': 'rgba(124, 45, 18, 0.15)',
    '--twx-accent-success': '#fb923c',
    '--twx-bg-input': '#ffedd5',
    '--twx-bg-button': '#fed7aa',
    '--twx-bg-item-hover': '#fed7aa'
};

const LAVENDER_THEME: ThemeConfig = {
    '--twx-bg-widget': '#faf5ff',
    '--twx-bg-app': '#f3e8ff',
    '--twx-text-primary': '#581c87',
    '--twx-text-secondary': '#6b21a8',
    '--twx-text-tertiary': '#7e22ce',
    '--twx-border-light': 'rgba(88, 28, 135, 0.1)',
    '--twx-shadow-heavy': 'rgba(88, 28, 135, 0.15)',
    '--twx-accent-success': '#a855f7',
    '--twx-bg-input': '#f3e8ff',
    '--twx-bg-button': '#e9d5ff',
    '--twx-bg-item-hover': '#e9d5ff'
};

type ThemePreset = { name: string; id: string; mode: ThemeMode; config?: ThemeConfig; color: string };

const PRESETS: ThemePreset[] = [
    { name: 'Default (Light)', id: 'default-light', mode: 'light', config: undefined, color: '#f2f2f2' },
    { name: 'Default (Dark)', id: 'default-dark', mode: 'dark', config: undefined, color: '#121212' },
    { name: 'Midnight', id: 'midnight', mode: 'dark', config: MIDNIGHT_THEME, color: '#0f172a' },
    { name: 'Forest', id: 'forest', mode: 'light', config: FOREST_THEME, color: '#dcfce7' },
    { name: 'Sunset', id: 'sunset', mode: 'light', config: SUNSET_THEME, color: '#ffedd5' },
    { name: 'Lavender', id: 'lavender', mode: 'light', config: LAVENDER_THEME, color: '#f3e8ff' },
];

const Showcase: React.FC<{ setCustomTheme: (t: ThemeConfig | undefined) => void, customTheme?: ThemeConfig }> = ({ setCustomTheme, customTheme }) => {
  // Global App State
  const [lang, setLang] = useState<Language>('zh');
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const { setTheme } = useTheme();
  const [activePresetId, setActivePresetId] = useState<string>('default-light');
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  // Widget Data State (Shared for demo purposes)
  const [locations, setLocations] = useState<Location[]>(INITIAL_LOCATIONS);
  const [currentLocationIndex, setCurrentLocationIndex] = useState<number>(0);
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const currentLocation = locations[currentLocationIndex];
  const t = translations[lang];

  // Close theme menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadData = useCallback(async () => {
    if (!currentLocation) return;
    setLoading(true);
    try {
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
  
  const handlePresetSelect = (preset: ThemePreset) => {
      setActivePresetId(preset.id);
      setTheme(preset.mode);
      setCustomTheme(preset.config);
      setIsThemeMenuOpen(false);
  };

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
    <div className="min-h-screen bg-[var(--twx-bg-app)] font-sans text-[var(--twx-text-primary)] transition-colors duration-500 ease-out">
      
      {/* --- SHOWCASE HEADER --- */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[var(--twx-bg-widget)]/80 backdrop-blur-md z-50 border-b border-[var(--twx-border-light)] px-6 flex items-center justify-between transition-colors duration-300">
         <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg shadow-sm flex items-center justify-center text-white font-bold transition-all duration-500
                ${activePresetId === 'forest' ? 'bg-green-600' : 
                  activePresetId === 'sunset' ? 'bg-orange-500' :
                  activePresetId === 'lavender' ? 'bg-purple-600' :
                  activePresetId === 'midnight' ? 'bg-slate-700' :
                  'bg-gradient-to-br from-blue-400 to-blue-600'
                }
            `}>
               S
            </div>
            <div>
               <h1 className="text-base font-semibold tracking-tight leading-none">{t.demoTitle}</h1>
               <p className="text-[10px] text-[var(--twx-text-muted)] font-medium uppercase tracking-wider mt-0.5">{t.demoSubtitle}</p>
            </div>
         </div>

         <div className="flex items-center gap-4">
	            {/* Theme Controls */}
	            <div className="flex items-center gap-2 bg-[var(--twx-bg-input)] p-1 rounded-full border border-[var(--twx-border-light)] relative" ref={themeMenuRef}>
	                {/* Theme Selector Trigger */}
	                <button 
	                    onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
	                    className="flex items-center gap-1.5 px-2 py-1 rounded-full hover:bg-[var(--twx-bg-item-hover)] transition-colors"
	                >
	                    <div className="w-4 h-4 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: PRESETS.find(p => p.id === activePresetId)?.color }}></div>
	                    <span className="text-xs font-medium text-[var(--twx-text-secondary)] hidden sm:block">
	                        {PRESETS.find(p => p.id === activePresetId)?.name}
	                    </span>
	                </button>

                {/* Theme Dropdown */}
                {isThemeMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-[var(--twx-bg-panel)] rounded-xl shadow-xl border border-[var(--twx-border-light)] p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="text-[10px] font-semibold text-[var(--twx-text-muted)] uppercase tracking-wider px-2 py-1 mb-1 opacity-50">
                            Select Theme
                        </div>
                        {PRESETS.map(preset => (
                            <button
                                key={preset.id}
                                onClick={() => handlePresetSelect(preset)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors
                                    ${activePresetId === preset.id ? 'bg-[var(--twx-bg-item-hover)]' : 'hover:bg-[var(--twx-bg-button-hover)]'}
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: preset.color }}></div>
                                    <span className="text-[var(--twx-text-primary)]">{preset.name}</span>
                                </div>
                                {activePresetId === preset.id && <Check size={14} className="text-[var(--twx-accent-success)]" />}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="h-6 w-px bg-[var(--twx-border-light)]"></div>

            <button 
               onClick={toggleUnit}
               className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--twx-bg-input)] hover:bg-[var(--twx-bg-item-hover)] transition-colors text-sm font-medium"
            >
               <span className={unit === 'C' ? 'text-[var(--twx-text-primary)]' : 'text-[var(--twx-text-muted)]'}>°C</span>
               <span className="w-px h-3 bg-[var(--twx-divider)]"></span>
               <span className={unit === 'F' ? 'text-[var(--twx-text-primary)]' : 'text-[var(--twx-text-muted)]'}>°F</span>
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
                     className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border border-transparent
                     ${index === currentLocationIndex 
                        ? 'bg-[var(--twx-text-primary)] text-[var(--twx-bg-widget)] shadow-lg shadow-black/20 transform scale-105' 
                        : 'bg-[var(--twx-bg-widget)] text-[var(--twx-text-secondary)] shadow-sm hover:bg-[var(--twx-bg-item-hover)] border-[var(--twx-border-light)]'}`}
                  >
                     {loc.name}
                  </button>
               ))}
            </div>
         </section>

         {/* 1. Standard Sizes */}
         <section>
            <h2 className="text-xl font-bold text-[var(--twx-text-primary)] mb-8 pb-4 border-b border-[var(--twx-border-light)] flex items-center gap-2">
               <Palette className="text-[var(--twx-text-muted)]" size={20}/>
               {t.sectionStandard}
            </h2>
            <div className="flex flex-wrap gap-12 justify-center lg:justify-start items-start">
               {/* Large Widget */}
               <div className="flex flex-col gap-3">
                  <span className="text-xs font-semibold text-[var(--twx-text-muted)] uppercase tracking-widest">{t.sizeLarge}</span>
                  <WeatherWidget size="large" {...commonProps} />
               </div>
               
               {/* Medium Widget */}
               <div className="flex flex-col gap-3">
                  <span className="text-xs font-semibold text-[var(--twx-text-muted)] uppercase tracking-widest">{t.sizeMedium}</span>
                  <WeatherWidget size="medium" {...commonProps} />
               </div>
            </div>
         </section>

         {/* 2. Panoramic Sizes */}
         <section>
            <h2 className="text-xl font-bold text-[var(--twx-text-primary)] mb-8 pb-4 border-b border-[var(--twx-border-light)] flex items-center gap-2">
               <Type className="text-[var(--twx-text-muted)]" size={20}/>
               {t.sectionPanoramic}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* Wide Medium */}
               <div className="flex flex-col gap-3 w-full">
                  <span className="text-xs font-semibold text-[var(--twx-text-muted)] uppercase tracking-widest">{t.sizeWideMedium}</span>
                  <div className="flex">
                    <WeatherWidget size="wide-medium" {...commonProps} />
                  </div>
               </div>

               {/* Wide Small */}
               <div className="flex flex-col gap-3 w-full">
                  <span className="text-xs font-semibold text-[var(--twx-text-muted)] uppercase tracking-widest">{t.sizeWideSmall}</span>
                  <div className="flex gap-4 flex-wrap">
                     <WeatherWidget size="wide-small" {...commonProps} />
                     <WeatherWidget size="wide-small" {...commonProps} />
                  </div>
               </div>
            </div>
         </section>

         {/* 3. Compact Sizes */}
         <section>
            <h2 className="text-xl font-bold text-[var(--twx-text-primary)] mb-8 pb-4 border-b border-[var(--twx-border-light)] flex items-center gap-2">
               <div className="w-5 h-5 rounded-md border-2 border-[var(--twx-text-muted)] border-dashed"></div>
               {t.sectionCompact}
            </h2>
            <div className="flex flex-wrap gap-10 items-end">
               {/* Small */}
               <div className="flex flex-col gap-3">
                  <span className="text-xs font-semibold text-[var(--twx-text-muted)] uppercase tracking-widest">{t.sizeSmall}</span>
                  <WeatherWidget size="small" {...commonProps} />
               </div>

               {/* Mini */}
               <div className="flex flex-col gap-3">
                  <span className="text-xs font-semibold text-[var(--twx-text-muted)] uppercase tracking-widest">{t.sizeMini}</span>
                  <div className="grid grid-cols-2 gap-4">
                     <WeatherWidget size="mini" {...commonProps} />
                     <WeatherWidget size="mini" {...commonProps} />
                  </div>
               </div>

               {/* Micro */}
               <div className="flex flex-col gap-3">
                  <span className="text-xs font-semibold text-[var(--twx-text-muted)] uppercase tracking-widest">{t.sizeMicro}</span>
                  <div className="grid grid-cols-1 gap-3">
                     <WeatherWidget size="micro" {...commonProps} />
                     <WeatherWidget size="micro" {...commonProps} />
                     <WeatherWidget size="micro" {...commonProps} />
                  </div>
               </div>
            </div>
         </section>
      </main>

      <footer className="py-8 text-center text-[var(--twx-text-muted)] text-sm">
         <p>© 2024 tactile-weather Component Library. Design inspired by Smartisan OS.</p>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
    const [customTheme, setCustomTheme] = useState<ThemeConfig | undefined>(undefined);

    return (
        <ThemeProvider customTheme={customTheme}>
            <Showcase setCustomTheme={setCustomTheme} customTheme={customTheme} />
        </ThemeProvider>
    );
};

export default App;
