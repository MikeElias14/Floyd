import { DataStore } from './stores/data.store';
import { Holding } from './models/holding.model';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'floyd';

  holdings = new MatTableDataSource<Holding>();
  objName = 'Holdings'; // This must match the ob jof the localCashe... I should global var this or something.

  displayedColumns: string[] = ['ticker', 'numberShares', 'sharePrice', 'totalPrice', 'type'];

  constructor(public dataStore: DataStore) {

    this.dataStore.holdingsUpdated.subscribe(
      (newData: any) => {
        this.holdings = new MatTableDataSource(newData);
      }
    );
  }

  ngOnInit() {
    this.dataStore.holdingsUpdated.emit(
      // use the local storage if there until HTTP call retrieves something
      JSON.parse(localStorage[this.dataStore.dataObjects.getCacheName(this.objName)] || '[]')
    );
  }
    refreshHoldings() {
      this.dataStore.loadHoldings();
    }
}

