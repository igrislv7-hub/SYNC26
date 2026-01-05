import React, { useState } from 'react';

interface TrackViewProps {
  imageUrl: string;
  circuitName: string;
  fallbackPath?: string | null;
  className?: string;
}

const TrackVisualizer: React.FC<TrackViewProps> = ({ imageUrl, circuitName, className = "h-64" }) => {
  const [hasError, setHasError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`relative w-full ${className} bg-f1-carbon/50 rounded-br-2xl border-l-4 border-f1-red overflow-hidden flex items-center justify-center p-8 relative shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] perspective-1000 group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ perspective: '1000px' }}
    >
      {/* Background Grid - Telemetry Style */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-500 group-hover:opacity-30"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: 'rotateX(60deg) scale(2)',
          transformOrigin: 'center 80%'
        }}
      />
      
      {/* Corner Accents */}
      <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-f1-red/60 rounded-tr-xl"></div>
      <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-f1-red/60 rounded-bl-xl"></div>

      {/* Decorative Technical Lines */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="absolute left-1/2 top-0 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>

      {!hasError && imageUrl ? (
        <div 
          className="relative w-full h-full flex items-center justify-center transition-all duration-700 ease-out"
          style={{
            transform: isHovered 
              ? 'scale(1.1) rotateX(0deg) translateY(0)' 
              : 'scale(1) rotateX(25deg) rotateY(0deg) translateY(10px)', // 3D Tilt effect
            transformStyle: 'preserve-3d',
            filter: isHovered ? 'drop-shadow(0 0 20px rgba(255, 24, 1, 0.4))' : 'none'
          }}
        >
          {/* Glow effect behind the track */}
          <div className="absolute inset-0 bg-f1-red/20 blur-3xl rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-700 transform translate-z-[-20px]"></div>
          
          <img 
            src={imageUrl} 
            alt={`${circuitName} layout`}
            // High contrast, inverted for dark mode, strong drop shadow for neon look
            className="w-full h-full object-contain filter invert contrast-[1.3] drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
            onError={() => setHasError(true)}
            loading="lazy"
            style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden'
            }}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-600 text-sm animate-pulse">
          <span className="mb-2 text-4xl opacity-30">🏁</span>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Map Unavailable</span>
        </div>
      )}

      {/* Label Overlay */}
      <div className="absolute bottom-4 right-4 text-right">
         <div className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">Circuit Telemetry</div>
         <div className="text-xs font-bold text-white uppercase tracking-wider text-f1-red">Official Layout</div>
      </div>
    </div>
  );
};

export default TrackVisualizer;