import { DataStore } from './../stores/data.store';
import { Component, OnInit, Input } from '@angular/core';
import { ChartDataSets } from 'chart.js';

@Component({
  selector: 'app-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.scss']
})
export class StockDetailComponent implements OnInit {
  @Input()
  holding: any;

  lineDataset: Array<ChartDataSets> = [];
  lineLabels: Array<string> = [];
  chartDays = 250; // Default one year

  historyObjName = 'History';

  changePct = {
    oneWeek: 0,
    oneMonth: 0,
    threeMonths: 0,
    sixMonths: 0,
    oneYear: 0,
    fiveYears: 0
  }

  constructor(public dataStore: DataStore) {
    this.dataStore.historyUpdated.subscribe(
      (newData: any) => {
        this.holding.history = newData;

        this.updateChart();
        this.getChangePct();
      }
    );
  }

  ngOnInit() {
    this.dataStore.marketHoldingsUpdated.emit(
      // use the local storage if there until HTTP call retrieves something
      JSON.parse(localStorage[this.dataStore.dataObjects.getCacheName(this.historyObjName)] || '[]')
    );

    this.refreshHistory(this.holding.ticker, this.holding.exchange);
  }

  refreshHistory(ticker: string, exchange: string) {
    this.dataStore.refreshHistory(ticker, exchange);
  }

  getChangePct() {
    this.changePct.oneWeek = ((this.holding.price - this.holding.history[5].price) / this.holding.price) * 100;
    this.changePct.oneMonth = ((this.holding.price - this.holding.history[20].price) / this.holding.price) * 100;
    this.changePct.threeMonths = ((this.holding.price - this.holding.history[60].price) / this.holding.price) * 100;
    this.changePct.sixMonths = ((this.holding.price - this.holding.history[125].price) / this.holding.price) * 100;
    this.changePct.oneYear = ((this.holding.price - this.holding.history[250].price) / this.holding.price) * 100;
    this.changePct.fiveYears = ((this.holding.price - this.holding.history[1250].price) / this.holding.price) * 100;
  }

  updateChart() {
    this.resetChartData();
    let prices: Array<number> = [];

    this.holding.history.forEach(element => {
      prices.push(Number(element.price));
      this.lineLabels.push(String(element.date));
    });

    if (this.chartDays !== 0) {
      prices = prices.slice(0, this.chartDays);
      this.lineLabels = this.lineLabels.slice(0, this.chartDays);
    }

    prices.reverse();
    this.lineLabels.reverse();

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

