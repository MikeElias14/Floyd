import { ChartOptions } from 'chart.js';
import { AppConfig } from './../app.config';
import { IDatePrice, IndexHolding } from './../models/holding.model';
import { IIndexInfo } from './../models/info.model';
import { DataStore } from './../stores/data.store';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  // TODO: Add futures to this (currently just index's (might work?))
  // TODO: Dont make these the last days values in the mornig. if before 9:30 make 0 untill new data.
   indexs: Array<IndexHolding> = [
    new IndexHolding('^GSPTSE'),
    new IndexHolding('^GSPC'),
    new IndexHolding('^DJI'),
    new IndexHolding('^IXIC'),
    new IndexHolding('^RUT'),
    new IndexHolding('^VIX')
  ];

  constructor(public dataStore: DataStore, private cd: ChangeDetectorRef) {
    // Subscribe Info: When get new info, add info to index
    this.dataStore.indexInfoUpdated.subscribe(
      (newData: Array<{ticker: string, info: IIndexInfo}>) => {
        newData.forEach(data => {
          this.indexs.find(myObj => myObj.ticker === data.ticker).info = data.info;
        });
        this.updateView();
      }
    );

    // Subscribe History: When get new history, add history to index
    this.dataStore.indexHistoryUpdated.subscribe(
      (newData: Array<{ticker: string, history: Array<IDatePrice>}>) => {
        newData.forEach(data => {
          this.indexs.find(myObj => myObj.ticker === data.ticker).history = data.history;
        });
        this.updateView();
      }
    );
  }

  ngOnInit() {
    this.dataStore.indexInfoUpdated.emit(
      JSON.parse(localStorage[AppConfig.settings.indexInfoCache] || '[]')
    );

    this.dataStore.historyUpdated.emit(
      JSON.parse(localStorage[AppConfig.settings.historyCache] || '[]')
    );

    this.getIndexInfo(this.indexs);
    this.getHistory(this.indexs, '1d', '15m');
  }

  getIndexInfo(indexs: Array<IndexHolding>) {
    this.dataStore.getIndex(indexs);
  }

  getHistory(indexs: Array<IndexHolding>, time: string, interval: string) {
    this.dataStore.getHistory(indexs, time, interval, true);
  }

  updateView() {
    this.indexs.forEach(index => {
      if (index.info && index.history.length > 0) {
        index.changepct = ((index.history[0].price / index.info.previousClose) - 1) * 100;
      }
    });
    this.cd.detectChanges();
  }
}
