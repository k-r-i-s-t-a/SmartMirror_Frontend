import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription, timer, zip } from 'rxjs';
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
      zip(
        this.appService.getWeatherDayData(),
        this.appService.getWeatherHoursData()
      ).subscribe({
        next: (data) => {
          this.transformWeatherData(this.parseWeatherData(data));
        },
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
    for (const elem of data[0].DailyForecasts) {
      result.daysForecast.push({
        timestamp: elem.Date,
        minimumTemp: elem.Temperature.Minimum.Value,
        maximumTemp: elem.Temperature.Maximum.Value,
        icon: elem.Day.Icon,
        rainProb: elem.Day.RainProbability || 0,
      });
    }

    for (const elem of data[1]) {
      result.hoursForecast.push({
        timestamp: elem.DateTime,
        temperature: elem.Temperature.Value,
        icon: elem.WeatherIcon,
        rainProb: elem.RainProbability || 0,
      });
    }

    return result;
  }

  private transformWeatherData(data: any) {
    this.daysForecast = data.daysForecast.slice(1, 4);
    this.hoursForecast = data.hoursForecast.slice(0, 3);

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

    this.appointments = this.util.sortAppointments(temp);
  }
}
