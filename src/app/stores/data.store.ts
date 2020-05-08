import { IIndexInfo } from './../models/info.model';
import { AppConfig } from './../app.config';
import { Holding, IDatePrice, IndexHolding, IHoldingEvent } from './../models/holding.model';
import { DataService } from './data.service';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { IHoldingInfo } from '../models/info.model';

@Injectable()
export class DataStore {

  myHoldings$: Observable<Array<Holding>>;
  myHoldingsUpdated = new EventEmitter<Array<Holding>>();

  marketHoldings$: Observable<Array<Holding>>;
  marketHoldingsUpdated = new EventEmitter<Array<Holding>>();

  history$: Observable<Array<{ticker: string, history: Array<IDatePrice>}>>;
  historyUpdated = new EventEmitter<Array<{ticker: string, history: Array<IDatePrice>}>>();

  info$: Observable<Array<IHoldingInfo>>;
  infoUpdated = new EventEmitter<Array<{ticker: string, info: IHoldingInfo}>>();

  indexHistory$: Observable<Array<{ticker: string, history: Array<IDatePrice>}>>;
  indexHistoryUpdated = new EventEmitter<Array<{ticker: string, history: Array<IDatePrice>}>>();

  dividendHistory$: Observable<Array<{ticker: string, history: Array<IDatePrice>}>>;
  dividendHistoryUpdated = new EventEmitter<Array<{ticker: string, history: Array<IDatePrice>}>>();

  indexInfo$: Observable<Array<IIndexInfo>>;
  indexInfoUpdated = new EventEmitter<Array<{ticker: string, info: IIndexInfo}>>();

  events$: Observable<Array<IHoldingEvent>>;
  eventsUpdated = new EventEmitter<Array<{ticker: string, events: Array<IHoldingEvent>}>>();

  constructor(private dataService: DataService) {
    // Init Cache's
    DataStore.setLocal([], AppConfig.settings.infoCache);
    DataStore.setLocal([], AppConfig.settings.historyCache);
    DataStore.setLocal([], AppConfig.settings.indexInfoCache);
    DataStore.setLocal([], AppConfig.settings.indexHistoryCache);
    DataStore.setLocal([], AppConfig.settings.dividendHistoryCache);
    DataStore.setLocal([], AppConfig.settings.eventsCache);

    // Load basic holding data
    this.getMyHoldings();
    this.getMarketHoldings();
  }

  /* Cache */

  public static setLocal(data: any, cacheName: string) {
    localStorage[cacheName] = JSON.stringify(data);
  }

  public static getLocal(cacheName: string) {
    return  JSON.parse(localStorage[cacheName]);
  }

  public static updateLocal(data: any, type: string, cacheName: string) {
    // Get
    const localObj = DataStore.getLocal(cacheName);

    // Update
    data.forEach(dataObj => {
      const index = localObj.findIndex(indexObj => indexObj.ticker === dataObj.ticker);
      (index === -1) ?
      localObj.push({ticker: `${dataObj.ticker}`, data: dataObj[type]}) :  localObj[index].data = dataObj[type];
    });

    // Set
    DataStore.setLocal(localObj, cacheName);
  }

  /* My Holdings */

