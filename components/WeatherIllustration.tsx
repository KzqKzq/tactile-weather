import React from 'react';

interface WeatherIllustrationProps {
  code: number;
  isDay: number;
  animated: boolean;
  className?: string;
  size?: number;
}

export const WeatherIllustration: React.FC<WeatherIllustrationProps> = ({ code, isDay, animated, className, size = 100 }) => {
  // Color Palette - Low Saturation / Monochrome + Subtle Accents
  const colors = {
    stroke: "#444444", // Soft Black
    fillWhite: "#FFFFFF",
    fillGrayLight: "#F5F5F5",
    fillGrayMedium: "#E5E5E5",
    accentSun: "#FEF9C3", // Pale Yellow (yellow-100)
    accentRain: "#E0F2FE", // Pale Blue (sky-100)
    accentThunder: "#FEF3C7", // Pale Amber
  };

  const strokeWidth = 2.5;
  const strokeLinecap = "round" as const;
  const strokeLinejoin = "round" as const;

  // Animation classes
  const animSpin = animated ? "animate-cartoon-spin" : "";
  const animFloat = animated ? "animate-cartoon-float" : "";
  const animRain1 = animated ? "animate-cartoon-rain-1" : "";
  const animRain2 = animated ? "animate-cartoon-rain-2" : "";
  const animRain3 = animated ? "animate-cartoon-rain-3" : "";
  const animSnow1 = animated ? "animate-cartoon-snow-1" : "";
  const animSnow2 = animated ? "animate-cartoon-snow-2" : "";
  const animSnow3 = animated ? "animate-cartoon-snow-3" : "";
  const animPulse = animated ? "animate-cartoon-pulse" : "";

  // Helper Elements
  const SunRays = () => (
    <g className={`origin-center ${animSpin}`}>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
        <line
          key={i}
          x1="50" y1="22" x2="50" y2="14"
          transform={`rotate(${deg} 50 50)`}
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap={strokeLinecap}
        />
      ))}
    </g>
  );

  const SunBody = ({ withFace = true }) => (
    <g>
       <circle cx="50" cy="50" r="20" fill={colors.accentSun} stroke={colors.stroke} strokeWidth={strokeWidth} />
       {withFace && (
         <>
           <circle cx="44" cy="48" r="2" fill={colors.stroke} />
           <circle cx="56" cy="48" r="2" fill={colors.stroke} />
           <path d="M 46 54 Q 50 58 54 54" fill="none" stroke={colors.stroke} strokeWidth={2} strokeLinecap={strokeLinecap} />
         </>
       )}
    </g>
  );

  const CloudShape = ({ x = 0, y = 0, scale = 1, fill = colors.fillWhite }) => (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <path
        d="M 25 60 A 15 15 0 0 1 25 30 A 20 20 0 0 1 65 30 A 15 15 0 0 1 65 60 Z"
        fill={fill}
        stroke={colors.stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin={strokeLinejoin}
      />
    </g>
  );

  const renderContent = () => {
    // 0, 1: Sunny / Clear
    if (code === 0 || code === 1) {
      if (!isDay) {
        // Moon
        return (
          <g className={animFloat}>
             <path 
               d="M 50 20 A 30 30 0 1 0 50 80 A 25 25 0 1 1 50 20" 
               fill={colors.fillGrayLight} 
               stroke={colors.stroke} 
               strokeWidth={strokeWidth} 
               strokeLinejoin={strokeLinejoin}
             />
             {/* Sleepy Face */}
             <path d="M 40 50 Q 44 50 48 50" stroke={colors.stroke} strokeWidth={2} fill="none" />
             <path d="M 40 55 Q 45 60 50 55" stroke={colors.stroke} strokeWidth={2} fill="none" />
             {/* Zzz */}
             {animated && (
               <g className="animate-pulse">
                 <path d="M 75 30 L 85 30 L 75 40 L 85 40" stroke={colors.stroke} strokeWidth={1.5} fill="none" opacity="0.5" transform="scale(0.8)" />
               </g>
             )}
          </g>
        );
      }
      return (
        <g>
          <SunRays />
          <SunBody />
        </g>
      );
    }

    // 2: Partly Cloudy
    if (code === 2) {
      return (
        <g>
          <g transform="translate(15, -15) scale(0.8)">
            <SunRays />
            <SunBody withFace={false} />
          </g>
          <g className={animFloat}>
            <CloudShape x={10} y={10} />
          </g>
        </g>
      );
    }

    // 3, 45, 48: Cloudy / Fog
    if (code === 3 || code === 45 || code === 48) {
      return (
        <g className={animFloat}>
          <CloudShape x={20} y={-10} scale={0.9} fill={colors.fillGrayMedium} />
          <CloudShape x={5} y={10} />
        </g>
      );
    }

    // Rain (51-67, 80-82)
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
      return (
        <g>
          <g className={animFloat}>
            <CloudShape x={10} y={0} />
          </g>
          <g transform="translate(10, 65)">
             <line x1="30" y1="0" x2="30" y2="8" stroke={colors.accentRain} strokeWidth={3} strokeLinecap="round" className={animRain1} />
             <line x1="50" y1="0" x2="50" y2="8" stroke={colors.accentRain} strokeWidth={3} strokeLinecap="round" className={animRain2} />
             <line x1="70" y1="0" x2="70" y2="8" stroke={colors.accentRain} strokeWidth={3} strokeLinecap="round" className={animRain3} />
          </g>
        </g>
      );
    }

    // Snow (71-77, 85-86)
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
       return (
        <g>
          <g className={animFloat}>
            <CloudShape x={10} y={0} fill={colors.fillWhite} />
          </g>
          <g transform="translate(10, 65)">
             <circle cx="30" cy="4" r="3" fill={colors.fillGrayMedium} className={animSnow1} />
             <circle cx="50" cy="4" r="3" fill={colors.fillGrayMedium} className={animSnow2} />
             <circle cx="70" cy="4" r="3" fill={colors.fillGrayMedium} className={animSnow3} />
          </g>
        </g>
       );
    }

    // Thunder (95-99)
    if (code >= 95) {
      return (
        <g>
           <g className={animFloat}>
             <CloudShape x={10} y={0} fill={colors.fillGrayMedium} />
           </g>
           <g className={animated ? "animate-pulse" : ""}>
             <path 
               d="M 55 60 L 45 80 L 60 80 L 50 100" 
               stroke={colors.stroke} 
               strokeWidth={strokeWidth} 
               fill={colors.accentThunder} 
               strokeLinejoin={strokeLinejoin}
             />
           </g>
        </g>
      );
    }

    // Default Sun
    return (
       <g>
         <SunRays />
         <SunBody />
       </g>
    );
  };

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={`overflow-visible ${className}`}
      style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.05))' }}
    >
      {renderContent()}
    </svg>
  );
};