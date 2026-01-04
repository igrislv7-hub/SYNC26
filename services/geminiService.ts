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
      1. Provide the projected calendar for the 2026 season including the new Madrid Grand Prix.
      2. Ensure dates and times are accurate estimates in UTC.
      3. Identify Sprint weekends accurately (typically 6 per season).
      4. Provide the correct IANA timezone ID for each city.
      5. For 'trackImageUrl', attempt to find a Wikimedia Commons URL. If unsure, leave empty.
      6. For 'homeRaceFor', strictly use the grid data below.

      ${GRID_INFO_2026}
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: f1RaceSchema,
        systemInstruction: "You are an expert F1 statistician for the 2026 season. Output strictly valid JSON.",
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