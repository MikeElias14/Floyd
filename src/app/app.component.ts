import { Observable } from 'rxjs';
import { Holding } from './models/app.holdings';
import { Component, OnInit } from '@angular/core';
import {formatDate} from '@angular/common';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'floyd';
  curDate = new Date();
  dateString: string;

  holdings: Array<Holding>;
  myTickers: Array<string>;
  myTickerValues: Array<number>;

  constructor(private service: DataService) { }

  ngOnInit() {

    // Set correct date to dateString.
    if (this.curDate.getHours() < 10) {
      this.dateString = formatDate(new Date(this.curDate.setDate(this.curDate.getDate() - 1)), 'yyyy-MM-dd', 'en').toString();
    }
    else {
      this.dateString =  formatDate(new Date(), 'yyyy-MM-dd', 'en').toString();
    }

    // Get the Holdings. The data& is obervable and will come slightly later.
    this.holdings = this.service.getHoldings();

    // Fill the data with current market data
    // this.holdings.forEach(holding => {
    //   this.service.getTickerData(holding.ticker).subscribe(tickerData => {
    //       console.log(tickerData);
    //       holding.data$ = tickerData;
    //   });
    // });
  }

  calcData() {
    // The stuff in the html works, but this isn't oberving holdings...
    this.holdings.forEach(holding => {
      this.myTickers.push(holding.ticker);
      this.myTickerValues.push(holding.ammount * holding.data$['Time Series (Daily)'][this.dateString]['4. close']);
    });
  }
}
