import { AppConfig } from './../app.config';
import { Holding, IDatePrice } from './../models/holding.model';
import { DataService } from './data.service';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { IHoldingInfo } from '../models/holding-info.model';

@Injectable()
export class DataStore {

  myLastUpdated = new Date();
  myHoldings$: Observable<Array<Holding>>;
  myHoldingsUpdated = new EventEmitter<Array<Holding>>();

  marketLastUpdated = new Date();
  marketHoldings$: Observable<Array<Holding>>;
  marketHoldingsUpdated = new EventEmitter<Array<Holding>>();

  historyLastUpdated = new Date();
  history$: Observable<Array<IDatePrice>>;
  historyUpdated = new EventEmitter<{ticker: string, history: Array<IDatePrice>}>();

  infoLastUpdated = new Date();
  info$: Observable<IHoldingInfo>;
  infoUpdated = new EventEmitter<{ticker: string, info: IHoldingInfo}>();

  constructor(private dataService: DataService) {
    DataStore.setLocal([], AppConfig.settings.infoCache);
    DataStore.setLocal([], AppConfig.settings.historyCache);

    this.loadMyHoldings();
    this.loadMarketHoldings();
  }

  public static setLocal(whatData: any, cacheName: string) {
    localStorage[cacheName] = JSON.stringify(whatData);
  }

  public static getLocal(cacheName: string) {
    return  JSON.parse(localStorage[cacheName]);
  }


  // *** My Holdings ***

  refreshMyData() {
    this.loadMyHoldings();
    this.myLastUpdated = new Date();
  }

  loadMyHoldings() {
    let holdings: Array<Holding> = [];
    this.myHoldings$ = this.dataService.getMyHoldings();
    this.myHoldings$.subscribe(next => {
      if (next != null) {
        holdings = this.transformHoldings(next);
      }

      DataStore.setLocal(holdings, AppConfig.settings.myHoldingsCache);
      this.myHoldingsUpdated.emit(holdings);
    });
  }

  // *** Market Holdings ***

  refreshMarketData() {
    this.loadMarketHoldings();
    this.marketLastUpdated = new Date();
  }

  loadMarketHoldings() {
    let holdings: Array<Holding> = [];
    this.marketHoldings$ = this.dataService.getTSEHoldings();
    this.marketHoldings$.subscribe(next => {
      if (next != null) {
        holdings = this.transformHoldings(next);
      }

      DataStore.setLocal(holdings, AppConfig.settings.marketHoldingsCache);
      this.marketHoldingsUpdated.emit(holdings);
    });
  }

  transformHoldings(dataReceived: Array<any>): Array<Holding> {
    const tempArray: Array<Holding> = [];

    for (const i of dataReceived) {
      let name: string;
      let owned: number;

      ('gsx$name' in i ) ? name = i.gsx$name.$t.trim() : name = '';
      ('gsx$owned' in i ) ? owned = Number(i.gsx$owned.$t.trim()) : owned = 0;

      tempArray.push(
        new Holding (
          i.gsx$ticker.$t.trim(),
          i.gsx$exchange.$t.trim(),
          i.gsx$sector.$t.trim(),
          Number(i.gsx$price.$t.trim()),
          Number(i.gsx$changepct.$t.trim()),
          Number(i.gsx$marketcap.$t.trim()),
          name = name,
          owned = owned
        )
      );
    }
    return tempArray;
  }


  // *** History ***

  refreshHistory(ticker: string, exchange: string) {
    this.loadHistory(ticker, exchange);
    this.historyLastUpdated = new Date();
  }

  loadHistory(ticker: string, exchange: string) {
    let history: Array<IDatePrice> = [];
    this.history$ = this.dataService.getHistory(ticker, exchange);
    this.history$.subscribe(next => {
      if (next != null) {
        history = this.transformHistory(next);
      }

      const histroyObj = DataStore.getLocal(AppConfig.settings.historyCache);
      const index = histroyObj.findIndex(myObj => myObj.ticker === ticker);
      (index === -1) ? histroyObj.push({ticker: `${ticker}`, history: history}) :  histroyObj[index].history = history;

      DataStore.setLocal(histroyObj, AppConfig.settings.historyCache);
      this.historyUpdated.emit({ticker: `${ticker}`, history: history});
    });
  }

  transformHistory(dataReceived: Array<any>): Array<IDatePrice> {
    const history: Array<IDatePrice> = [];

    dataReceived.forEach(obj => {
      history.push({
        price: Number(Object.values(obj)[0]),
        date: Object.keys(obj)[0]
      });
    });

    return history;
  }


  // *** Info ***

  refreshInfo(ticker: string, exchange: string) {
    this.loadInfo(ticker, exchange);
    this.infoLastUpdated = new Date();
  }

  loadInfo(ticker: string, exchange: string) {
    let info: IHoldingInfo;
    this.info$ = this.dataService.getInfo(ticker, exchange);
    this.info$.subscribe(next => {

      if (next != null) {
        info = this.transformInfo(next);
      }

      const infoObj = DataStore.getLocal(AppConfig.settings.infoCache);
      const index = infoObj.findIndex(myObj => myObj.ticker === ticker);
      (index === -1) ? infoObj.push({ticker: `${ticker}`, info: info}) :  infoObj[index].info = info;

      DataStore.setLocal(infoObj, AppConfig.settings.infoCache);
      this.infoUpdated.emit({ticker: `${ticker}`, info: info});
    });
  }

  transformInfo(dataReceived: any): IHoldingInfo {
    const info = dataReceived as IHoldingInfo;
    return info;
  }
}
