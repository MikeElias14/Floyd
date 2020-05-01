import { MyHolding, MarketHolding, AdvHolding, DatePrice } from './../models/holding.model';
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

  advLastUpdated = new Date();
  advHoldings$: Observable<Array<AdvHolding>>;
  advHoldingsUpdated = new EventEmitter<Array<AdvHolding>>();

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
          i.gsx$sector.$t.trim()
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
          Number(i.gsx$marketcap.$t.trim())
        )
      );
    }
    return tempArray;
  }


  // Adv Holding
  // TODO: Cash each one and look to retrieve it later rather than retrying new data?

  refreshAdvData(ticker: string, exchange: string) {
    this.loadAdvHoldings(ticker, exchange);
    this.advLastUpdated = new Date();
  }

  loadAdvHoldings(ticker: string, exchange: string) {
    let holdings: Array<AdvHolding> = [];
    this.advHoldings$ = this.dataService.getAdvHolding(ticker, exchange);
    this.advHoldings$.subscribe(next => {
      if (next != null) {
        holdings = this.transformAdvHolding(ticker, exchange, next);
      }

      DataStore.setLocal(holdings, this.dataObjects.getCacheName('AdvHoldings'));
      this.advHoldingsUpdated.emit(holdings);
    });
  }

  transformAdvHolding(ticker: string, exchange: string, dataReceived: Array<any>): Array<AdvHolding> {
    const tempArray: Array<AdvHolding> = [];
    const history: Array<any> = [];

    // let blah = dataReceived['Time Series (Daily)'];

    dataReceived['Time Series (Daily)'].forEach(element => {
      console.log(element.Key());
      history.push( new DatePrice (String(element.Key()), Number(element['4. close:'])) );
    });

    // tempArray.push(
    //   new AdvHolding (
    //     ticker,
    //     exchange,
    //     dataReceived['Time Seriec (Daily)']
    //   )
    // );
    return tempArray;
  }
}


export class DataObjects {
  dataObjects =  [
    {objName: 'MyHoldings', cache: 'myHoldingsCache', useYN: 'Y', labelName: 'MyHolding'},
    {objName: 'MarketHoldings', cache: 'marketHoldingsCache', useYN: 'Y', labelName: 'MarketHolding'},
    {objName: 'AdvHoldings', cache: 'advHoldingsCache', useYN: 'Y', labelName: 'AdvHolding'}
  ];

  getCacheName(whichObj: string ): string {
    return this.dataObjects.find(myObj => myObj.objName === whichObj).cache;
  }
  getLabelName(whichObj: string ): string {
    return this.dataObjects.find(myObj => myObj.objName === whichObj).labelName;
  }
}
