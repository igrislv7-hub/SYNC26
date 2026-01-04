import React from 'react';
import { F1Race } from '../types';
import TrackVisualizer from './Track3D'; 
import { downloadICS, formatDisplayDate, formatTimeIST, formatTimeLocal, formatWeekendRange } from '../utils/calendarUtils';
import { getTrackPath } from '../utils/trackData';
import { Calendar, MapPin, Flag, ChevronRight, Clock, Zap } from 'lucide-react';

interface RaceCardProps {
  race: F1Race;
}

const RaceCard: React.FC<RaceCardProps> = ({ race }) => {
  const fallbackPath = getTrackPath(race.circuitName, race.grandPrixName);
  const istTime = formatTimeIST(race.date, race.time);
  const localTime = formatTimeLocal(race.date, race.time, race.timezoneId);
  const weekendRange = formatWeekendRange(race.weekendStartDate, race.weekendEndDate);

  return (
    <div className="group bg-f1-dark border-t-4 border-f1-red hover:border-white transition-colors duration-300 flex flex-col relative overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-f1-red/5 skew-x-12 transform translate-x-10 -translate-y-10 rounded-full blur-2xl group-hover:bg-f1-red/10 transition-colors"></div>

      {/* Header */}
      <div className="px-5 pt-5 pb-2 flex justify-between items-start z-10">
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
             {race.homeRaceFor && race.homeRaceFor.length > 0 && (
               <span className="bg-white text-black text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-tighter">
                 Home Race
               </span>
             )}
          </div>
          <h3 className="text-2xl font-black text-white leading-none uppercase italic tracking-tight">
            {race.grandPrixName.replace("Grand Prix", "GP")}
          </h3>
        </div>
        <div className="text-right">
           <span className="block text-3xl font-bold text-f1-red/20 group-hover:text-f1-red transition-colors font-mono">
             {String(race.round).padStart(2, '0')}
           </span>
        </div>
      </div>

      {/* Track Visual */}
      <div className="w-full px-0 py-2">
        <TrackVisualizer 
          imageUrl={race.trackImageUrl} 
          circuitName={race.circuitName} 
          fallbackPath={fallbackPath} 
        />
      </div>

      {/* Info Grid */}
      <div className="px-5 py-4 space-y-4 flex-grow z-10 relative">
        
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
           <span className="uppercase font-semibold tracking-wide">{race.city}, {race.country}</span>
        </div>

        {/* Home Race Drivers/Teams */}
        {race.homeRaceFor && race.homeRaceFor.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {race.homeRaceFor.map((name, idx) => (
              <span 
                key={idx} 
                className="inline-block px-2 py-0.5 bg-f1-gray/50 border border-gray-600 text-[10px] uppercase font-bold text-gray-300 tracking-wider"
              >
                {name}
              </span>
            ))}
          </div>
        )}

      </div>

      {/* Action Button */}
      <button
        onClick={() => downloadICS(race)}
        className="mt-auto w-full bg-white text-black font-black uppercase text-sm py-4 tracking-widest hover:bg-f1-red hover:text-white transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <span>Sync Calendar</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default RaceCard;