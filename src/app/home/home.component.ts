import { IHoldingInfo } from './../models/holding-info.model';
import { AppConfig } from './../app.config';
import { Holding, IDatePrice } from '../models/holding.model';
import { DataStore } from '../stores/data.store';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ChartDataSets } from 'chart.js';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  myHoldings = new MatTableDataSource<Holding>();
  displayedColumns: string[] = ['ticker', 'owned', 'price', 'totalPrice', 'exchange', 'sector'];
  selection = new SelectionModel<Holding>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  mpPageSizeOptions: number[] = [10, 25, 100];
  pageEvent: PageEvent;

  @ViewChild(MatSort) sort: MatSort;

  constructor(public dataStore: DataStore) {

    // Subscribe myHoldings: This provides the basic data.
    this.dataStore.myHoldingsUpdated.subscribe(
      (newData: any) => {
        this.myHoldings = new MatTableDataSource(newData);

        this.myHoldings.paginator = this.paginator;
        this.myHoldings.sort = this.sort;
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

    this.myHoldings.sortingDataAccessor = (item, property) => {
      switch (property) {
        default: return item[property];
      }
    };

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
  }

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
}
