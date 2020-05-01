import { MyHolding, MarketHolding, DatePrice } from './../models/holding.model';
import { DataService } from './data.service';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class DataStore {
  dataObjects = new DataObjects();

  myLastUpdated = new Date();
  myHoldings$: Observable<Array<MyHolding>>;
  myHoldingsUpdated = new EventEmitter<Array<MyHolding>>();

  marketLastUpdated = new Date();
  marketHoldings$: Observable<Array<MarketHolding>>;
  marketHoldingsUpdated = new EventEmitter<Array<MarketHolding>>();

  historyLastUpdated = new Date();
  history$: Observable<Array<DatePrice>>;
  historyUpdated = new EventEmitter<Array<DatePrice>>();

  constructor(private dataService: DataService) {
    this.loadMyHoldings();
    this.loadMarketHoldings();
  }

  public static setLocal(whatData: any, cacheName: string) {
    localStorage[cacheName] = JSON.stringify(whatData);
  }

  // My Holdings

  refreshMyData() {
    this.loadMyHoldings();
    this.myLastUpdated = new Date();
  }

  loadMyHoldings() {
    let holdings: Array<MyHolding> = [];
    this.myHoldings$ = this.dataService.getMyHoldings();
    this.myHoldings$.subscribe(next => {
      if (next != null) {
        holdings = this.transformMyHoldings(next);
      }

      DataStore.setLocal(holdings, this.dataObjects.getCacheName('MyHoldings'));
      this.myHoldingsUpdated.emit(holdings);
    });
  }

  transformMyHoldings(dataReceived: Array<any>): Array<MyHolding> {
    const tempArray: Array<MyHolding> = [];

    for (const i of dataReceived) {
      tempArray.push(
        new MyHolding (
          i.gsx$ticker.$t.trim(),
          i.gsx$exchange.$t.trim(),
          Number(i.gsx$numbershares.$t.trim()),
          Number(i.gsx$shareprice.$t.replace('$', '').trim()),
          Number(i.gsx$totalprice.$t.replace('$', '').trim()),
          i.gsx$sector.$t.trim(),
          []
        )
      );
    }
    return tempArray;
  }


  // Market Holdings

  refreshMarketData() {
    this.loadMarketHoldings();
    this.marketLastUpdated = new Date();
  }

  loadMarketHoldings() {
    let holdings: Array<MarketHolding> = [];
    this.marketHoldings$ = this.dataService.getTSEHoldings();
    this.marketHoldings$.subscribe(next => {
      if (next != null) {
        holdings = this.transformMarketHoldings(next);
      }

      DataStore.setLocal(holdings, this.dataObjects.getCacheName('MarketHoldings'));
      this.marketHoldingsUpdated.emit(holdings);
    });
  }

  transformMarketHoldings(dataReceived: Array<any>): Array<MarketHolding> {
    const tempArray: Array<MarketHolding> = [];

    for (const i of dataReceived) {
      tempArray.push(
        new MarketHolding (
          i.gsx$ticker.$t.trim(),
          i.gsx$exchange.$t.trim(),
          i.gsx$name.$t.trim(),
          i.gsx$sector.$t.trim(),
          Number(i.gsx$price.$t.trim()),
          Number(i.gsx$high52.$t.trim()),
          Number(i.gsx$low52.$t.trim()),
          Number(i.gsx$changepct.$t.trim()),
          Number(i.gsx$marketcap.$t.trim()),
          []
        )
      );
    }
    return tempArray;
  }


  // History
  // TODO: Cash each one in the holding it belongs to

  refreshHistory(ticker: string, exchange: string) {
    this.loadHistory(ticker, exchange);
    this.historyLastUpdated = new Date();
  }

  loadHistory(ticker: string, exchange: string) {
    let history: Array<DatePrice> = [];
    this.history$ = this.dataService.getHistory(ticker, exchange);
    this.history$.subscribe(next => {
      if (next != null) {
        history = this.transformHistory(next);
      }

      DataStore.setLocal(history, this.dataObjects.getCacheName('History'));
      this.historyUpdated.emit(history);
    });
  }

  transformHistory(dataReceived: Array<any>): Array<DatePrice> {
    const history: Array<DatePrice> = [];

    for (const [date, price] of Object.entries(dataReceived['Time Series (Daily)'])) {
      history.push(
        new DatePrice (
          Number(price['4. close']),
          String(date)
        )
      );
    }
    return history;
  }
}


export class DataObjects {
  dataObjects =  [
    {objName: 'MyHoldings', cache: 'myHoldingsCache', useYN: 'Y', labelName: 'MyHolding'},
    {objName: 'MarketHoldings', cache: 'marketHoldingsCache', useYN: 'Y', labelName: 'MarketHolding'},
    {objName: 'History', cache: 'historyCashe', useYN: 'Y', labelName: 'History'}
  ];

  getCacheName(whichObj: string ): string {
    return this.dataObjects.find(myObj => myObj.objName === whichObj).cache;
  }
  getLabelName(whichObj: string ): string {
    return this.dataObjects.find(myObj => myObj.objName === whichObj).labelName;
  }
}
