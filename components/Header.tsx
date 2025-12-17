
import React, { useState, useEffect, useRef } from 'react';
import { RefreshCcw, ArrowRightLeft, Search, MapPin } from 'lucide-react';
import { searchLocations } from '../services/weatherService';
import { GeocodingResult, Location } from '../types';
import { translations, Language } from '../constants/translations';

interface HeaderProps {
  locationName: string;
  unit: 'C' | 'F';
  onToggleUnit: () => void;
  onRefresh: () => void;
  onLocationSelect?: (location: Location) => void;
  size?: 'large' | 'medium' | 'small' | 'mini' | 'wide-small' | 'wide-medium' | 'micro';
  lang: Language;
}

export const Header: React.FC<HeaderProps> = ({ 
  locationName, 
  unit, 
  onToggleUnit, 
  onRefresh, 
  onLocationSelect,
  size = 'large',
  lang
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        // Pass the current language to search
        const results = await searchLocations(searchQuery, lang);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, lang]);

  const handleSelectLocation = (result: GeocodingResult) => {
    if (onLocationSelect) {
      onLocationSelect({
        name: result.name,
        lat: result.latitude,
        lon: result.longitude,
        country: result.country,
        admin1: result.admin1
      });
    }
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  // For mini, micro and wide variants, we hide the external header because the location is shown inside the card.
  if (size === 'mini' || size === 'wide-small' || size === 'wide-medium' || size === 'micro') {
    return null; 
  }

  const isCompact = size === 'small';

  return (
    <div className={`flex flex-col w-full relative z-20 ${isCompact ? 'mb-2' : 'mb-6'}`}>
      {/* Title with engraved text effect */}
      <div className={`flex justify-center ${isCompact ? 'mb-0' : 'mb-6'}`}>
        <h1 className={`text-[#666] font-medium tracking-wide drop-shadow-[0_1px_0_rgba(255,255,255,0.9)] truncate px-2
          ${isCompact ? 'text-base' : 'text-xl'}
        `}>
          {locationName}
        </h1>
      </div>

      {/* Controls - Hide for small/mini */}
      {!isCompact && (
        <div className="flex items-center justify-between relative">
          
          {/* Unit Toggle Switch */}
          <div className="flex items-center gap-3 select-none">
            <span 
              className={`text-sm font-bold transition-colors cursor-pointer drop-shadow-[0_1px_0_rgba(255,255,255,0.8)] ${unit === 'C' ? 'text-gray-600' : 'text-gray-400'}`}
              onClick={() => unit === 'F' && onToggleUnit()}
            >
              °C
            </span>
            
            <div 
              onClick={onToggleUnit}
              className="relative w-14 h-8 bg-[#e0e0e0] rounded-full p-1 cursor-pointer 
                shadow-[inset_0_3px_6px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(0,0,0,0.2),0_1px_0_rgba(255,255,255,0.8)] 
                flex items-center border-t border-black/5"
            >
               <div 
                 className={`
                   w-6 h-6 bg-gradient-to-b from-[#fefefe] to-[#f0f0f0] rounded-full 
                   shadow-[0_2px_4px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,1)] 
                   border border-black/5
                   transform transition-transform duration-300 ease-out z-10
                   flex items-center justify-center
                   ${unit === 'F' ? 'translate-x-[1.5rem]' : 'translate-x-0'}
                 `}
               >
                 <div className="w-1.5 h-1.5 rounded-full bg-[#d0d0d0] shadow-[inset_0_1px_2px_rgba(0,0,0,0.3),0_1px_0_rgba(255,255,255,0.8)]"></div>
               </div>
            </div>

            <span 
              className={`text-sm font-bold transition-colors cursor-pointer drop-shadow-[0_1px_0_rgba(255,255,255,0.8)] ${unit === 'F' ? 'text-gray-600' : 'text-gray-400'}`}
              onClick={() => unit === 'C' && onToggleUnit()}
            >
              °F
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 relative" ref={searchRef}>
            {/* Refresh Button */}
            <button 
              onClick={onRefresh}
              className="w-10 h-10 bg-gradient-to-b from-[#fafafa] to-[#ededed] rounded-full 
                shadow-[0_2px_5px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,1)_inset,inset_0_0_2px_rgba(255,255,255,0.5)] 
                border border-black/5 
                active:bg-[#e6e6e6]
                active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.15),0_1px_0_rgba(255,255,255,0.5)] 
                active:border-transparent
                flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all active:translate-y-[1px]"
            >
              <RefreshCcw size={18} className="drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]" />
            </button>

            {/* Switch/Search Button */}
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`w-10 h-10 bg-gradient-to-b from-[#fafafa] to-[#ededed] rounded-full 
                shadow-[0_2px_5px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,1)_inset,inset_0_0_2px_rgba(255,255,255,0.5)] 
                border border-black/5 
                active:bg-[#e6e6e6]
                active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.15),0_1px_0_rgba(255,255,255,0.5)] 
                active:border-transparent
                flex items-center justify-center transition-all active:translate-y-[1px]
                ${isSearchOpen ? 'text-blue-500' : 'text-gray-500 hover:text-gray-700'}
                `}
            >
              <ArrowRightLeft size={18} className="drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]" />
            </button>

            {/* Search Bubble Popover */}
            {isSearchOpen && (
              <div className="absolute top-12 right-0 w-72 bg-[#fdfdfd] rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.05)] p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Triangle Arrow */}
                <div className="absolute -top-2 right-3 w-4 h-4 bg-[#fdfdfd] rotate-45 border-l border-t border-black/5"></div>
                
                <div className="relative mb-2">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="w-full bg-[#f0f0f0] text-sm text-[#333] pl-9 pr-3 py-2 rounded-lg 
                      shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)] 
                      focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:bg-white transition-all
                      placeholder:text-gray-400"
                    autoFocus
                  />
                </div>

                <div className="max-h-60 overflow-y-auto no-scrollbar">
                  {isSearching ? (
                    <div className="p-4 text-center text-xs text-gray-400">{t.searching}</div>
                  ) : searchResults.length > 0 ? (
                    <ul className="flex flex-col gap-1">
                      {searchResults.map((result) => (
                        <li 
                          key={result.id}
                          onClick={() => handleSelectLocation(result)}
                          className="px-3 py-2 rounded-lg hover:bg-[#efefef] cursor-pointer flex items-center gap-3 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:shadow-sm transition-all">
                             <MapPin size={14} />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium text-[#333] truncate">{result.name}</span>
                            <span className="text-xs text-gray-400 truncate">
                              {[result.admin1, result.country].filter(Boolean).join(', ')}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : searchQuery.length >= 2 ? (
                     <div className="p-4 text-center text-xs text-gray-400">{t.noResults}</div>
                  ) : (
                    <div className="p-2 text-center text-xs text-gray-400">{t.enterLocation}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