  getMyHoldings() {
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

  /* Market Holdings */

  getMarketHoldings() {
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

  /* History */

  getHistory(holdings: Array<any>, time: string, interval: string, index: boolean = false) {
    let history: Array<{ticker: string, history: Array<IDatePrice>}> = [];
    this.history$ = this.dataService.getHistory(holdings, time, interval);
    this.history$.subscribe(next => {
      if (next != null) {
        history = this.transformHistory(next);
      }

      if (index) {
        DataStore.updateLocal(history, 'history', AppConfig.settings.indexHistoryCache);
        this.indexHistoryUpdated.emit(history);
      } else {
        DataStore.updateLocal(history, 'history', AppConfig.settings.historyCache);
        this.historyUpdated.emit(history);
      }
    });
  }

  /* Dividend History */

  getDividendHistory(holdings: Array<Holding>) {
    let dividend: Array<{ticker: string, history: Array<IDatePrice>}> = [];
    this.dividendHistory$ = this.dataService.getDividendHistory(holdings);
    this.dividendHistory$.subscribe(next => {
      if (next != null) {
        dividend = this.transformHistory(next);
      }

      DataStore.updateLocal(dividend, 'history', AppConfig.settings.dividendHistoryCache);
      this.dividendHistoryUpdated.emit(dividend);
    });
  }

  /* Info */

  getInfo(holdings: Array<Holding>) {
    let info: Array<{ticker: string, info: IHoldingInfo}>;
    this.info$ = this.dataService.getInfo(holdings);
    this.info$.subscribe(next => {

      if (next != null) {
        info = this.transformInfo(next);
      }

      DataStore.updateLocal(info, 'info', AppConfig.settings.infoCache);
      this.infoUpdated.emit(info);
    });
  }

  /* Index Info*/

  getIndexInfo(indexs: Array<IndexHolding>) {
    let indexInfo: Array<{ticker: string, info: IIndexInfo}>;
    this.indexInfo$ = this.dataService.getInfo(indexs, true);
    this.indexInfo$.subscribe(next => {

      if (next != null) {
        indexInfo = this.transformIndexInfo(next);
      }

      DataStore.updateLocal(indexInfo, 'info', AppConfig.settings.indexInfoCache);
      this.indexInfoUpdated.emit(indexInfo);
    });
  }

  /* Events */

  getEvents(holdings: Array<Holding>) {
    let events: Array<{ticker: string, events: Array<IHoldingEvent>}> = [];
    this.events$ = this.dataService.getEvents(holdings);
    this.events$.subscribe(next => {
      if (next != null) {
        events = this.transformEvents(next);
      }

      DataStore.updateLocal(events, 'events', AppConfig.settings.eventsCache);
      this.eventsUpdated.emit(events);
    });
  }

  /* Helpers */

  private transformHoldings(dataReceived: Array<any>): Array<Holding> {
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


  transformHistory(dataReceived: Array<any>): Array<{ticker: string, history: Array<IDatePrice>}> {
    const history: Array<{ticker: string, history: Array<IDatePrice>}> = [];

    dataReceived.forEach(data => {
      const historyObj: {ticker: string, history: Array<IDatePrice>} = {ticker: this.transformTicker(data.ticker), history: []};

      if (data.history.length > 0) {
        data.history.forEach(obj => {
          historyObj.history.push({
            price: Number(Object.values(obj)[0]),
            date: Object.keys(obj)[0]
          });
        });
        history.push(historyObj);
      }
    });

    return history;
  }


  transformInfo(dataReceived: Array<any>): Array<{ticker: string, info: IHoldingInfo}> {
    const info: Array<{ticker: string, info: IHoldingInfo}> = [];
    dataReceived.forEach(data => {
      info.push({ticker: this.transformTicker(data.ticker), info: data.info as IHoldingInfo});
    });
    return info;
  }


  transformIndexInfo(dataReceived: Array<any>): Array<{ticker: string, info: IIndexInfo}> {
    const info: Array<{ticker: string, info: IIndexInfo}> = [];
    dataReceived.forEach(data => {
      info.push({ticker: this.transformTicker(data.ticker), info: data.info as IIndexInfo});
    });
    return info;
  }


  transformEvents(dataReceived: Array<any>): Array<{ticker: string, events: Array<IHoldingEvent>}> {
    const events: Array<{ticker: string, events: Array<IHoldingEvent>}> = [];

    dataReceived.forEach(data => {
      const objEvent: {ticker: string, events: Array<IHoldingEvent>} = {ticker: this.transformTicker(data.ticker), events: []};

      if (data.events.length > 0) {
        data.events.forEach(obj => {
          objEvent.events.push(obj as IHoldingEvent);
        });
        events.push(objEvent);
      }
    });

    return events;
  }

  transformTicker(ticker: string): string {
    let res = ticker.substr(0, ticker.lastIndexOf('.'));  // To get rid of '.TO'
    if (res === '') {
      res = ticker;
    }
    return res;
  }
}
