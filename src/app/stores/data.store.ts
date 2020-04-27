import { DataService } from './data.service';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Holding } from '../models/holding.model';

@Injectable()
export class DataStore {
    dataObjects = new DataObjects();

    lastUpdated = new Date();
    holdings$: Observable<Array<Holding>>;
    holdingsUpdated = new EventEmitter<Array<Holding>>();

    constructor(private dataService: DataService) {
        this.loadHoldings();
    }

    public static setLocal(whatData: any, cacheName: string) {
        localStorage[cacheName] = JSON.stringify(whatData);
      }

    refreshData() {
        this.refreshAll();
    }

    refreshAll() {
        this.loadHoldings();
        this.lastUpdated = new Date();
    }

    loadHoldings() {
        let holdings: Array<Holding> = [];
        this.holdings$ = this.dataService.getHoldings();
        this.holdings$.subscribe(next => {
           if (next != null) {
            holdings = this.transformHoldings(next);
           }

           DataStore.setLocal(holdings, this.dataObjects.getCacheName('Holdings'));
           this.holdingsUpdated.emit(holdings);
        });
    }

    transformHoldings(dataReceived: Array<any>): Array<Holding> {
        const tempArray: Array<Holding> = [];

        for (const i of dataReceived) {
          tempArray.push(
            new Holding (
                i.title.$t,
                i.gsx$numbershares.$t,
                i.gsx$shareprice.$t,
                i.gsx$totalprice.$t,
                i.gsx$type.$t

            ));
        }
        return tempArray;
      }
}

export class DataObjects {

    dataObjects =  [
      {objName: 'Holdings', tabID: '1', cache: 'holdingsCache', useYN: 'Y', labelName: 'Holding'}
    ];

    getCacheName(whichObj: string ): string {
      return this.dataObjects.find(myObj => myObj.objName === whichObj).cache;
    }
    getLabelName(whichObj: string ): string {
      return this.dataObjects.find(myObj => myObj.objName === whichObj).labelName;
    }
  }
