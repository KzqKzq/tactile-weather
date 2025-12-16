import React from 'react';
import { RefreshCcw, Plus, Menu } from 'lucide-react';

interface HeaderProps {
  locationName: string;
  unit: 'C' | 'F';
  onToggleUnit: () => void;
  onRefresh: () => void;
  size?: 'large' | 'medium' | 'small' | 'mini';
}

export const Header: React.FC<HeaderProps> = ({ locationName, unit, onToggleUnit, onRefresh, size = 'large' }) => {
  // For mini, we might show a very minimal header or none. 
  // For small, we show just the name.
  
  if (size === 'mini') {
    return null; // Mini is too small for a header
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
        <div className="flex items-center justify-between">
          
          {/* Unit Toggle Switch - Labels outside */}
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
               {/* The Knob */}
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
                 {/* Tiny dimple on the knob */}
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
          <div className="flex gap-4">
            {[
              { Icon: RefreshCcw, onClick: onRefresh },
              { Icon: Plus, onClick: () => {} },
              { Icon: Menu, onClick: () => {} }
            ].map(({ Icon, onClick }, idx) => (
              <button 
                key={idx}
                onClick={onClick}
                className="w-10 h-10 bg-gradient-to-b from-[#fafafa] to-[#ededed] rounded-full 
                  shadow-[0_2px_5px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,1)_inset,inset_0_0_2px_rgba(255,255,255,0.5)] 
                  border border-black/5 
                  active:bg-[#e6e6e6]
                  active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.15),0_1px_0_rgba(255,255,255,0.5)] 
                  active:border-transparent
                  flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all active:translate-y-[1px]"
              >
                <Icon size={18} className="drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};