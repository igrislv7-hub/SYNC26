import { F1Race } from '../types';

declare global {
  interface Window {
    google: any;
    gapi: any;
  }
}

let tokenClient: any;
let isInitialized = false;

export const initGoogleCalendar = (clientId: string) => {
  return new Promise<void>((resolve, reject) => {
    if (isInitialized) {
      // Re-init token client just in case ID changed
      if (window.google) {
        tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: 'https://www.googleapis.com/auth/calendar.events',
            callback: '', // defined at request time
        });
      }
      resolve();
      return;
    }

    // Wait for scripts to load
    const checkScripts = setInterval(() => {
      if (window.google && window.gapi) {
        clearInterval(checkScripts);
        
        try {
            tokenClient = window.google.accounts.oauth2.initTokenClient({
                client_id: clientId,
                scope: 'https://www.googleapis.com/auth/calendar.events',
                callback: '', // defined at request time
            });

            window.gapi.load('client', async () => {
                await window.gapi.client.init({
                    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
                });
                isInitialized = true;
                resolve();
            });
        } catch (e) {
            reject(e);
        }
      }
    }, 100);
    
    setTimeout(() => {
        clearInterval(checkScripts);
        reject(new Error("Google API scripts failed to load. Check your ad blocker?"));
    }, 10000);
  });
};

export const syncEventsToCalendar = async (races: F1Race[]) => {
   if (!tokenClient) throw new Error("Google Calendar not initialized");

   return new Promise((resolve, reject) => {
      tokenClient.callback = async (resp: any) => {
        if (resp.error) {
          reject(resp);
          return;
        }
        try {
            await createEventsBatch(races);
            resolve(true);
        } catch (e) {
            reject(e);
        }
      };
      
      // Trigger the popup
      tokenClient.requestAccessToken({ prompt: 'consent' });
   });
}

const createEventsBatch = async (races: F1Race[]) => {
    const batch = window.gapi.client.newBatch();
    
    races.forEach(race => {
        // Ensure date/time format is correct for API
        // race.date is YYYY-MM-DD, race.time is HH:mm:ss
        const startDateTime = `${race.date}T${race.time}Z`; 
        // Default duration 2 hours
        const endObj = new Date(new Date(startDateTime).getTime() + 2 * 60 * 60 * 1000);
        const endDateTime = endObj.toISOString().replace('.000', '');

        const event = {
            'summary': `F1 ${race.grandPrixName} 2026`,
            'location': `${race.circuitName}, ${race.city}, ${race.country}`,
            'description': `${race.description}\n\nRound ${race.round}\nHome Race: ${race.homeRaceFor?.join(', ') || 'N/A'}\n(Synced via F1 Sync 26)`,
            'start': {
                'dateTime': startDateTime,
                'timeZone': 'UTC'
            },
            'end': {
                'dateTime': endDateTime,
                'timeZone': 'UTC'
            }
        };

        const request = window.gapi.client.calendar.events.insert({
            'calendarId': 'primary',
            'resource': event
        });
        batch.add(request);
    });

    return batch.then((response: any) => {
        console.log("Batch sync complete", response);
        return response;
    });
}