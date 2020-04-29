import { DataService } from './data.service';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { MyHolding } from '../models/holding.model';

@Injectable()
export class MyDataStore {
    dataObjects = new MyDataObjects();

    myLastUpdated = new Date();
    myHoldings$: Observable<Array<MyHolding>>;
    myHoldingsUpdated = new EventEmitter<Array<MyHolding>>();

    constructor(private dataService: DataService) {
        this.loadMyHoldings();
    }

    public static setLocal(whatData: any, cacheName: string) {
        localStorage[cacheName] = JSON.stringify(whatData);
      }

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

           MyDataStore.setLocal(holdings, this.dataObjects.getCacheName('MyHoldings'));
           this.myHoldingsUpdated.emit(holdings);
        });
    }

    transformMyHoldings(dataReceived: Array<any>): Array<MyHolding> {
        const tempArray: Array<MyHolding> = [];

        for (const i of dataReceived) {
          tempArray.push(
            new MyHolding (
                i.title.$t.trim(),
                i.gsx$exchange.$t.trim(),
                Number(i.gsx$numbershares.$t.trim()),
                Number(i.gsx$shareprice.$t.replace('$', '').trim()),
                Number(i.gsx$totalprice.$t.replace('$', '').trim()),
                i.gsx$sector.$t.trim()
            ));
        }
        return tempArray;
      }
}

export class MyDataObjects {
  dataObjects =  [
    {objName: 'MyHoldings', cache: 'myHoldingsCache', useYN: 'Y', labelName: 'MyHolding'}
  ];

  getCacheName(whichObj: string ): string {
    return this.dataObjects.find(myObj => myObj.objName === whichObj).cache;
  }
  getLabelName(whichObj: string ): string {
    return this.dataObjects.find(myObj => myObj.objName === whichObj).labelName;
  }
}
