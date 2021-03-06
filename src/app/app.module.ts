import { MaterialModule } from './material.module';
import { DataStore } from './stores/data.store';
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
import { LineChartComponent } from './line-chart/line-chart.component';
import { HeaderComponent } from './header/header.component';
import { DoughnutChartComponent } from './doughnut-chart/doughnut-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { HoldingDetailComponent } from './holding-detail/holding-detail.component';

export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}

@NgModule({
  declarations: [
    AppComponent,
    PieChartComponent,
    HomeComponent,
    AllStocksComponent,
    LineChartComponent,
    HeaderComponent,
    DoughnutChartComponent,
    BarChartComponent,
    HoldingDetailComponent
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
    DataStore,
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
