import React from 'react';
import { Sparkles, Activity, Film, Zap, Sunset, Gem, Image, Droplet, Snowflake, Moon } from 'lucide-react';
import { themes } from '../config/themeConfig';

const iconMap = {
  minimal: Sparkles,
  techno: Activity,
  analog: Film,
  cyberpunk: Zap,
  golden: Sunset,
  vogue: Gem,
  polaroid: Image,
  crimson: Droplet,
  arctic: Snowflake,
  grain: Moon
};

const ThemeSelector = ({ currentTheme, onThemeChange }) => {
  return (
    <div className="flex gap-4 p-2 w-full overflow-x-auto no-scrollbar items-center justify-start md:justify-center">
      {themes.map((theme) => {
        const IconComponent = iconMap[theme.id] || Sparkles;
        const isActive = currentTheme.id === theme.id;
        
        return (
          <button
            key={theme.id}
            onClick={() => onThemeChange(theme)}
            className={`
              group relative flex flex-col items-center justify-center p-3 rounded-2xl 
              transition-all duration-300 ease-out flex-shrink-0 min-w-[70px]
              ${isActive 
                ? 'bg-white/10 border-white/40 scale-110 shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
                : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 hover:scale-105'
              }
              border backdrop-blur-md
            `}
          >
            {/* The Icon */}
            <div className={`
               mb-1 transition-colors duration-300
               ${isActive ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'text-white/40 group-hover:text-white/80'}
            `}>
              <IconComponent strokeWidth={1.5} size={24} />
            </div>

            {/* Label (Small text below icon) */}
            <span className={`
               text-[10px] font-medium tracking-wide uppercase transition-colors duration-300
               ${isActive ? 'text-white/90' : 'text-white/30 group-hover:text-white/60'}
            `}>
              {theme.name.split(' ')[0]} {/* Show first word only for cleanliness */}
            </span>

            {/* Active Indicator Dot */}
            {isActive && (
              <div className="absolute -bottom-1 w-1 h-1 bg-white rounded-full shadow-[0_0_5px_white]" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ThemeSelector;
