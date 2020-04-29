import { MarketDataStore } from './stores/market.store';
import { MaterialModule } from './material.module';
import { MyDataStore } from './stores/my.store';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppConfig } from './app.config';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { ChartsModule } from 'ng2-charts';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { DataService } from './stores/data.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { AllStocksComponent } from './all-stocks/all-stocks.component';

export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}

@NgModule({
  declarations: [
    AppComponent,
    PieChartComponent,
    HomeComponent,
    AllStocksComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [
    DataService,
    MyDataStore,
    MarketDataStore,
    AppConfig,
       {
        provide: APP_INITIALIZER,
        useFactory: initializeApp,
        deps: [AppConfig],
        multi: true
       }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
