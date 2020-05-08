import { AppConfig } from './../app.config';
import { Holding } from '../models/holding.model';
import { DataStore } from '../stores/data.store';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-all-stocks',
  templateUrl: './all-stocks.component.html',
  styleUrls: ['./all-stocks.component.scss']
})
export class AllStocksComponent implements OnInit, AfterViewInit {

  marketHoldings: MatTableDataSource<Holding> = new MatTableDataSource<Holding>();
  marketData: any;

  displayedColumns: string[] = ['ticker', 'name', 'price',  'changePrice', 'changepct', 'marketcap', 'exchange', 'sector'];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  mpPageSizeOptions: number[] = [50, 100, 250, 500];
  pageEvent: PageEvent;

  constructor(public dataStore: DataStore) {
    this.dataStore.marketHoldingsUpdated.subscribe(
      (newData: any) => {
        this.marketData = newData;
      }
    );
  }

  ngOnInit() {
    this.dataStore.marketHoldingsUpdated.emit(
      // use the local storage if there until HTTP call retrieves something
      JSON.parse(localStorage[AppConfig.settings.marketHoldingsCache] || '[]')
    );
  }

  ngAfterViewInit() {
    this.marketHoldings.sort = this.sort;
    this.marketHoldings.paginator = this.paginator;
    // TODO: browser error when roendering this way, but soooo much faster... look into this.
    // functionality is great so not urgent
    this.marketHoldings.data = this.marketData;
  }

  refreshMarketHoldings() {
    this.dataStore.getMarketHoldings();
  }

  applyFilter(filterValue: string) {
    this.marketHoldings.filter = filterValue.trim().toLowerCase();

    if (this.marketHoldings.paginator) {
      this.marketHoldings.paginator.firstPage();
    }
  }
}
