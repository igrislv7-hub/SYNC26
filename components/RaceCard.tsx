import React, { useState } from 'react';
import { F1Race } from '../types';
import TrackVisualizer from './Track3D'; 
import { downloadICS, generateGoogleCalendarUrl, formatTimeIST, formatTimeLocal, formatWeekendRange } from '../utils/calendarUtils';
import { getTrackPath } from '../utils/trackData';
import { MapPin, Clock, Zap, CalendarPlus, Download, Users, ChevronDown, ChevronUp, Flag, Maximize2, X } from 'lucide-react';
import { OFFICIAL_GRID_2026 } from '../services/geminiService';

// Logo Mapping for 2026 Grid
const TEAM_LOGO_MAP: Record<string, string> = {
  "mclaren": "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg",
  "mercedes": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg",
  "red bull": "https://upload.wikimedia.org/wikipedia/en/c/c4/Red_Bull_Racing_logo.svg",
  "ferrari": "https://upload.wikimedia.org/wikipedia/en/c/c0/Scuderia_Ferrari_Logo.svg",
  "williams": "https://upload.wikimedia.org/wikipedia/commons/e/ec/Williams_Racing_2020_logo.svg",
  "aston": "https://upload.wikimedia.org/wikipedia/en/b/bd/Aston_Martin_Lagonda_brand_logo.svg",
  "audi": "https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg",
  "cadillac": "https://upload.wikimedia.org/wikipedia/commons/a/ae/Cadillac_logo_2014.svg",
  "alpine": "https://upload.wikimedia.org/wikipedia/commons/7/7e/Alpine_F1_Team_Logo.svg",
  "visa": "https://upload.wikimedia.org/wikipedia/en/2/2b/Visa_Cash_App_RB_Formula_One_Team_logo.svg",
  "haas": "https://upload.wikimedia.org/wikipedia/commons/d/d4/Haas_F1_Team_logo.svg"
};

const getTeamLogo = (teamName: string): string | null => {
  const lower = teamName.toLowerCase();
  for (const [key, url] of Object.entries(TEAM_LOGO_MAP)) {
    if (lower.includes(key)) return url;
  }
  return null;
};

interface RaceCardProps {
  race: F1Race;
}

