import { UiStore } from './stores/ui.store';
import { DataStore } from './stores/data.store';
import { Observable, forkJoin } from 'rxjs';
import { Holding } from './models/app.holdings';
import { Component, OnInit } from '@angular/core';
import { DataService } from './stores/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'floyd';
  rawHoldingsData: Observable<any>;
  holdings: Holding[];

  constructor(
    private service: DataService,
    private datastore: DataStore,
    private uiStore: UiStore
    ) { }

  ngOnInit() {
  }
}

