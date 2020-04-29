import { DataService } from './data.service';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { MarketHolding } from '../models/holding.model';

@Injectable()
export class MarketDataStore {
    dataObjects = new MarketDataObjects();

    marketLastUpdated = new Date();
    marketHoldings$: Observable<Array<MarketHolding>>;
    marketHoldingsUpdated = new EventEmitter<Array<MarketHolding>>();

    constructor(private dataService: DataService) {
        this.loadMarketHoldings();
    }

    public static setLocal(whatData: any, cacheName: string) {
        localStorage[cacheName] = JSON.stringify(whatData);
      }

    refreshMarketData() {
      this.loadMarketHoldings();
      this.marketLastUpdated = new Date();
    }

    loadMarketHoldings() {
        let holdings: Array<MarketHolding> = [];
        this.marketHoldings$ = this.dataService.getMarketHoldings();
        this.marketHoldings$.subscribe(next => {
           if (next != null) {
            holdings = this.transformMarketHoldings(next);
           }

           MarketDataStore.setLocal(holdings, this.dataObjects.getCacheName('MarketHoldings'));
           this.marketHoldingsUpdated.emit(holdings);
        });
    }

    transformMarketHoldings(dataReceived: Array<any>): Array<MarketHolding> {
        const tempArray: Array<MarketHolding> = [];

        for (const i of dataReceived) {
          tempArray.push(
            new MarketHolding (
                i.title.$t.trim(),
                i.gsx$exchange.$t.trim(),
                i.gsx$name.$t.trim(),
                i.gsx$sector.$t.trim(),
                Number(i.gsx$price.$t.trim()),
                Number(i.gsx$high52.$t.trim()),
                Number(i.gsx$low52.$t.trim()),
                Number(i.gsx$changepct.$t.trim())
            ));
        }
        return tempArray;
      }
}

export class MarketDataObjects {
    dataObjects =  [
      {objName: 'MarketHoldings', cache: 'marketHoldingsCache', useYN: 'Y', labelName: 'MarketHolding'}
    ];

    getCacheName(whichObj: string ): string {
      return this.dataObjects.find(MarketObj => MarketObj.objName === whichObj).cache;
    }
    getLabelName(whichObj: string ): string {
      return this.dataObjects.find(MarketObj => MarketObj.objName === whichObj).labelName;
    }
  }
