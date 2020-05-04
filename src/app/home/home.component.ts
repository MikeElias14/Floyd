import { AppConfig } from './../app.config';
import { Holding, IDatePrice } from '../models/holding.model';
import { DataStore } from '../stores/data.store';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ChartDataSets } from 'chart.js';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  myHoldings = new MatTableDataSource<Holding>();
  displayedColumns: string[] = ['select', 'ticker', 'owned', 'price', 'totalPrice', 'exchange', 'sector'];
  selection = new SelectionModel<Holding>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  mpPageSizeOptions: number[] = [10, 25, 100];
  pageEvent: PageEvent;

  @ViewChild(MatSort) sort: MatSort;

  pieTickerData: number[] = [];
  pieTickerLabels: string[] = [];
  pieTypeData: number[] = [];
  pieTypeLabels: string[] = [];

  perfDatasets: Array<ChartDataSets> = [];
  perfLabels: Array<string> = [];

  // TODO: implement this as chartData
  totalValues = {
    total: 0,
    reit: 0,
    market: 0,
    gold: 0,
    div: 0,
    other: 0
  };

  constructor(public dataStore: DataStore) {

    // We can load the table like this because we don't have huge data.
    // This method does not work for all-stocks for example.
    this.dataStore.myHoldingsUpdated.subscribe(
      (newData: any) => {
        this.myHoldings = new MatTableDataSource(newData);

        this.myHoldings.paginator = this.paginator;
        this.myHoldings.sort = this.sort;

        // this.calcTotalValues();
        // this.updateCharts();

      }
    );

    // Subscribe History
    this.dataStore.historyUpdated.subscribe(
      (newData: any) => {
        this.myHoldings.data.find(myObj => myObj.ticker === newData.ticker).history = newData.history;
        this.updatePerfChart(true, newData.ticker);
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
      JSON.parse(localStorage[AppConfig.settings.myHoldingsCache] || '[]')
    );
  }

  refreshMyHoldings() {
    this.dataStore.loadMyHoldings();
  }

  getHistory(ticker: string, exchange: string) {
    this.dataStore.refreshHistory(ticker, exchange);
  }

  // *** For Table ***

  applyFilter(filterValue: string) {
    this.myHoldings.filter = filterValue.trim().toLowerCase();

    if (this.myHoldings.paginator) {
      this.myHoldings.paginator.firstPage();
    }
  }

  // Whether the number of selected elements matches the total number of rows
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.myHoldings.data.length;
    return numSelected === numRows;
  }

  // Selects all rows if they are not all selected; otherwise clear selection.
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.myHoldings.data.forEach(row => this.selection.select(row));
  }

  // The label for the checkbox on the passed row
  checkboxLabel(row?: Holding): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${this.myHoldings.data.indexOf(row)}`;
  }

  onCheckboxChange($event, ticker: string) {
    this.updatePerfChart($event.checked, ticker);
    return $event;
  }


  // *** Performance Chart ***

  updatePerfChart(add: boolean, ticker: string) {
    const holding = this.myHoldings.data.find(myObj => myObj.ticker === ticker);
    let prices: Array<number> = [];

    if (add) {
      if (holding.history) {
        holding.history.forEach(element => {
          prices.push(Number(element.price));
        });

        // Only push labels once
        if (this.perfLabels.length === 0 ) {
          holding.history.forEach(element => {
            this.perfLabels.push(String(element.date));
          });
        }

        // only show one year for now
        prices = prices.slice(prices.length - 250);
        this.perfLabels = this.perfLabels.slice(this.perfLabels.length - 250);

        this.perfDatasets.push({
          data: prices,
          label: holding.ticker
        });
      } else {
        this.getHistory(holding.ticker, holding.exchange);
      }
    } else {  // else remove
      this.perfDatasets.splice(this.perfDatasets.findIndex(dataset => dataset.label === holding.ticker));
    }
  }








  // calcTotalValues() {
  //   this.resetTotals();
  //   this.myHoldings.data.forEach(holding => {
  //     this.totalValues.total += holding.price * holding.owned;
  //     this.totalValues[holding.sector] += holding.price * holding.owned;
  //   });
  // }

  // updateCharts() {
  //   this.resetChartData();
  //   this.myHoldings.data.forEach(holding => {
  //     this.pieTickerData.push(Number(holding.price * holding.owned));
  //     this.pieTickerLabels.push(holding.ticker);
  //   });

  //   // Need to shift the total from this.
  //   this.pieTypeData = Object.values(this.totalValues);
  //   this.pieTypeLabels = Object.keys(this.totalValues);
  //   this.pieTypeData.shift();
  //   this.pieTypeLabels.shift();
  // }

  // resetTotals() {
  //   this.totalValues = {
  //     total: 0,
  //     reit: 0,
  //     market: 0,
  //     gold: 0,
  //     div: 0,
  //     other: 0
  //   };
  // }

  // resetChartData() {
  //   this.pieTickerData = [];
  //   this.pieTickerLabels = [];
  //   this.pieTypeData = [];
  //   this.pieTypeLabels = [];
  // }
}
