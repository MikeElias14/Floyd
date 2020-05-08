import { IHoldingEvent } from './../models/holding.model';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { IHoldingInfo } from '../models/info.model';
import { AppConfig } from './../app.config';
import { Holding, IDatePrice } from '../models/holding.model';
import { DataStore } from '../stores/data.store';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  myHoldings: MatTableDataSource<Holding> = new MatTableDataSource<Holding>();
  displayedColumns: string[] = ['exchange', 'ticker', 'owned', 'price', 'totalPrice', 'change', 'sector'];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  mpPageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;

  // Doughnut charts
  private _holdingPctData: Array<number> = [];
  get holdingPctData() { return this._holdingPctData; }
  set holdingPctData(data: Array<number>) { this._holdingPctData = data; }

  private _holdingPctLabels: Array<string> = [];
  get holdingPctLabels() { return this._holdingPctLabels; }
  set holdingPctLabels(data: Array<string>) { this._holdingPctLabels = data; }

  private _sectorPctData: Array<number> = [];
  get sectorPctData() { return this._sectorPctData; }
  set sectorPctData(data: Array<number>) { this._sectorPctData = data; }

  private _sectorPctLabels: Array<string> = [];
  get sectorPctLabels() { return this._sectorPctLabels; }
  set sectorPctLabels(data: Array<string>) { this._sectorPctLabels = data; }

  pctChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'right',
      align: 'start'
    }
  };

  private _detailHolding: Holding;
  get detailHolding() { return this._detailHolding; }
  set detailHolding(data: Holding) { this._detailHolding = data; }

  constructor(public dataStore: DataStore, private cd: ChangeDetectorRef) {

    // Subscribe myHoldings: This provides the basic data.
    this.dataStore.myHoldingsUpdated.subscribe(
      (newData: any) => {
        this.myHoldings.data = newData;
        this.detailHolding = this.myHoldings.data[0];
      }
    );

    // Subscribe Info: When get new info, add info to holding in datatable
    this.dataStore.infoUpdated.subscribe(
      (newData: Array<{ticker: string, info: IHoldingInfo}>) => {
        newData.forEach(data => {
          try { this.myHoldings.data.find(myObj => myObj.ticker === data.ticker).info = data.info; }
          catch { this.myHoldings.data.find(myObj => myObj.ticker.split('.')[0] === data.ticker).info = data.info; }
        });
      }
    );

    // Subscribe History: When get new history, add history to holding in datatable
    this.dataStore.historyUpdated.subscribe(
      (newData: Array<{ticker: string, history: Array<IDatePrice>}>) => {
        newData.forEach(data => {
          try { this.myHoldings.data.find(myObj => myObj.ticker === data.ticker).history = data.history; }
          catch { this.myHoldings.data.find(myObj => myObj.ticker.split('.')[0] === data.ticker).history = data.history; }
        });
      }
    );

    // Subscribe Dividend History: When get new history, add history to holding in datatable
    this.dataStore.dividendHistoryUpdated.subscribe(
      (newData: Array<{ticker: string, history: Array<IDatePrice>}>) => {
        newData.forEach(data => {
          try { this.myHoldings.data.find(myObj => myObj.ticker === data.ticker).diviendHistory = data.history; }
          catch { this.myHoldings.data.find(myObj => myObj.ticker.split('.')[0] === data.ticker).diviendHistory = data.history; }
        });
      }
    );

     // Subscribe Events: When get new history, add history to holding in datatable
    this.dataStore.eventsUpdated.subscribe(
      (newData: Array<{ticker: string, events: Array<IHoldingEvent>}>) => {
        newData.forEach(data => {
          try { this.myHoldings.data.find(myObj => myObj.ticker === data.ticker).events = data.events; }
          catch { this.myHoldings.data.find(myObj => myObj.ticker.split('.')[0] === data.ticker).events = data.events; }
        });
      }
    );

    this.myHoldings.paginator = this.paginator;
    this.myHoldings.sort = this.sort;
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

    this.dataStore.dividendHistoryUpdated.emit(
      JSON.parse(localStorage[AppConfig.settings.dividendHistoryCache] || '[]')
    );

    this.dataStore.eventsUpdated.emit(
      JSON.parse(localStorage[AppConfig.settings.eventsCache] || '[]')
    );

    // TODO: Bug when clearing cache and restarting
    this.getInfo(this.myHoldings.data);
    this.getHistory(this.myHoldings.data, '5y', '1d');
    this.getDividendHistory(this.myHoldings.data);
    this.getEvents(this.myHoldings.data);

    this.updatePctCharts();  // TODO: charts dont appear right away
  }


  /* For Datastore */

  getMyHoldings() {
    this.dataStore.getMyHoldings();
  }

  getInfo(holdings: Array<Holding>) {
    this.dataStore.getInfo(holdings);
  }

  getHistory(holdings: Array<Holding>, time: string, interval: string) {
    this.dataStore.getHistory(holdings, time, interval);
  }

  getDividendHistory(holdings: Array<Holding>) {
    this.dataStore.getDividendHistory(holdings);
  }

  getEvents(holdings: Array<Holding>) {
    this.dataStore.getEvents(holdings);
  }


  /* For Table */

  applyFilter(filterValue: string) {
    this.myHoldings.filter = filterValue.trim().toLowerCase();

    if (this.myHoldings.paginator) {
      this.myHoldings.paginator.firstPage();
    }
  }

  setDetailHolding(row: Holding) {
    const holding: Holding = this.myHoldings.data.find(myObj => myObj.ticker === row.ticker);
    this.setDetail = holding;
  }

  get totalValue() {
    let total = 0;
    this.myHoldings.data.forEach(holding => {
      total += holding.price * holding.owned;
    });
    return Number(total.toFixed(2));
  }

  get totalPctChange() {
    let total = 0;
    this.myHoldings.data.forEach(holding => {
      total += holding.changepct;
    });
    total = total / this.myHoldings.data.length;
    return Number(total.toFixed(2));
  }


  /* For Doughnut (Pct) Charts */

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

    this._holdingPctData = pcts;
    this._holdingPctLabels = tickers;
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

    this._sectorPctData = pcts;
    this._sectorPctLabels = sectors;
  }

  /* Detail  */
  get getDetail() {
    return this.detailHolding;
  }

  set setDetail(holding: Holding) {
    this.detailHolding = holding;
  }

  /* Calendar View */


}
