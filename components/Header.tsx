
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
        <h1 className={`text-[var(--twx-text-secondary)] font-medium tracking-wide drop-shadow-[var(--twx-text-shadow)] truncate px-2
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
              className={`text-sm font-bold transition-colors cursor-pointer drop-shadow-[var(--twx-text-shadow)] ${unit === 'C' ? 'text-[var(--twx-text-secondary)]' : 'text-[var(--twx-text-muted)]'}`}
              onClick={() => unit === 'F' && onToggleUnit()}
            >
              °C
            </span>
            
            <div 
              onClick={onToggleUnit}
              className="relative w-14 h-8 bg-[var(--twx-bg-switch)] rounded-full p-1 cursor-pointer 
                shadow-[inset_0_3px_6px_var(--twx-shadow-medium),inset_0_1px_2px_var(--twx-shadow-medium),0_1px_0_var(--twx-highlight-strong)] 
                flex items-center border-t border-[var(--twx-border-light)]"
            >
               <div 
                 className={`
                   w-6 h-6 bg-gradient-to-b from-[var(--twx-bg-switch-knob)] to-[var(--twx-bg-input)] rounded-full 
                   shadow-[0_2px_4px_var(--twx-shadow-subtle),0_4px_8px_var(--twx-shadow-subtle),inset_0_1px_0_var(--twx-highlight-strong)] 
                   border border-[var(--twx-border-light)]
                   transform transition-transform duration-300 ease-out z-10
                   flex items-center justify-center
                   ${unit === 'F' ? 'translate-x-[1.5rem]' : 'translate-x-0'}
                 `}
               >
                 <div className="w-1.5 h-1.5 rounded-full bg-[var(--twx-divider)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.3),0_1px_0_var(--twx-highlight-strong)]"></div>
               </div>
            </div>

            <span 
              className={`text-sm font-bold transition-colors cursor-pointer drop-shadow-[var(--twx-text-shadow)] ${unit === 'F' ? 'text-[var(--twx-text-secondary)]' : 'text-[var(--twx-text-muted)]'}`}
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
              className="w-10 h-10 bg-gradient-to-b from-[var(--twx-bg-button)] to-[var(--twx-bg-button-hover)] rounded-full 
                shadow-[0_2px_5px_var(--twx-shadow-subtle),0_1px_0_var(--twx-highlight-strong)_inset,inset_0_0_2px_var(--twx-highlight)] 
                border border-[var(--twx-border-light)] 
                active:bg-[var(--twx-bg-item-hover)]
                active:shadow-[inset_0_2px_4px_var(--twx-shadow-medium),0_1px_0_var(--twx-highlight)] 
                active:border-transparent
                flex items-center justify-center text-[var(--twx-text-secondary)] hover:text-[var(--twx-text-primary)] transition-all active:translate-y-[1px]"
            >
              <RefreshCcw size={18} className="drop-shadow-[var(--twx-text-shadow)]" />
            </button>

            {/* Switch/Search Button */}
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`w-10 h-10 bg-gradient-to-b from-[var(--twx-bg-button)] to-[var(--twx-bg-button-hover)] rounded-full 
                shadow-[0_2px_5px_var(--twx-shadow-subtle),0_1px_0_var(--twx-highlight-strong)_inset,inset_0_0_2px_var(--twx-highlight)] 
                border border-[var(--twx-border-light)] 
                active:bg-[var(--twx-bg-item-hover)]
                active:shadow-[inset_0_2px_4px_var(--twx-shadow-medium),0_1px_0_var(--twx-highlight)] 
                active:border-transparent
                flex items-center justify-center transition-all active:translate-y-[1px]
                ${isSearchOpen ? 'text-[var(--twx-accent-success)]' : 'text-[var(--twx-text-secondary)] hover:text-[var(--twx-text-primary)]'}
                `}
            >
              <ArrowRightLeft size={18} className="drop-shadow-[var(--twx-text-shadow)]" />
            </button>

            {/* Search Bubble Popover */}
            {isSearchOpen && (
              <div className="absolute top-12 right-0 w-72 bg-[var(--twx-bg-panel)] rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.05)] p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Triangle Arrow */}
                <div className="absolute -top-2 right-3 w-4 h-4 bg-[var(--twx-bg-panel)] rotate-45 border-l border-t border-[var(--twx-border-light)]"></div>
                
                <div className="relative mb-2">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--twx-text-muted)]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="w-full bg-[var(--twx-bg-input)] text-sm text-[var(--twx-text-primary)] pl-9 pr-3 py-2 rounded-lg 
                      shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)] 
                      focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:bg-white transition-all
                      placeholder:text-[var(--twx-text-muted)]"
                    autoFocus
                  />
                </div>

                <div className="max-h-60 overflow-y-auto no-scrollbar">
                  {isSearching ? (
                    <div className="p-4 text-center text-xs text-[var(--twx-text-muted)]">{t.searching}</div>
                  ) : searchResults.length > 0 ? (
                    <ul className="flex flex-col gap-1">
                      {searchResults.map((result) => (
                        <li 
                          key={result.id}
                          onClick={() => handleSelectLocation(result)}
                          className="px-3 py-2 rounded-lg hover:bg-[var(--twx-bg-item-hover)] cursor-pointer flex items-center gap-3 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-full bg-[var(--twx-bg-input)] flex items-center justify-center text-[var(--twx-text-muted)] group-hover:bg-[var(--twx-bg-widget)] group-hover:shadow-sm transition-all">
                             <MapPin size={14} />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium text-[var(--twx-text-primary)] truncate">{result.name}</span>
                            <span className="text-xs text-[var(--twx-text-muted)] truncate">
                              {[result.admin1, result.country].filter(Boolean).join(', ')}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : searchQuery.length >= 2 ? (
                     <div className="p-4 text-center text-xs text-[var(--twx-text-muted)]">{t.noResults}</div>
                  ) : (
                    <div className="p-2 text-center text-xs text-[var(--twx-text-muted)]">{t.enterLocation}</div>
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
