import { AppConfig } from './../app.config';
import { DataStore } from './../stores/data.store';
import { Component, OnInit, Input } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { IDatePrice } from '../models/holding.model';

@Component({
  selector: 'app-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.scss']
})
export class StockDetailComponent implements OnInit {

  @Input()
  holding: any;

  infoObj: Array<{ticker: string, info: Array<IDatePrice>}>;
  historyObj: Array<{ticker: string, history: Array<IDatePrice>}>;

  lineDataset: Array<ChartDataSets> = [];
  lineLabels: Array<string> = [];
  chartDays = 250; // Default one year

  changePct = {
    oneWeek: 0,
    oneMonth: 0,
    sixMonths: 0,
    oneYear: 0,
    fiveYears: 0
  };

  constructor(public dataStore: DataStore) {
    // Subscribe History
    this.dataStore.historyUpdated.subscribe(
      (newData: any) => {
        this.holding.history = newData.history;

        this.updateChart();
        this.setChangePct();
      }
    );

    // Subscribe Info
    this.dataStore.infoUpdated.subscribe(
      (newData: any) => {
        this.holding.info = newData.info;
      }
    );
  }

  // Check if we need to fetch new data or we can use cashed data
  ngOnInit() {
  }


  // *** Get Data Functions ***

  refreshHistory(ticker: string, exchange: string) {
    // this.dataStore.getHistory(ticker, exchange);
  }


  // *** Updating Chart Functions ***
  // TODO: Use for instead of all these ifs
  setChangePct() {
    this.changePct.oneWeek = this.calcChangePct(5);
    this.changePct.oneMonth = this.calcChangePct(20);

    if (this.holding.history.length > 125) {
      this.changePct.sixMonths = this.calcChangePct(125);
    }

    if (this.holding.history.length > 250) {
      this.changePct.oneYear = this.calcChangePct(250);
    } else {
      this.changePct.fiveYears = this.calcChangePct(0);
    }

    if (this.holding.history.length > 1250) {
      this.changePct.fiveYears = this.calcChangePct(1250);
    } else {
      this.changePct.fiveYears = this.calcChangePct(0);
    }
  }

  calcChangePct(day) {
    if (day === 0 ) { day = this.holding.history.length; }
    return Number(((this.holding.price - this.holding.history[this.holding.history.length - day].price) / this.holding.price) * 100);
  }

  updateChart() {
    this.resetChartData();
    let prices: Array<number> = [];

    this.holding.history.forEach(element => {
      prices.push(Number(element.price));
      this.lineLabels.push(String(element.date));
    });

    if (this.chartDays !== 0 && this.chartDays < prices.length) {
      prices = prices.slice(prices.length - this.chartDays);
      this.lineLabels = this.lineLabels.slice(this.lineLabels.length - this.chartDays);
    }

    this.lineDataset.push({
      data: prices,
      label: this.holding.ticker
    });
  }

  resetChartData() {
    this.lineDataset = [];
    this.lineLabels = [];
  }

  setTimeframe(days: number) {
    this.chartDays = days;
    this.updateChart();

  }

}