const RaceCard: React.FC<RaceCardProps> = ({ race }) => {
  const [showGrid, setShowGrid] = useState(false);
  const [isTrackExpanded, setIsTrackExpanded] = useState(false);
  
  const fallbackPath = getTrackPath(race.circuitName, race.grandPrixName);
  const istTime = formatTimeIST(race.date, race.time);
  const localTime = formatTimeLocal(race.date, race.time, race.timezoneId);
  const weekendRange = formatWeekendRange(race.weekendStartDate, race.weekendEndDate);
  const googleUrl = generateGoogleCalendarUrl(race);

  // Helper to find driver details for Home Race badge
  const getHomeHeroDetails = (name: string) => {
    // Try to match specific driver first
    for (const team of OFFICIAL_GRID_2026) {
       // Check exact match or partial match
       const driver = team.drivers.find(d => 
         d.name === name || 
         d.name.toLowerCase() === name.toLowerCase() ||
         d.name.includes(name) ||
         name.includes(d.name)
       );
       
       if (driver) return { type: 'driver' as const, ...driver };
       
       // Check team match
       if (team.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(team.name.toLowerCase())) {
         return { type: 'team' as const, name: team.name };
       }
    }
    return { type: 'unknown' as const, name };
  };

  return (
    <>
      <div className="group bg-f1-dark border-t-4 border-f1-red hover:border-white transition-colors duration-300 flex flex-col relative overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] h-[550px]">
        
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-f1-red/5 skew-x-12 transform translate-x-10 -translate-y-10 rounded-full blur-2xl group-hover:bg-f1-red/10 transition-colors"></div>

        {/* Header */}
        <div className="px-5 pt-5 pb-2 flex justify-between items-start z-10 shrink-0">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
               <span className="bg-f1-red text-white text-[10px] font-black px-1.5 py-0.5 -skew-x-12 inline-block">
                  <span className="skew-x-12 block">R{race.round}</span>
               </span>
               {race.isSprintWeekend && (
                 <span className="bg-yellow-400 text-black text-[10px] font-black px-1.5 py-0.5 uppercase tracking-tighter flex items-center gap-1">
                   <Zap size={10} fill="black" /> SPRINT
                 </span>
               )}
            </div>
            <h3 className="text-2xl font-black text-white leading-none uppercase italic tracking-tight truncate max-w-[240px]" title={race.grandPrixName}>
              {race.grandPrixName.replace("Grand Prix", "GP")}
            </h3>
          </div>
          <div className="text-right">
             <button 
               onClick={() => setShowGrid(!showGrid)}
               className="flex flex-col items-end group/btn"
               title="Toggle Grid Info"
             >
               <span className={`block text-3xl font-bold transition-colors font-mono ${showGrid ? 'text-white' : 'text-f1-red/20 group-hover/btn:text-f1-red'}`}>
                 {String(race.round).padStart(2, '0')}
               </span>
               <span className="text-[10px] uppercase text-gray-500 flex items-center gap-1 group-hover/btn:text-white transition-colors">
                 {showGrid ? <ChevronUp size={10}/> : <Users size={10} />}
                 {showGrid ? 'Hide Grid' : 'Show Grid'}
               </span>
             </button>
          </div>
        </div>

        {/* Content Area - Toggles between Track and Grid */}
        <div className="relative flex-grow overflow-hidden w-full">
          
          {/* VIEW 1: Regular Track Info */}
          <div 
            className={`absolute inset-0 w-full h-full flex flex-col transition-all duration-500 ease-in-out transform ${
              showGrid 
                ? 'opacity-0 scale-95 blur-sm pointer-events-none' 
                : 'opacity-100 scale-100 blur-0 z-10'
            }`}
          >
            {/* Track Visual - Tappable Preview */}
            <div 
              className="w-full px-0 py-2 shrink-0 relative group/track cursor-pointer" 
              onClick={() => setIsTrackExpanded(true)}
              title="Click to Expand Map"
            >
              <TrackVisualizer 
                imageUrl={race.trackImageUrl} 
                circuitName={race.circuitName} 
                fallbackPath={fallbackPath}
                className="h-48"
              />
              {/* Expand Overlay Hint */}
              <div className="absolute top-4 right-4 bg-f1-red/90 text-white p-1.5 rounded-sm opacity-0 group-hover/track:opacity-100 transition-opacity shadow-lg backdrop-blur-sm z-20">
                 <Maximize2 size={16} />
              </div>
            </div>

            {/* Info Grid */}
            <div className="px-5 py-4 space-y-4 relative overflow-y-auto scrollbar-none">
              
              {/* Home Race Section (Placed below Map, before Details) */}
              {race.homeRaceFor && race.homeRaceFor.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-2 pb-3 border-b border-white/10">
                   <div className="flex items-center gap-1 text-f1-red">
                     <Flag className="w-3 h-3 fill-current" />
                     <span className="text-[10px] uppercase font-bold tracking-widest">Home Race</span>
                   </div>
                   
                   <div className="flex flex-wrap gap-2">
                      {race.homeRaceFor.map((name, idx) => {
                         const hero = getHomeHeroDetails(name);
                         return (
                           <div key={idx} className="flex items-center bg-f1-carbon border border-gray-700 rounded-sm overflow-hidden shadow-sm group/badge hover:border-f1-red transition-colors">
                              {hero.type === 'driver' ? (
                                  <>
                                    <div className="bg-white group-hover/badge:bg-f1-red group-hover/badge:text-white transition-colors text-black text-[10px] font-black px-1.5 py-0.5 min-w-[20px] text-center italic">
                                      {hero.number}
                                    </div>
                                    <div className="px-1.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wide">
                                      {hero.name?.split(' ').pop()}
                                    </div>
                                  </>
                              ) : (
                                  <div className="px-2 py-0.5 text-[10px] font-bold text-gray-300 uppercase tracking-wide">
                                      {name}
                                  </div>
                              )}
                           </div>
                         )
                      })}
                   </div>
                </div>
              )}
              
              {/* Weekend Date Range */}
              <div className="flex items-start gap-3 border-l-2 border-f1-gray pl-3">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-0.5">Race Weekend</p>
                  <p className="text-white font-bold text-lg leading-none">
                    {weekendRange}
                  </p>
                </div>
              </div>

              {/* Timings */}
              <div className="grid grid-cols-2 gap-4 bg-white/5 p-3 rounded border border-white/10">
                <div>
                  <div className="flex items-center gap-1 text-xs text-f1-red font-bold uppercase mb-1">
                    <Clock size={12} /> Local ({race.timezoneId?.split('/')[1] || 'Local'})
                  </div>
                  <div className="text-xl font-mono text-white">{localTime}</div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs text-blue-400 font-bold uppercase mb-1">
                    <Clock size={12} /> IST (India)
                  </div>
                  <div className="text-xl font-mono text-white">{istTime}</div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="uppercase font-semibold tracking-wide truncate">{race.city}, {race.country}</span>
              </div>

            </div>
          </div>

          {/* VIEW 2: 2026 Grid Info */}
          <div 
            className={`absolute inset-0 w-full h-full flex flex-col bg-f1-black/95 transition-all duration-500 ease-in-out transform ${
              showGrid 
                ? 'opacity-100 scale-100 blur-0 z-10' 
                : 'opacity-0 scale-105 blur-sm pointer-events-none'
            }`}
          >
            <div className="p-4 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-f1-red scrollbar-track-f1-dark">
              <h4 className="text-f1-red font-black uppercase tracking-widest text-sm mb-4 border-b border-gray-800 pb-2 flex items-center gap-2">
                 <Users size={16} /> 2026 Driver Lineup
              </h4>
              
              <div className="space-y-3">
                 {OFFICIAL_GRID_2026.map((team, idx) => {
                   const logoUrl = getTeamLogo(team.name);
                   return (
                     <div key={idx} className="bg-white/5 p-2 rounded border-l-2 border-gray-600 hover:border-f1-red transition-colors">
                        <div className="flex justify-between items-center mb-1">
                           <div className="flex items-center gap-2">
                             {logoUrl && (
                               <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center p-0.5 shrink-0">
                                  <img src={logoUrl} alt={team.name} className="max-w-full max-h-full object-contain" />
                               </div>
                             )}
                             <span className="font-bold text-xs uppercase text-white tracking-wide">{team.name}</span>
                           </div>
                           <span className="text-[9px] text-gray-500 uppercase shrink-0 ml-2">{team.engine}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                           {team.drivers.map((driver, dIdx) => (
                              <div key={dIdx} className="flex items-center gap-2">
                                 <span className="w-5 h-5 flex items-center justify-center bg-gray-800 text-[10px] font-mono font-bold text-f1-red rounded">
                                   {driver.number}
                                 </span>
                                 <span className="text-xs text-gray-300 truncate">{driver.name}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                   );
                 })}
              </div>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="mt-auto grid grid-cols-2 border-t border-gray-800 shrink-0 z-20 bg-f1-dark">
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-f1-red text-white hover:bg-white hover:text-f1-red font-black text-xs uppercase py-4 flex items-center justify-center gap-2 transition-colors duration-200"
          >
            <CalendarPlus className="w-4 h-4" />
            <span>Google Cal</span>
          </a>
          <button
            onClick={() => downloadICS(race)}
            className="bg-f1-carbon text-gray-400 hover:bg-white hover:text-black font-bold text-xs uppercase py-4 flex items-center justify-center gap-2 transition-colors duration-200 border-l border-gray-800"
          >
            <Download className="w-4 h-4" />
            <span>Export ICS</span>
          </button>
        </div>
      </div>

      {/* Expanded Lightbox Modal */}
      {isTrackExpanded && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in duration-200" 
          onClick={() => setIsTrackExpanded(false)}
        >
          <div 
            className="relative w-full max-w-5xl h-[80vh] bg-f1-dark border border-f1-red rounded-xl overflow-hidden shadow-2xl flex flex-col" 
            onClick={e => e.stopPropagation()}
          >
             {/* Modal Header */}
             <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-50 pointer-events-none">
                 <div className="pointer-events-auto">
                    <span className="inline-block bg-f1-red text-white text-xs font-black px-2 py-1 -skew-x-12 uppercase">
                        Telemetry View
                    </span>
                 </div>
                 <button 
                    className="pointer-events-auto bg-black/60 hover:bg-f1-red text-white p-2 rounded-full transition-colors backdrop-blur-sm" 
                    onClick={() => setIsTrackExpanded(false)}
                 >
                    <X size={24} />
                 </button>
             </div>

             {/* Full Size Visualizer */}
             <TrackVisualizer 
                imageUrl={race.trackImageUrl}
                circuitName={race.circuitName}
                className="h-full w-full"
             />

             {/* Modal Footer Info */}
             <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent pointer-events-none">
                <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-1">
                   {race.circuitName}
                </h2>
                <div className="flex items-center gap-3">
                    <p className="text-f1-red font-bold uppercase tracking-widest text-lg">{race.grandPrixName}</p>
                    <div className="h-4 w-px bg-gray-600"></div>
                    <p className="text-gray-400 text-sm font-mono">{race.city}, {race.country}</p>
                </div>
             </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RaceCard;