import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

declare var gapi: any;
declare var google: any;

@Injectable()
export class AppService {
  private readonly OPEN_METEO_FORECAST;

  private googleTokenClient!: any;

  private todayStart;
  private todayEnd;

  constructor(private http: HttpClient) {
    this.todayStart = new Date();
    this.todayEnd = new Date();

    this.OPEN_METEO_FORECAST = `https://api.open-meteo.com/v1/forecast?latitude=${environment.openMeteoLatitude}&longitude=${environment.openMeteoLongitude}&hourly=temperature_2m,rain,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,rain_sum&timezone=Europe%2FBerlin&start_date=${this.todayStart.toISOString().substring(0, 10)}&end_date=${new Date(this.todayStart.getTime() + 1000 * 60 * 60 * 24 * 3).toISOString().substring(0, 10)}`;  
  }

  getWeatherData(): Observable<any> {
    return this.http.get(this.OPEN_METEO_FORECAST);
  }

  async getTodayAppointments(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (!this.googleTokenClient) {
        await this.loadGoogle();
      }

      const res = await gapi.client.calendar.calendarList.list();
      const calendars: any[] = res.result.items;
      const batch = gapi.client.newBatch();
      for (const c of calendars) {
        // Skip some unnecessary calendar entries
        if (
          c.id === 'e_2_de#weeknum@group.v.calendar.google.com' ||
          c.id === 'addressbook#contacts@group.v.calendar.google.com'
        ) {
          continue;
        }
        // Create a request for each calendar to retrieve all events of the day and add it to a bulk action
        this.todayStart.setHours(0);
        this.todayStart.setMinutes(0);
        this.todayEnd.setHours(23);
        this.todayEnd.setMinutes(59);

        const getEvents = gapi.client.calendar.events.list({
          calendarId: c.id,
          timeMin: this.todayStart.toISOString(),
          timeMax: this.todayEnd.toISOString(),
          singleEvents: true,
          orderBy: 'startTime',
        });

        batch.add(getEvents, { id: c.id });
      }
      // Execute the batch
      batch.then(
        (response: any) => {
          // Transform the result from all calendars to a list of upcoming events and return it as result
          const result: any[] = [];
          for (const k of Object.keys(response.result)) {
            const value = response.result[k].result;
            if (value.items.length > 0) {
              const c = calendars.filter((cal) => cal.id === k)[0];
              value.items.forEach((v: any) =>
                result.push({ ...v, color: c.backgroundColor })
              );
            }
          }
          resolve(result);
        },
        (error: any) => {
          reject(error);
        }
      );
    });
  }

  private async loadGoogle(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      gapi.load('client', async () => {
        await gapi.client.init({
          apiKey: environment.googleApiKey,
          discoveryDocs: environment.googleCalendarBaseURL,
        });
        resolve();
      });
    });

    this.googleTokenClient = google.accounts.oauth2.initTokenClient({
      client_id: environment.googleClientId,
      scope: environment.googleCalendarScope,
      callback: async (res: any) => {},
    });

    this.googleTokenClient.requestAccessToken({ prompt: '' });

    await new Promise<void>((resolve, reject) => {
      this.googleTokenClient.callback = async (res: any) => {
        if (res.error) {
          reject(res.error);
        } else {
          resolve();
        }
      };
    });
  }
}
