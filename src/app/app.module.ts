import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { AppUtil } from './app.util';
import { WeatherIconComponent } from './components/weather-icon/weather-icon.component';

import '@cds/core/divider/register';
import { EventIconComponent } from './components';

@NgModule({
  declarations: [AppComponent, WeatherIconComponent, EventIconComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    ClarityModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [AppService, AppUtil],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
