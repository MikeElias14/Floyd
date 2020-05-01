import { DataStore } from './../stores/data.store';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.scss']
})
export class StockDetailComponent implements OnInit {
  @Input()
  holding: any;
  holdingData: any;

  holdingsObjName = 'AdvHoldings';

  constructor(public dataStore: DataStore) {
    this.dataStore.advHoldingsUpdated.subscribe(
      (newData: any) => {
        this.holdingData = newData;
      }
    );
  }

  ngOnInit() {
    this.dataStore.marketHoldingsUpdated.emit(
      // use the local storage if there until HTTP call retrieves something
      JSON.parse(localStorage[this.dataStore.dataObjects.getCacheName(this.holdingsObjName)] || '[]')
    );

    this.refreshAdvHolding(this.holding.ticker, this.holding.exchange);
  }

  refreshAdvHolding(ticker: string, exchange: string) {
    this.dataStore.refreshAdvData(ticker, exchange);
  }

}

