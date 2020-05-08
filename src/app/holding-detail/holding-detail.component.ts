import { Holding } from './../models/holding.model';
import { ChartOptions, ChartDataSets } from 'chart.js';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-holding-detail',
  templateUrl: './holding-detail.component.html',
  styleUrls: ['./holding-detail.component.scss']
})
export class HoldingDetailComponent {

  @Input()
  set holding(holding: Holding) {
    this._holding = holding;
    this.updateChart();
  }

  _holding: Holding;

  dataset: Array<ChartDataSets> = [];
  labels: Array<string> = [];
  currentChartTime = 'oneYear'; // Default one year

  chartTime = {
    oneWeek: {
      days: 5,
      changePct: 0
    },
    oneMonth: {
      days: 22,
      changePct: 0
    },
    sixMonths: {
      days: 125,
      changePct: 0
    },
    oneYear: {
      days: 250,
      changePct: 0
    },
    fiveYears: {
      days: 1250,
      changePct: 0
    },
    allTime: {
      days: 0,
      changePct: 0
    }
  };

  chartOptions: ChartOptions = {
    responsive: true,
    elements: {
      point: {
        radius: 1
      },
      line: {
        tension: 0
      }
    }
  };

  constructor() { }

  // *** Updating Chart Functions ***
  setChangePct() {
    Object.keys(this.chartTime).forEach(time => {
      if (this._holding.history.length > this.chartTime[time].days) {
        this.chartTime[time].changePct = this.calcChangePct(this.chartTime[time].days);
      } else {
        this.chartTime[time].changePct = this.calcChangePct(0);
      }
    });
  }

  calcChangePct(day) {
    if (day === 0 ) { day = this._holding.history.length; }
    return Number((((
      this._holding.history[this._holding.history.length - day].price - this._holding.price)
       / this._holding.history[this._holding.history.length - day].price) * -100).toFixed(2));
  }

  updateChart() {
    this.setChangePct();
    this.resetChartData();

    // update data
    let prices: Array<number> = [];

    this._holding.history.forEach(element => {
      prices.push(Number(element.price));
      this.labels.push(String(element.date));
    });

    if ( this.currentChartTime !== 'alltime' && this.chartTime[this.currentChartTime].days < prices.length) {
      prices = prices.slice(prices.length - this.chartTime[this.currentChartTime].days);
      this.labels = this.labels.slice(this.labels.length - this.chartTime[this.currentChartTime].days);
    }

    this.dataset.push({
      data: prices,
      label: this._holding.ticker
    });
  }

  resetChartData() {
    this.dataset = [];
    this.labels = [];
  }

  setTimeframe(time: string) {
    this.currentChartTime = time;
    this.updateChart();
  }

  // get divDataset() {
  //   return
  // }

  // get divLabels() {
  //   return
  // }



}
