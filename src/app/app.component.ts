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
  holdingTickers;
  holdingValues;

  constructor(service: DataService) {
    this.holdings = service.getHoldings();

    this.holdingTickers = Object.keys(this.holdings);
    this.holdingValues = Object.values(this.holdings);
   }

}
