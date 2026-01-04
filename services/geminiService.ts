import { GoogleGenAI, Type, Schema } from "@google/genai";
import { F1Race } from "../types";
import { getTrackImage } from "../utils/trackData";

// Detailed 2026 Grid Info as per user request
const GRID_INFO_2026 = `
OFFICIAL 2026 GRID DATA (Use this for "Home Race" calculations):
1. McLaren Mastercard (UK): Lando Norris (#1), Oscar Piastri (#81). Engine: Mercedes.
2. Mercedes-AMG Petronas (Germany): George Russell (#63), Kimi Antonelli (#12). Engine: Mercedes.
3. Oracle Red Bull Racing (Austria): Max Verstappen (#3), Isack Hadjar (#6). Engine: Red Bull Ford.
4. Scuderia Ferrari HP (Italy): Charles Leclerc (#16), Lewis Hamilton (#44). Engine: Ferrari.
5. Atlassian Williams (UK): Alex Albon (#23), Carlos Sainz (#55). Engine: Mercedes.
6. Aston Martin Aramco (UK): Fernando Alonso (#14), Lance Stroll (#18). Engine: Honda.
7. Audi Revolut (Germany): Nico Hülkenberg (#27), Gabriel Bortoleto (#5). Engine: Audi.
8. Cadillac F1 Team (USA): Sergio Pérez (#11), Valtteri Bottas (#77). Engine: Ferrari.
9. BWT Alpine (France): Pierre Gasly (#10), Franco Colapinto (#43). Engine: Mercedes.
10. Visa Cash App RB (Italy): Liam Lawson (#30), Arvid Lindblad (#41). Engine: Red Bull Ford.
11. TGR Haas F1 Team (USA): Esteban Ocon (#31), Oliver Bearman (#87). Engine: Ferrari.
`;

const PROVISIONAL_CALENDAR_2026 = `
STRICT 2026 CALENDAR SEQUENCE (Updated based on User CSV Request):
1. Australian GP (Albert Park) - March 8, 2026 (Season Opener)
2. Chinese GP (Shanghai) - March 15, 2026 (Sprint Race)
3. Japanese GP (Suzuka) - March 29, 2026
4. Bahrain GP (Sakhir) - April 12, 2026 (Night Race)
5. Saudi Arabian GP (Jeddah) - April 19, 2026
6. Miami GP (Miami) - May 3, 2026 (Sprint Race)
7. Canadian GP (Montreal) - May 24, 2026
8. Monaco GP (Monaco) - June 7, 2026
9. Barcelona GP (Catalunya) - June 14, 2026
10. Austrian GP (Red Bull Ring) - June 28, 2026
11. British GP (Silverstone) - July 5, 2026
12. Belgian GP (Spa) - July 19, 2026
13. Hungarian GP (Hungaroring) - July 26, 2026
14. Dutch GP (Zandvoort) - August 23, 2026
15. Italian GP (Monza) - September 6, 2026
16. Spanish GP (Madrid Street Circuit) - September 13, 2026 (New Circuit)
17. Azerbaijan GP (Baku) - September 26, 2026 (Saturday Race)
18. Singapore GP (Marina Bay) - October 11, 2026
19. United States GP (Austin) - October 25, 2026
20. Mexico City GP (Hermanos Rodriguez) - November 1, 2026
21. Sao Paulo GP (Interlagos) - November 8, 2026
22. Las Vegas GP (Las Vegas) - November 21, 2026 (Saturday Night)
23. Qatar GP (Lusail) - November 29, 2026
24. Abu Dhabi GP (Yas Marina) - December 6, 2026
`;

// Schema for the F1 Race data
const f1RaceSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      round: { type: Type.INTEGER },
      grandPrixName: { type: Type.STRING },
      circuitName: { type: Type.STRING },
      city: { type: Type.STRING },
      country: { type: Type.STRING },
      date: { type: Type.STRING, description: "Date of the MAIN RACE in YYYY-MM-DD format (UTC)" },
      time: { type: Type.STRING, description: "Start time of the MAIN RACE in HH:MM:SS format (UTC)" },
      timezoneId: { type: Type.STRING, description: "The IANA Timezone ID for the race location (e.g. 'Europe/Madrid', 'Asia/Tokyo', 'America/New_York')." },
      isSprintWeekend: { type: Type.BOOLEAN, description: "True if this round includes a Sprint race." },
      weekendStartDate: { type: Type.STRING, description: "Date of Friday Practice 1 (YYYY-MM-DD)." },
      weekendEndDate: { type: Type.STRING, description: "Date of the Main Race (YYYY-MM-DD)." },
      trackImageUrl: { type: Type.STRING, description: "A valid HTTPS URL to a Wikimedia Commons image file (PNG or SVG) showing the circuit layout map." },
      homeRaceFor: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "List of drivers or teams from the provided 2026 Grid Data for whom this is a home race."
      },
      description: { type: Type.STRING, description: "A short, exciting snippet about the track characteristics." }
    },
    required: ["round", "grandPrixName", "circuitName", "city", "country", "date", "time", "timezoneId", "isSprintWeekend", "weekendStartDate", "weekendEndDate", "trackImageUrl", "homeRaceFor", "description"]
  }
};

export const fetchF1Schedule = async (): Promise<F1Race[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a JSON dataset for the Formula 1 2026 Season.
      
      Requirements:
      1. STRICTLY follow the 'STRICT 2026 CALENDAR SEQUENCE' provided below for the Round Order, Grand Prix Name, and Date. Do not hallucinate other dates.
      2. For 'time': Estimate the race start time based on typical local race start times (usually 14:00 or 15:00 local, or 20:00/22:00 for night races like Singapore/Vegas) and convert to UTC.
      3. Identify Sprint weekends (typically 6: China, Miami, Austria, Austin, Brazil, Qatar).
      4. Provide the correct IANA timezone ID for each city.
      5. For 'trackImageUrl', attempt to find a Wikimedia Commons URL.
      6. For 'homeRaceFor', strictly use the grid data below.

      ${PROVISIONAL_CALENDAR_2026}

      ${GRID_INFO_2026}
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: f1RaceSchema,
        systemInstruction: "You are an expert F1 statistician for the 2026 season. You must adhere strictly to the provided calendar dates and order. Output strictly valid JSON.",
      },
    });

    if (response.text) {
      const rawData = JSON.parse(response.text) as F1Race[];
      
      const refinedData = rawData.map(race => {
        const hardcodedImage = getTrackImage(race.circuitName, race.grandPrixName);
        return {
          ...race,
          // Prioritize our hardcoded high-quality SVG if available
          trackImageUrl: hardcodedImage || race.trackImageUrl || ""
        };
      });

      return refinedData;
    }
    
    throw new Error("No data received from Gemini");
  } catch (error) {
    console.error("Error fetching F1 schedule:", error);
    throw error;
  }
};