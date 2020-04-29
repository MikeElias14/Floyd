import { DataStore } from '../stores/data.store';
import { Holding } from '../models/holding.model';
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

  holdings = new MatTableDataSource<Holding>();
  holdingsObjName = 'Holdings';

  pieTickerData: number[] = [];
  pieTickerLabels: string[] = [];
  pieTypeData: number[] = [];
  pieTypeLabels: string[] = [];


  totalValues = {
    total: 0,
    reit: 0,
    market: 0,
    gold: 0,
    div: 0,
    other: 0
  };

  displayedColumns: string[] = ['ticker', 'numberShares', 'sharePrice', 'totalPrice', 'exchange', 'type'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  mpPageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;

  @ViewChild(MatSort) sort: MatSort;

  constructor(public dataStore: DataStore) {

    this.dataStore.holdingsUpdated.subscribe(
      (newData: any) => {
        this.holdings = new MatTableDataSource(newData);
        this.holdings.paginator = this.paginator;
        this.holdings.sort = this.sort;

        this.calcTotalValues();
        this.updateCharts();
      }
    );

    this.holdings.sortingDataAccessor = (item, property) => {
      switch (property) {
        default: return item[property];
      }
    };

  }

  ngOnInit() {
    this.dataStore.holdingsUpdated.emit(
      // use the local storage if there until HTTP call retrieves something
      JSON.parse(localStorage[this.dataStore.dataObjects.getCacheName(this.holdingsObjName)] || '[]')
    );
  }

  refreshHoldings() {
    this.dataStore.loadHoldings();
  }

  applyFilter(filterValue: string) {
    this.holdings.filter = filterValue.trim().toLowerCase();

    if (this.holdings.paginator) {
      this.holdings.paginator.firstPage();
    }
  }

  calcTotalValues() {
    this.resetTotals();
    this.holdings.data.forEach(holding => {
      this.totalValues.total += holding.totalPrice;
      this.totalValues[holding.type] += holding.totalPrice;
    });
  }

  updateCharts() {
    this.resetChartData();
    this.holdings.data.forEach(holding => {
      this.pieTickerData.push(holding.totalPrice);
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
