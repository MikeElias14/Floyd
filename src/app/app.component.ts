import { Component } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'floyd';
  holdings;
  tickerData;
  myTickers;
  tickerUnits;
  myTickerValue;

  constructor(service: DataService) {
    this.holdings = service.getHoldings();
    this.myTickers = Object.keys(this.holdings);
    this.tickerUnits = Object.values(this.holdings);

    this.myTickers = this.myTickers.slice(0, 4);

    this.tickerData = service.getTickerData(this.myTickers);
    console.log(this.tickerData);
  }
}
