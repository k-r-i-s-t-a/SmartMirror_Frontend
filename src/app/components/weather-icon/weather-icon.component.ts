import { Component, Input } from '@angular/core';

@Component({
  selector: 'weather-icon',
  template: `
    <div
      class="icon"
      [ngClass]="{
        sunny: iconCode >= 1 && iconCode <= 5 || iconCode == 30,
        cloudy: iconCode >= 6 && iconCode <= 11 || iconCode >= 35 && iconCode <= 38,
        rainy: iconCode == 12 || iconCode == 18,
        'sun-shower': iconCode == 13 || iconCode == 14,
        'thunder-storm': iconCode > 14 && iconCode <= 17,
        flurries: iconCode >= 19 && iconCode <= 29
      }"
      [style.font-size]="size"
    >
      <div class="sun" *ngIf="iconCode >= 1 && iconCode <= 5 || iconCode == 30">
        <div class="rays"></div>
      </div>
      <div class="cloud" *ngIf="iconCode >= 6 && iconCode <= 11 || iconCode >= 35 && iconCode <= 38"></div>
      <div class="cloud" *ngIf="iconCode >= 6 && iconCode <= 11 || iconCode >= 35 && iconCode <= 38"></div>
      <div class="cloud" *ngIf="iconCode == 12 || iconCode == 18"></div>
      <div class="rain" *ngIf="iconCode == 12 || iconCode == 18"></div>
      <div class="cloud" *ngIf="iconCode == 13 || iconCode == 14"></div>
      <div class="sun" *ngIf="iconCode == 13 || iconCode == 14">
        <div class="rays"></div>
      </div>
      <div class="rain" *ngIf="iconCode == 13 || iconCode == 14"></div>
      <div class="cloud" *ngIf="iconCode > 14 && iconCode <= 17"></div>
      <div class="lightning" *ngIf="iconCode > 14 && iconCode <= 17">
        <div class="bolt"></div>
        <div class="bolt"></div>
      </div>
      <div class="cloud" *ngIf="iconCode >= 19 && iconCode <= 29"></div>
      <div class="snow" *ngIf="iconCode >= 19 && iconCode <= 29">
        <div class="flake"></div>
        <div class="flake"></div>
      </div>
    </div>
  `,
  styleUrls: ['./weather-icon.component.scss'],
})
export class WeatherIconComponent {
  @Input() iconCode!: number;
  @Input() size: string = '1em';
}
