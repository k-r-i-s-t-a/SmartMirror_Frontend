import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription, timer } from 'rxjs';
import { AppService } from './app.service';
import { AppUtil } from './app.util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public time: string = '13:37';
  public date: string = 'Saturday, Mai 21, 1991';
  public currentTemperature: string = '42';
  public iconCode = -1;

  public daysForecast: Array<any> = [];
  public hoursForecast: Array<any> = [];

  public appointments: Array<any> = [];

  private dateTimePeriodic?: Subscription;
  private weatherPeriodic?: Subscription;
  private appointmentsPeriodic?: Subscription;

  constructor(private appService: AppService, private util: AppUtil) {}

  ngOnInit(): void {
    this.dateTimePeriodic = timer(0, 1000).subscribe(() => {
      this.time = formatDate(Date.now(), 'HH:mm', 'en-us');
      this.date = formatDate(Date.now(), 'EEEE, MMMM d, y', 'en-us');
    });

    this.weatherPeriodic = timer(0, 1000 * 60 * 60).subscribe(() => {
      this.appService.getWeatherData().subscribe({
        next: (data) => this.transformWeatherData(this.parseWeatherData(data)),
        error: (error) => console.error(error),
      });
    });

    this.appointmentsPeriodic = timer(0, 1000 * 60 * 60).subscribe(() => {
      this.appService
        .getTodayAppointments()
        .then((events) => this.transformAppointmentData(events))
        .catch((error) => console.error(error));
    });
  }

  ngOnDestroy(): void {
    this.dateTimePeriodic?.unsubscribe();
    this.weatherPeriodic?.unsubscribe();
    this.appointmentsPeriodic?.unsubscribe();
  }

  private parseWeatherData(data: any): any {
    const result = {
      daysForecast: new Array(),
      hoursForecast: new Array(),
    };

    const now = new Date();
    for (var i = 0; i < data.daily.time.length; i++) {
      result.daysForecast.push({
        timestamp: data.daily.time[i],
        minimumTemp: data.daily.temperature_2m_min[i],
        maximumTemp: data.daily.temperature_2m_max[i],
        icon: data.daily.weathercode[i],
        rain: data.daily.rain_sum[i],
      });
    }

    // 24, because in the time array, the first 24 elements are timestamps from the current day, the can be skipped
    for (var i = 0; i < 24; i++) {
      const time = new Date(data.hourly.time[i]);
      if (time.getHours() > now.getHours() && time.getHours() <= now.getHours() + 3) {
        result.hoursForecast.push({
          timestamp: time,
          temperature: data.hourly.temperature_2m[i],
          icon: data.hourly.weathercode[i],
          rain: data.hourly.rain[i],
        });
      }
    }

    return result;
  }

  private transformWeatherData(data: any) {
    this.daysForecast = data.daysForecast.slice(1, 4);
    this.hoursForecast = data.hoursForecast;

    const currentTempDate = this.hoursForecast[0];
    this.currentTemperature = currentTempDate.temperature;
    this.iconCode = currentTempDate.icon;
  }

  private transformAppointmentData(data: any) {
    const temp: Array<any> = [];
    for (const event of data) {
      temp.push({
        description: this.util.shorten(event.summary),
        allDay: event.start.dateTime ? false : true,
        start: event.start.dateTime ? event.start.dateTime : event.start.date,
        end: event.end.dateTime ? event.end.dateTime : event.start.date,
        color: event.color,
      });
    }

    // this.appointments = this.util.sortAppointments(temp);
  }
}
