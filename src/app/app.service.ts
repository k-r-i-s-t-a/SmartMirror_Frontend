import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

declare var gapi: any;
declare var google: any;

@Injectable()
export class AppService {
  private readonly ACCU_WEATHER_DAY_FORECAST = `${environment.accuWeatherBaseURL}/daily/5day/${environment.accuWeatherCityKey}?apikey=${environment.accuWeatherApiKey}&metric=true&details=true`;
  private readonly ACCU_WEATHER_HOURS_FORECAST = `${environment.accuWeatherBaseURL}/hourly/12hour/${environment.accuWeatherCityKey}?apikey=${environment.accuWeatherApiKey}&metric=true&details=true`;

  private googleTokenClient!: any;

  constructor(private http: HttpClient) {}

  getWeatherDayData(): Observable<any> {
    return this.http.get(this.ACCU_WEATHER_DAY_FORECAST);
  }

  getWeatherHoursData(): Observable<any> {
    return this.http.get(this.ACCU_WEATHER_HOURS_FORECAST);
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
        const todayStart = new Date();
        const todayEnd = new Date();

        todayStart.setHours(0);
        todayStart.setMinutes(0);
        todayEnd.setHours(23);
        todayEnd.setMinutes(59);

        const getEvents = gapi.client.calendar.events.list({
          calendarId: c.id,
          timeMin: todayStart.toISOString(),
          timeMax: todayEnd.toISOString(),
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
