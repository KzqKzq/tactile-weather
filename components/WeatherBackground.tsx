import React, { useMemo } from 'react';

interface WeatherBackgroundProps {
  code: number;
  isDay: number;
  className?: string;
}

export const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ code, isDay, className }) => {
  // Helpers to categorize weather
  const isClear = code === 0 || code === 1;
  const isCloudy = code === 2 || code === 3;
  const isFog = code === 45 || code === 48;
  const isRain = (code >= 51 && code <= 67) || (code >= 80 && code <= 82);
  const isSnow = (code >= 71 && code <= 77) || code === 85 || code === 86;
  const isThunder = code >= 95;

  // Generate random positions for rain/snow particles
  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 2}s`,
      animationDuration: `${0.8 + Math.random() * 0.5}s`,
      opacity: 0.3 + Math.random() * 0.4,
    }));
  }, []);

  // --- BACKGROUND GRADIENTS ---
  let bgGradient = '';
  
  if (isDay) {
    if (isClear) bgGradient = 'bg-gradient-to-br from-[#4facfe] to-[#00f2fe]'; // Bright Blue
    else if (isCloudy) bgGradient = 'bg-gradient-to-br from-[#89f7fe] to-[#66a6ff]'; // Cloudy Blue
    else if (isRain || isThunder) bgGradient = 'bg-gradient-to-br from-[#3a6186] to-[#89253e]'; // Stormy Dark
    else if (isFog) bgGradient = 'bg-gradient-to-br from-[#bdc3c7] to-[#2c3e50]'; // Foggy Grey
    else if (isSnow) bgGradient = 'bg-gradient-to-b from-[#e6dada] to-[#274046]'; // Cold Grey/Blue
    else bgGradient = 'bg-gradient-to-br from-[#4facfe] to-[#00f2fe]';
  } else {
    // Night
    if (isClear) bgGradient = 'bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]'; // Deep Night
    else if (isCloudy) bgGradient = 'bg-gradient-to-br from-[#232526] to-[#414345]'; // Cloudy Night
    else bgGradient = 'bg-gradient-to-br from-[#000428] to-[#004e92]'; // Generic Night
  }

  // Override specific "storm" look for visual drama
  if (isRain && !isDay) bgGradient = 'bg-gradient-to-br from-[#243949] to-[#517fa4]';
  
  // --- ELEMENT RENDERING ---

  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden ${bgGradient} ${className || ''} transition-all duration-1000`}>
      
      {/* 1. SUNNY DAY EFFECTS */}
      {isDay && isClear && (
        <>
          {/* Rotating Sun Rays */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-yellow-300 rounded-full blur-[60px] opacity-60 animate-pulse-glow"></div>
          <div className="absolute top-[-20%] right-[-20%] w-[140%] h-[140%] opacity-30 animate-sun-rotate origin-center pointer-events-none">
             <div className="absolute top-1/2 left-1/2 w-full h-2 bg-gradient-to-r from-transparent via-white to-transparent transform -translate-x-1/2 -translate-y-1/2 rotate-0"></div>
             <div className="absolute top-1/2 left-1/2 w-full h-2 bg-gradient-to-r from-transparent via-white to-transparent transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
             <div className="absolute top-1/2 left-1/2 w-full h-2 bg-gradient-to-r from-transparent via-white to-transparent transform -translate-x-1/2 -translate-y-1/2 rotate-90"></div>
             <div className="absolute top-1/2 left-1/2 w-full h-2 bg-gradient-to-r from-transparent via-white to-transparent transform -translate-x-1/2 -translate-y-1/2 rotate-135"></div>
          </div>
          {/* Lens Flare / Glare */}
          <div className="absolute top-10 right-20 w-8 h-8 bg-white rounded-full blur-md opacity-40"></div>
        </>
      )}

      {/* 2. NIGHT MOON/STAR EFFECTS */}
      {!isDay && isClear && (
        <>
          <div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-[#fdfbf7] shadow-[0_0_40px_rgba(255,255,255,0.4)] opacity-90"></div>
          <div className="absolute top-4 right-20 w-1 h-1 bg-white rounded-full opacity-80 animate-pulse"></div>
          <div className="absolute top-20 right-40 w-0.5 h-0.5 bg-white rounded-full opacity-60"></div>
          <div className="absolute top-12 left-12 w-1 h-1 bg-white rounded-full opacity-50 animate-pulse delay-700"></div>
        </>
      )}

      {/* 3. CLOUDS (Shared by Cloudy, Rain, Snow) */}
      {(isCloudy || isRain || isSnow || isThunder || isFog) && (
        <>
           {/* Back Layer Cloud */}
           <div className={`absolute -top-10 -left-10 w-64 h-64 rounded-full blur-[50px] animate-float-cloud-slow
             ${isDay ? 'bg-white opacity-40' : 'bg-gray-500 opacity-20'}`}></div>
           
           {/* Front Layer Cloud */}
           <div className={`absolute top-10 -right-20 w-80 h-80 rounded-full blur-[60px] animate-float-cloud
             ${isDay ? 'bg-white opacity-30' : 'bg-gray-400 opacity-10'}`}></div>
        </>
      )}

      {/* 4. RAIN PARTICLES */}
      {(isRain || isThunder) && (
        <div className="absolute inset-0 w-full h-full">
           {particles.map((p, i) => (
             <div 
               key={i} 
               className="absolute w-[1px] h-8 bg-gradient-to-b from-transparent to-white rounded-full"
               style={{
                 left: p.left,
                 top: '-20px',
                 animation: `rain-drop ${p.animationDuration} linear infinite`,
                 animationDelay: p.animationDelay,
                 opacity: p.opacity
               }}
             />
           ))}
        </div>
      )}

      {/* 5. SNOW PARTICLES */}
      {isSnow && (
        <div className="absolute inset-0 w-full h-full">
           {particles.map((p, i) => (
             <div 
               key={i} 
               className="absolute w-2 h-2 bg-white rounded-full blur-[1px]"
               style={{
                 left: p.left,
                 top: '-20px',
                 animation: `snow-fall ${parseFloat(p.animationDuration) * 3}s linear infinite`,
                 animationDelay: p.animationDelay,
                 opacity: p.opacity
               }}
             />
           ))}
        </div>
      )}

      {/* 6. THUNDER */}
      {isThunder && (
         <div className="absolute inset-0 bg-white animate-lightning pointer-events-none mix-blend-overlay"></div>
      )}

      {/* 7. FOG */}
      {isFog && (
         <div className="absolute inset-0 bg-gradient-to-t from-gray-200/30 to-transparent animate-pulse-glow"></div>
      )}

    </div>
  );
};