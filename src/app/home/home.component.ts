import { ChartDataSets, ChartOptions } from 'chart.js';
import { IHoldingInfo } from '../models/info.model';
import { AppConfig } from './../app.config';
import { Holding, IDatePrice } from '../models/holding.model';
import { DataStore } from '../stores/data.store';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  myHoldings = new MatTableDataSource<Holding>();
  displayedColumns: string[] = ['exchange', 'ticker', 'owned', 'price', 'totalPrice', 'changePrice', 'sector'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  mpPageSizeOptions: number[] = [10, 25, 100];
  pageEvent: PageEvent;
  // TODO: sorting broken
  @ViewChild(MatSort) sort: MatSort;

  // Doughnut charts
  holdingPctData: Array<number> = [];
  holdingPctLabels: Array<string> = [];

  sectorPctData: Array<number> = [];
  sectorPctLabels: Array<string> = [];

  pctChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'right',
      align: 'start'
    }
  };

  // For detail view I will move to its own compoent once I get it working here
  detailHolding: Holding;

  detailDataset: Array<ChartDataSets> = [];
  detailLabels: Array<string> = [];
  chartDays = 250; // Default one year

  changePct = {
    oneWeek: 0,
    oneMonth: 0,
    sixMonths: 0,
    oneYear: 0,
    fiveYears: 0
  };


  constructor(public dataStore: DataStore) {

    // Subscribe myHoldings: This provides the basic data.
    this.dataStore.myHoldingsUpdated.subscribe(
      (newData: any) => {
        this.myHoldings = new MatTableDataSource(newData);

        this.myHoldings.paginator = this.paginator;
        this.myHoldings.sort = this.sort;

        this.detailHolding = this.myHoldings.data[0];
      }
    );

    // Subscribe Info: When get new info, add info to holding in datatable
    this.dataStore.infoUpdated.subscribe(
      (newData: Array<{ticker: string, info: IHoldingInfo}>) => {
        newData.forEach(data => {
          this.myHoldings.data.find(myObj => myObj.ticker === data.ticker).info = data.info;
        });
      }
    );

    // Subscribe History: When get new history, add history to holding in datatable
    this.dataStore.historyUpdated.subscribe(
      (newData: Array<{ticker: string, history: Array<IDatePrice>}>) => {
        newData.forEach(data => {
          this.myHoldings.data.find(myObj => myObj.ticker === data.ticker).history = data.history;
        });
      }
    );
  }

  ngOnInit() {
    this.dataStore.myHoldingsUpdated.emit(
      JSON.parse(localStorage[AppConfig.settings.myHoldingsCache] || '[]')
    );

    this.dataStore.infoUpdated.emit(
      JSON.parse(localStorage[AppConfig.settings.infoCache] || '[]')
    );

    this.dataStore.historyUpdated.emit(
      JSON.parse(localStorage[AppConfig.settings.historyCache] || '[]')
    );

    // TODO: Bug when clearing cache and restarting
    this.getInfo(this.myHoldings.data);
    this.getHistory(this.myHoldings.data, '5y', '1d');

    // TODO: These dont update on their own...
    this.updateDetailChart();
    this.updatePctCharts();
  }


  // *** For Datastore ***

  refreshMyHoldings() {
    this.dataStore.loadMyHoldings();
  }

  getInfo(holdings: Array<Holding>) {
    this.dataStore.getInfo(holdings);
  }

  getHistory(holdings: Array<Holding>, time: string, interval: string) {
    this.dataStore.getHistory(holdings, time, interval);
  }

  // *** For Table ***

  applyFilter(filterValue: string) {
    this.myHoldings.filter = filterValue.trim().toLowerCase();

    if (this.myHoldings.paginator) {
      this.myHoldings.paginator.firstPage();
    }
  }

  setDetail(row: Holding) {
    this.detailHolding = this.myHoldings.data.find(myObj => myObj.ticker === row.ticker);
    this.updateDetailChart();
    this.updatePctCharts(); // Just for now.. TODO make this not have to be here
  }


  // *** For Doughnut Charts ***

  updatePctCharts() {
    this.updateHoldingPcts();
    this.updateSectorPcts();
  }

  updateHoldingPcts() {
    const prices: Array<number> = [];
    const pcts: Array<number> = [];
    const tickers: Array<string> = [];
    let totalValue = 0;

    this.myHoldings.data.forEach(holding => {
      tickers.push(holding.ticker);
      prices.push(holding.price * holding.owned);
      totalValue += holding.price * holding.owned;
    });

    prices.forEach(price => {
      pcts.push(Number(((price / totalValue) * 100).toFixed(2)));
    });

    this.holdingPctData = pcts;
    this.holdingPctLabels = tickers;
  }

  updateSectorPcts() {
    const prices: Array<{sector: string, price: number}> = [];
    const pcts: Array<number> = [];
    const sectors: Array<string> = [];
    let totalValue = 0;

    this.myHoldings.data.forEach(holding => {
      const listIndex = prices.findIndex(myObj => myObj.sector === holding.sector);
      (listIndex === -1) ?
        prices.push({sector: `${holding.sector}`, price: holding.price * holding.owned}) :
          prices[listIndex].price += holding.price * holding.owned;
      totalValue += holding.price * holding.owned;
    });

    prices.forEach(price => {
      pcts.push(Number(((price.price / totalValue) * 100).toFixed(2)));
      sectors.push(price.sector);
    });

    this.sectorPctData = pcts;
    this.sectorPctLabels = sectors;
  }



  // *** Detail view I will move to its own component later ***

  // *** Updating Chart Functions ***
  // TODO: Use for instead of all these ifs
  setDetailChangePct() {
    this.changePct.oneWeek = this.calcChangePct(5);
    this.changePct.oneMonth = this.calcChangePct(20);

    if (this.detailHolding.history.length > 125) {
      this.changePct.sixMonths = this.calcChangePct(125);
    }

    if (this.detailHolding.history.length > 250) {
      this.changePct.oneYear = this.calcChangePct(250);
    } else {
      this.changePct.fiveYears = this.calcChangePct(0);
    }

    if (this.detailHolding.history.length > 1250) {
      this.changePct.fiveYears = this.calcChangePct(1250);
    } else {
      this.changePct.fiveYears = this.calcChangePct(0);
    }
  }

  calcChangePct(day) {
    if (day === 0 ) { day = this.detailHolding.history.length; }
    return Number(((
      this.detailHolding.price - this.detailHolding.history[this.detailHolding.history.length - day].price)
       / this.detailHolding.price) * 100);
  }

  updateDetailChart() {
    this.setDetailChangePct();
    this.resetDetailChartData();
    let prices: Array<number> = [];

    this.detailHolding.history.forEach(element => {
      prices.push(Number(element.price));
      this.detailLabels.push(String(element.date));
    });

    if (this.chartDays !== 0 && this.chartDays < prices.length) {
      prices = prices.slice(prices.length - this.chartDays);
      this.detailLabels = this.detailLabels.slice(this.detailLabels.length - this.chartDays);
    }

    this.detailDataset.push({
      data: prices,
      label: this.detailHolding.ticker
    });
  }

  resetDetailChartData() {
    this.detailDataset = [];
    this.detailLabels = [];
  }

  setTimeframe(days: number) {
    this.chartDays = days;
    this.updateDetailChart();
  }


}
