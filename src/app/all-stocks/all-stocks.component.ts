import { MarketDataStore } from '../stores/Market.store';
import { MarketHolding } from '../models/holding.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-all-stocks',
  templateUrl: './all-stocks.component.html',
  styleUrls: ['./all-stocks.component.scss']
})
export class AllStocksComponent implements OnInit {

  marketHoldings = new MatTableDataSource<MarketHolding>();
  holdingsObjName = 'MarketHoldings';

  displayedColumns: string[] = ['ticker', 'name', 'price', 'high52', 'low52', 'exchange', 'sector'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  mpPageSizeOptions: number[] = [10, 25, 50, 100];
  pageEvent: PageEvent;

  @ViewChild(MatSort) sort: MatSort;

  constructor(public dataStore: MarketDataStore) {

    this.dataStore.marketHoldingsUpdated.subscribe(
      (newData: any) => {
        this.marketHoldings = new MatTableDataSource(newData);
        this.marketHoldings.paginator = this.paginator;
        this.marketHoldings.sort = this.sort;
      }
    );

    this.marketHoldings.sortingDataAccessor = (item, property) => {
      switch (property) {
        default: return item[property];
      }
    };

  }

  ngOnInit() {
    this.dataStore.marketHoldingsUpdated.emit(
      // use the local storage if there until HTTP call retrieves something
      JSON.parse(localStorage[this.dataStore.dataObjects.getCacheName(this.holdingsObjName)] || '[]')
    );
  }

  refreshMarketHoldings() {
    this.dataStore.loadMarketHoldings();
  }

  applyFilter(filterValue: string) {
    this.marketHoldings.filter = filterValue.trim().toLowerCase();

    if (this.marketHoldings.paginator) {
      this.marketHoldings.paginator.firstPage();
    }
  }
}
