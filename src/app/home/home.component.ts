import { Holding } from '../models/holding.model';
import { DataStore } from '../stores/data.store';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  myHoldings = new MatTableDataSource<Holding>();
  holdingsObjName = 'MyHoldings';

  pieTickerData: number[] = [];
  pieTickerLabels: string[] = [];
  pieTypeData: number[] = [];
  pieTypeLabels: string[] = [];

  // TODO: implement this as chartData
  totalValues = {
    total: 0,
    reit: 0,
    market: 0,
    gold: 0,
    div: 0,
    other: 0
  };

  displayedColumns: string[] = ['ticker', 'owned', 'price', 'totalPrice', 'exchange', 'sector'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  mpPageSizeOptions: number[] = [10, 25, 100];
  pageEvent: PageEvent;

  @ViewChild(MatSort) sort: MatSort;

  constructor(public dataStore: DataStore) {

    // We can load the table like this because we don't have huge data.
    // This method does not work for all-stocks for example.
    this.dataStore.myHoldingsUpdated.subscribe(
      (newData: any) => {
        this.myHoldings = new MatTableDataSource(newData);

        this.myHoldings.paginator = this.paginator;
        this.myHoldings.sort = this.sort;

        this.calcTotalValues();
        this.updateCharts();

      }
    );

    this.myHoldings.sortingDataAccessor = (item, property) => {
      switch (property) {
        default: return item[property];
      }
    };

  }

  ngOnInit() {
    this.dataStore.myHoldingsUpdated.emit(
      // use the local storage if there until HTTP call retrieves something
      JSON.parse(localStorage[this.dataStore.dataObjects.getCacheName(this.holdingsObjName)] || '[]')
    );
  }

  refreshMyHoldings() {
    this.dataStore.loadMyHoldings();
  }

  applyFilter(filterValue: string) {
    this.myHoldings.filter = filterValue.trim().toLowerCase();

    if (this.myHoldings.paginator) {
      this.myHoldings.paginator.firstPage();
    }
  }

  calcTotalValues() {
    this.resetTotals();
    this.myHoldings.data.forEach(holding => {
      this.totalValues.total += holding.price * holding.owned;
      this.totalValues[holding.sector] += holding.price * holding.owned;
    });
  }

  updateCharts() {
    this.resetChartData();
    this.myHoldings.data.forEach(holding => {
      this.pieTickerData.push(Number(holding.price * holding.owned));
      this.pieTickerLabels.push(holding.ticker);
    });

    // Need to shift the total from this.
    this.pieTypeData = Object.values(this.totalValues);
    this.pieTypeLabels = Object.keys(this.totalValues);
    this.pieTypeData.shift();
    this.pieTypeLabels.shift();
  }

  resetTotals() {
    this.totalValues = {
      total: 0,
      reit: 0,
      market: 0,
      gold: 0,
      div: 0,
      other: 0
    };
  }

  resetChartData() {
    this.pieTickerData = [];
    this.pieTickerLabels = [];
    this.pieTypeData = [];
    this.pieTypeLabels = [];
  }
}
