// Official Wikimedia Commons SVG Maps for F1 Circuits
// Selected for clean lines and transparency to work with the 3D visualizer

const TRACK_IMAGE_URLS: Record<string, string> = {
  // Madrid (New for 2026)
  "madrid": "https://upload.wikimedia.org/wikipedia/commons/8/80/Circuito_de_Madrid_IFEMA_Valdebebas.svg",
  "ifema": "https://upload.wikimedia.org/wikipedia/commons/8/80/Circuito_de_Madrid_IFEMA_Valdebebas.svg",
  "valdebebas": "https://upload.wikimedia.org/wikipedia/commons/8/80/Circuito_de_Madrid_IFEMA_Valdebebas.svg",

  // Bahrain
  "bahrain": "https://upload.wikimedia.org/wikipedia/commons/2/29/Bahrain_International_Circuit--Grand_Prix_Layout.svg",
  "sakhir": "https://upload.wikimedia.org/wikipedia/commons/2/29/Bahrain_International_Circuit--Grand_Prix_Layout.svg",
  
  // Saudi Arabia
  "saudi": "https://upload.wikimedia.org/wikipedia/commons/5/51/Jeddah_Corniche_Circuit_2021.svg",
  "jeddah": "https://upload.wikimedia.org/wikipedia/commons/5/51/Jeddah_Corniche_Circuit_2021.svg",
  
  // Australia
  "australia": "https://upload.wikimedia.org/wikipedia/commons/7/77/Albert_Park_Circuit_2022.svg",
  "melbourne": "https://upload.wikimedia.org/wikipedia/commons/7/77/Albert_Park_Circuit_2022.svg",
  "albert": "https://upload.wikimedia.org/wikipedia/commons/7/77/Albert_Park_Circuit_2022.svg",
  
  // Japan (Suzuka)
  "japan": "https://upload.wikimedia.org/wikipedia/commons/5/56/Suzuka_circuit_map--2005.svg",
  "suzuka": "https://upload.wikimedia.org/wikipedia/commons/5/56/Suzuka_circuit_map--2005.svg",
  
  // China (Shanghai)
  "china": "https://upload.wikimedia.org/wikipedia/commons/0/07/Shanghai_International_Circuit.svg",
  "shanghai": "https://upload.wikimedia.org/wikipedia/commons/0/07/Shanghai_International_Circuit.svg",
  
  // Miami
  "miami": "https://upload.wikimedia.org/wikipedia/commons/4/41/Miami_International_Autodrome_2022.svg",
  
  // Imola
  "imola": "https://upload.wikimedia.org/wikipedia/commons/2/23/Imola_2009.svg",
  "emilia": "https://upload.wikimedia.org/wikipedia/commons/2/23/Imola_2009.svg",
  "enzo": "https://upload.wikimedia.org/wikipedia/commons/2/23/Imola_2009.svg",
  
  // Monaco
  "monaco": "https://upload.wikimedia.org/wikipedia/commons/5/56/Circuit_de_Monaco_2004.svg",
  "monte": "https://upload.wikimedia.org/wikipedia/commons/5/56/Circuit_de_Monaco_2004.svg",
  
  // Canada (Gilles Villeneuve)
  "canada": "https://upload.wikimedia.org/wikipedia/commons/e/e0/Circuit_Gilles_Villeneuve.svg",
  "montreal": "https://upload.wikimedia.org/wikipedia/commons/e/e0/Circuit_Gilles_Villeneuve.svg",
  "villeneuve": "https://upload.wikimedia.org/wikipedia/commons/e/e0/Circuit_Gilles_Villeneuve.svg",
  
  // Spain (Catalunya - Kept for reference, though 2026 is Madrid)
  "spain": "https://upload.wikimedia.org/wikipedia/commons/2/2d/Circuit_de_Catalunya_2021.svg",
  "catalunya": "https://upload.wikimedia.org/wikipedia/commons/2/2d/Circuit_de_Catalunya_2021.svg",
  "barcelona": "https://upload.wikimedia.org/wikipedia/commons/2/2d/Circuit_de_Catalunya_2021.svg",
  
  // Austria (Red Bull Ring)
  "austria": "https://upload.wikimedia.org/wikipedia/commons/6/62/Red_Bull_Ring_2022.svg",
  "spielberg": "https://upload.wikimedia.org/wikipedia/commons/6/62/Red_Bull_Ring_2022.svg",
  
  // Silverstone
  "britain": "https://upload.wikimedia.org/wikipedia/commons/9/93/Silverstone_Circuit_2020.svg",
  "silverstone": "https://upload.wikimedia.org/wikipedia/commons/9/93/Silverstone_Circuit_2020.svg",
  
  // Hungary
  "hungary": "https://upload.wikimedia.org/wikipedia/commons/9/91/Hungaroring_2003.svg",
  "hungaroring": "https://upload.wikimedia.org/wikipedia/commons/9/91/Hungaroring_2003.svg",
  
  // Belgium (Spa)
  "belgium": "https://upload.wikimedia.org/wikipedia/commons/5/54/Spa-Francorchamps_of_Belgium.svg",
  "spa": "https://upload.wikimedia.org/wikipedia/commons/5/54/Spa-Francorchamps_of_Belgium.svg",
  
  // Netherlands (Zandvoort)
  "netherlands": "https://upload.wikimedia.org/wikipedia/commons/8/88/Circuit_Zandvoort_2020.svg",
  "zandvoort": "https://upload.wikimedia.org/wikipedia/commons/8/88/Circuit_Zandvoort_2020.svg",
  
  // Italy (Monza)
  "italy": "https://upload.wikimedia.org/wikipedia/commons/5/5e/Monza_track_map.svg",
  "monza": "https://upload.wikimedia.org/wikipedia/commons/5/5e/Monza_track_map.svg",
  
  // Azerbaijan (Baku)
  "azerbaijan": "https://upload.wikimedia.org/wikipedia/commons/3/33/Baku_Formula_One_circuit_map.svg",
  "baku": "https://upload.wikimedia.org/wikipedia/commons/3/33/Baku_Formula_One_circuit_map.svg",
  
  // Singapore (Marina Bay) - 2023 Layout
  "singapore": "https://upload.wikimedia.org/wikipedia/commons/8/84/Marina_Bay_Street_Circuit_2023.svg",
  "marina": "https://upload.wikimedia.org/wikipedia/commons/8/84/Marina_Bay_Street_Circuit_2023.svg",
  
  // USA (COTA)
  "united states": "https://upload.wikimedia.org/wikipedia/commons/a/a5/Austin_circuit.svg",
  "austin": "https://upload.wikimedia.org/wikipedia/commons/a/a5/Austin_circuit.svg",
  "cota": "https://upload.wikimedia.org/wikipedia/commons/a/a5/Austin_circuit.svg",
  
  // Mexico
  "mexico": "https://upload.wikimedia.org/wikipedia/commons/c/cc/Aut%C3%B3dromo_Hermanos_Rodr%C3%ADguez_2015.svg",
  "rodriguez": "https://upload.wikimedia.org/wikipedia/commons/c/cc/Aut%C3%B3dromo_Hermanos_Rodr%C3%ADguez_2015.svg",
  
  // Brazil (Interlagos)
  "brazil": "https://upload.wikimedia.org/wikipedia/commons/5/5c/Circuit_Interlagos.svg",
  "interlagos": "https://upload.wikimedia.org/wikipedia/commons/5/5c/Circuit_Interlagos.svg",
  "sao paulo": "https://upload.wikimedia.org/wikipedia/commons/5/5c/Circuit_Interlagos.svg",
  
  // Las Vegas
  "vegas": "https://upload.wikimedia.org/wikipedia/commons/a/aa/Las_Vegas_Strip_Circuit_2023.svg",
  "las vegas": "https://upload.wikimedia.org/wikipedia/commons/a/aa/Las_Vegas_Strip_Circuit_2023.svg",
  
  // Qatar (Lusail)
  "qatar": "https://upload.wikimedia.org/wikipedia/commons/d/d3/Losail_International_Circuit_2023.svg",
  "lusail": "https://upload.wikimedia.org/wikipedia/commons/d/d3/Losail_International_Circuit_2023.svg",
  
  // Abu Dhabi (Yas Marina) - 2021 Layout
  "abu dhabi": "https://upload.wikimedia.org/wikipedia/commons/b/b3/Yas_Marina_Circuit_2021.svg",
  "yas": "https://upload.wikimedia.org/wikipedia/commons/b/b3/Yas_Marina_Circuit_2021.svg"
};

const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// Disable vector path fallback
export const getTrackPath = (circuitName: string, grandPrixName: string): string | null => {
  return null; 
};

export const getTrackImage = (circuitName: string, grandPrixName: string): string | null => {
  const cName = normalize(circuitName);
  const gpName = normalize(grandPrixName);
  const searchTerms = [cName, gpName];

  // Logic to ensure 2026 Spanish GP gets Madrid
  if (gpName.includes("spain") || gpName.includes("spanish")) {
    if (cName.includes("madrid") || cName.includes("ifema") || cName.includes("valdebebas")) {
      return TRACK_IMAGE_URLS["madrid"];
    }
  }

  for (const term of searchTerms) {
    for (const [key, url] of Object.entries(TRACK_IMAGE_URLS)) {
      if (term.includes(key)) {
        return url;
      }
    }
  }
  return null;
}