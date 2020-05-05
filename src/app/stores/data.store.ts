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
  history$: Observable<Array<{ticker: string, history: Array<IDatePrice>}>>;
  historyUpdated = new EventEmitter<Array<{ticker: string, history: Array<IDatePrice>}>>();

  infoLastUpdated = new Date();
  info$: Observable<Array<IHoldingInfo>>;
  infoUpdated = new EventEmitter<Array<{ticker: string, info: IHoldingInfo}>>();

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

  getHistory(holdings: Array<Holding>, time: string, interval: string) {
    this.loadHistory(holdings, time, interval);
    this.historyLastUpdated = new Date();
  }

  loadHistory(holdings: Array<Holding>, time: string, interval: string) {
    let history: Array<{ticker: string, history: Array<IDatePrice>}> = [];
    this.history$ = this.dataService.getHistory(holdings, time, interval);
    this.history$.subscribe(next => {
      if (next != null) {
        history = this.transformHistory(next);
      }

      // update history cache
      const histroyObj = DataStore.getLocal(AppConfig.settings.historyCache);
      history.forEach(holding => {
        const index = histroyObj.findIndex(myObj => myObj.ticker === holding.ticker);
        (index === -1) ? histroyObj.push({ticker: `${holding.ticker}`, history: holding.history}) :  histroyObj[index].history = holding.history;
      });

      DataStore.setLocal(histroyObj, AppConfig.settings.historyCache);
      this.historyUpdated.emit(history);
    });
  }

  transformHistory(dataReceived: Array<any>): Array<{ticker: string, history: Array<IDatePrice>}> {
    const history: Array<{ticker: string, history: Array<IDatePrice>}> = [];

    dataReceived.forEach(data => {
      const objHistory: {ticker: string, history: Array<IDatePrice>} = {ticker: '', history: []};
      objHistory.ticker = data.ticker.split('.')[0];
      data.history.forEach(obj => {
        objHistory.history.push({
          price: Number(Object.values(obj)[0]),
          date: Object.keys(obj)[0]
        });
      });
      history.push(objHistory);
    });

    return history;
  }


  // *** Info ***

  getInfo(holdings: Array<Holding>) {
    this.loadInfo(holdings);
    this.infoLastUpdated = new Date();
  }

  loadInfo(holdings) {
    let info: Array<{ticker: string, info: IHoldingInfo}>;
    this.info$ = this.dataService.getInfo(holdings);
    this.info$.subscribe(next => {

      if (next != null) {
        info = this.transformInfo(next);
      }

      // update info cache
      const infoObj = DataStore.getLocal(AppConfig.settings.infoCache);
      info.forEach(holding => {
        const index = infoObj.findIndex(myObj => myObj.ticker === holding.ticker);
        (index === -1) ? infoObj.push({ticker: `${holding.ticker}`, info: holding.info}) :  infoObj[index].info = holding.info;
      });

      DataStore.setLocal(infoObj, AppConfig.settings.infoCache);
      this.infoUpdated.emit(info);
    });
  }

  transformInfo(dataReceived: Array<any>): Array<{ticker: string, info: IHoldingInfo}> {
    const info: Array<{ticker: string, info: IHoldingInfo}> = [];
    dataReceived.forEach(data => {
      info.push({ticker: data.ticker.split('.')[0], info: data.info as IHoldingInfo});
    });
    return info;
  }
}
