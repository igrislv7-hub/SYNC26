import React, { useEffect, useState } from 'react';
import { F1Race, LoadingState } from './types';
import { fetchF1Schedule } from './services/geminiService';
import { downloadSeasonICS } from './utils/calendarUtils';
import RaceCard from './components/RaceCard';
import { Trophy, RefreshCw, AlertTriangle, ChevronsRight, CalendarPlus, FileDown, ArrowRight, X } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [races, setRaces] = useState<F1Race[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Import Guide State
  const [showImportGuide, setShowImportGuide] = useState(false);

  const loadData = async () => {
    setStatus(LoadingState.LOADING);
    setError(null);
    try {
      const data = await fetchF1Schedule();
      setRaces(data);
      setStatus(LoadingState.SUCCESS);
    } catch (err: any) {
      setError(err.message || "Failed to load race data.");
      setStatus(LoadingState.ERROR);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSmartImport = () => {
    // 1. Trigger Download
    downloadSeasonICS(races);
    
    // 2. Open Google Calendar Import Page in new tab
    window.open('https://calendar.google.com/calendar/u/0/r/settings/export', '_blank');
    
    // 3. Show Guide
    setShowImportGuide(true);
  };

  return (
    <div className="min-h-screen bg-f1-black text-white font-sans selection:bg-f1-red selection:text-white relative">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b-2 border-f1-red">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-f1-red flex items-center justify-center skew-x-[-12deg]">
                <span className="font-black text-white text-xl skew-x-[12deg] tracking-tighter">F1</span>
              </div>
              <span className="font-bold text-2xl tracking-tighter uppercase italic hidden sm:block">
                Sync<span className="text-f1-red">26</span>
              </span>
            </div>
            
            <div className="flex items-center gap-4 sm:gap-6">
               <div className="hidden lg:flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-500">
                  <span>Season 2026</span>
                  <span className="text-f1-red">//</span>
                  <span>Official Calendar</span>
               </div>
              {status === LoadingState.SUCCESS && (
                <>
                  <button 
                    onClick={handleSmartImport}
                    className="group flex items-center gap-2 px-4 py-2 bg-f1-red hover:bg-white border border-f1-red rounded-sm transition-all shadow-[0_0_15px_rgba(255,24,1,0.2)]"
                    title="Import All Races to Google Calendar"
                  >
                    <CalendarPlus className="w-4 h-4 text-white group-hover:text-f1-red transition-colors" />
                    <span className="text-xs font-black uppercase text-white group-hover:text-f1-red tracking-wide">Add to Google Cal</span>
                  </button>

                  <button 
                    onClick={loadData}
                    className="group hidden sm:flex items-center gap-2 px-4 py-1.5 border border-gray-700 hover:border-f1-red rounded-sm transition-all"
                    title="Refresh Data"
                  >
                    <RefreshCw className="w-4 h-4 text-gray-400 group-hover:text-f1-red group-hover:rotate-180 transition-all duration-500" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero / Header */}
      <div className="relative bg-f1-dark border-b border-gray-800">
        <div className="absolute inset-0 bg-carbon-pattern opacity-30"></div>
        {/* Diagonal accents */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-f1-red/10 to-transparent skew-x-[-20deg] transform origin-bottom"></div>
        
        <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                 <Trophy className="w-6 h-6 text-f1-red" />
                 <span className="text-f1-red font-bold uppercase tracking-widest text-sm">Championship Chase</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-6 italic">
                Race Week <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-600">Essential</span>
              </h1>
              <p className="text-gray-400 text-lg md:text-xl border-l-4 border-f1-red pl-4 max-w-xl">
                Official 2026 Season Schedule. Localized timings, circuit telemetry, and instant calendar synchronization.
              </p>
            </div>
            
            {/* Stat Box */}
            <div className="hidden md:block bg-black/50 border border-gray-700 p-6 skew-x-[-6deg]">
               <div className="skew-x-[6deg] text-center">
                  <div className="text-sm text-gray-500 uppercase tracking-widest font-bold">Next Season</div>
                  <div className="text-4xl font-black text-white">2026</div>
                  <div className="text-xs text-f1-red font-bold uppercase mt-1">Provisional</div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Loading State */}
        {status === LoadingState.LOADING && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative w-20 h-20 mb-8">
              <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
              <div className="absolute inset-0 border-t-4 border-f1-red rounded-full animate-spin"></div>
            </div>
            <div className="text-2xl font-black uppercase italic tracking-widest animate-pulse">Initializing Telemetry</div>
            <p className="text-sm text-f1-red font-mono mt-2">Connecting to Pit Wall...</p>
          </div>
        )}

        {/* Error State */}
        {status === LoadingState.ERROR && (
          <div className="border-l-4 border-f1-red bg-gray-900 p-8 max-w-2xl mx-auto relative overflow-hidden">
            <div className="absolute -right-10 -top-10 text-gray-800 opacity-20">
               <AlertTriangle size={200} />
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl font-black text-white uppercase italic mb-2">System Failure</h3>
              <p className="text-gray-400 mb-6 font-mono text-sm">{error}</p>
              <button 
                onClick={loadData}
                className="bg-f1-red hover:bg-red-700 text-white font-bold py-3 px-8 uppercase tracking-widest text-sm transition-colors"
              >
                Retry Connection
              </button>
            </div>
          </div>
        )}

        {/* Success State - Grid */}
        {status === LoadingState.SUCCESS && (
          <>
            <div className="flex items-center gap-2 mb-8">
               <ChevronsRight className="text-f1-red" />
               <h2 className="text-xl font-bold uppercase tracking-widest">Season Calendar</h2>
               <div className="h-px bg-gray-800 flex-grow ml-4"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {races.map((race) => (
                <RaceCard key={race.round} race={race} />
              ))}
            </div>
          </>
        )}

        {/* Empty State check */}
        {status === LoadingState.SUCCESS && races.length === 0 && (
          <div className="text-center py-20 text-gray-500 font-mono">
            NO DATA RECEIVED FROM RACE CONTROL.
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-4 opacity-50">
             <div className="w-6 h-6 bg-gray-700 skew-x-[-12deg]"></div>
             <div className="w-6 h-6 bg-gray-700 skew-x-[-12deg]"></div>
             <div className="w-6 h-6 bg-gray-700 skew-x-[-12deg]"></div>
          </div>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">F1 Calendar Sync 2026</p>
          <p className="mt-2 text-xs text-gray-700">Unofficial Application. Data generated by AI. Not affiliated with Formula One World Championship Limited.</p>
        </div>
      </footer>

      {/* Import Guide Modal */}
      {showImportGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-f1-dark border-2 border-f1-red p-8 max-w-lg w-full relative shadow-[0_0_50px_rgba(255,24,1,0.2)]">
              <button 
                 onClick={() => setShowImportGuide(false)}
                 className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-f1-red/10 flex items-center justify-center rounded-full text-f1-red">
                   <CalendarPlus size={24} />
                </div>
                <h3 className="text-2xl font-black uppercase italic">Importing to Google Cal</h3>
              </div>
              
              <div className="space-y-6">
                 <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center font-bold text-f1-red shrink-0">1</div>
                    <div>
                       <p className="font-bold text-white mb-1">Download Started</p>
                       <p className="text-sm text-gray-400">The file <span className="font-mono text-f1-red bg-black/50 px-1 rounded">f1-2026-full-season.ics</span> is downloading to your device.</p>
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center font-bold text-f1-red shrink-0">2</div>
                    <div>
                       <p className="font-bold text-white mb-1">Google Calendar Opened</p>
                       <p className="text-sm text-gray-400">We've opened the Google Calendar <strong>Settings &gt; Import</strong> page in a new tab for you.</p>
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center font-bold text-f1-red shrink-0">3</div>
                    <div>
                       <p className="font-bold text-white mb-1">Drag & Drop</p>
                       <p className="text-sm text-gray-400">Simply drag the downloaded file into the "Select file from your computer" box on that page and click <strong>Import</strong>.</p>
                    </div>
                 </div>

                 <div className="bg-f1-gray/20 p-4 border-l-2 border-f1-red mt-4">
                     <p className="text-xs text-gray-300">
                        <strong>Why this way?</strong> This method is the fastest way to add all 24 races at once without requiring you to set up complex API keys or grant third-party permissions.
                     </p>
                 </div>

                 <button 
                    onClick={() => setShowImportGuide(false)}
                    className="w-full bg-f1-red hover:bg-white hover:text-f1-red text-white font-bold py-3 uppercase tracking-widest text-sm transition-all"
                 >
                    Got it, Racing Ahead
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default App;