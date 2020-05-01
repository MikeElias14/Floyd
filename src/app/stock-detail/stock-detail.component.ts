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
  chartDays = 0;

  historyObjName = 'History';

  constructor(public dataStore: DataStore) {
    this.dataStore.historyUpdated.subscribe(
      (newData: any) => {
        this.holding.history = newData;

        this.updateChart();
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

  updateChart() {
    this.resetChartData();
    let prices: Array<number> = [];

    this.holding.history.forEach(element => {
      prices.push(Number(element.price));
      this.lineLabels.push(String(element.date));
    });

    prices.reverse();
    this.lineLabels.reverse();

    if (this.chartDays !== 0) {
      prices = prices.slice(0, this.chartDays);
      this.lineLabels = this.lineLabels.slice(0, this.chartDays);
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

