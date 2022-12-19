import { Component, Input } from '@angular/core';

@Component({
  selector: 'weather-icon',
  template: `
    <div
      class="icon"
      [ngClass]="{
        sunny: iconCode >= 0 && iconCode <= 3,
        cloudy: iconCode >= 45 && iconCode <= 48,
        rainy: iconCode >= 61 && iconCode <= 67 || iconCode >= 80 && iconCode <= 82,
        'sun-shower': iconCode >= 51 && iconCode <= 57,
        'thunder-storm': iconCode >= 95 && iconCode <= 99,
        flurries: iconCode >= 71 && iconCode <= 77 || iconCode >= 85 && iconCode <= 86
      }"
      [style.font-size]="size"
    >
      <div class="sun" *ngIf="iconCode >= 0 && iconCode <= 3">
        <div class="rays"></div>
      </div>
      <div class="cloud" *ngIf="iconCode >= 45 && iconCode <= 57"></div>
      <div class="cloud" *ngIf="iconCode >= 45 && iconCode <= 57"></div>
      <div class="cloud" *ngIf="iconCode >= 61 && iconCode <= 67 || iconCode >= 80 && iconCode <= 82"></div>
      <div class="rain" *ngIf="iconCode >= 61 && iconCode <= 67 || iconCode >= 80 && iconCode <= 82"></div>
      <div class="cloud" *ngIf="iconCode >= 51 && iconCode <= 57"></div>
      <div class="sun" *ngIf="iconCode >= 51 && iconCode <= 57">
        <div class="rays"></div>
      </div>
      <div class="rain" *ngIf="iconCode >= 51 && iconCode <= 57"></div>
      <div class="cloud" *ngIf="iconCode >= 95 && iconCode <= 99"></div>
      <div class="lightning" *ngIf="iconCode >= 95 && iconCode <= 99">
        <div class="bolt"></div>
        <div class="bolt"></div>
      </div>
      <div class="cloud" *ngIf="iconCode >= 71 && iconCode <= 77 || iconCode >= 85 && iconCode <= 86"></div>
      <div class="snow" *ngIf="iconCode >= 71 && iconCode <= 77 || iconCode >= 85 && iconCode <= 86">
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
