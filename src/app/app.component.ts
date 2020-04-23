import { Observable, forkJoin } from 'rxjs';
import { Holding } from './models/app.holdings';
import { Component, OnInit } from '@angular/core';
import {formatDate} from '@angular/common';
import { DataService } from './data.service';
import { shareReplay, retry } from 'rxjs/operators';

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

  constructor(private service: DataService) { }

  ngOnInit() {

    // Set correct date to dateString. If before 9:45 use yesterdays date.
    if (this.curDate.getHours() < 10 && this.curDate.getMinutes() < 45) {
      this.dateString = formatDate(new Date(this.curDate.setDate(this.curDate.getDate() - 1)), 'yyyy-MM-dd', 'en').toString();
    }
    else {
      this.dateString =  formatDate(new Date(), 'yyyy-MM-dd', 'en').toString();
    }

    // Get the Holdings. The data& till be empty, filled in below curently.
    this.holdings = this.service.getHoldings();
    this.fillAllHoldingData(this.holdings);
  }

  // Fill the data with current market data. Need to only do 5 at a time...
  async fillAllHoldingData(holdings: Array<Holding>) {
    let responses: Array<Observable<Holding>> = [];
    let notDone = true;
    let retries = 0;

    while (notDone && retries < 5) {
      notDone = false;
      retries ++;
      responses = [];

      holdings.forEach(holding => {
        if ((holding.data$ == null || holding.data$['Note'] !== undefined) && responses.length < 5) {
          notDone = true;
          responses.push(this.getHoldingData(holding));
        }
      });

      forkJoin(responses).subscribe(responseList => {
        responses.forEach(res => {
          const ticker = res['Meta Data']['2. Symbol'];

          holdings.forEach(holding => {
            if (holding.ticker === ticker) {
              holding.data$ = res;
            }
          });
        });
      });

      if (notDone) {
        console.log('Waiting before trying to fetch more data');
        await this.delay(30000);
      }
    }
  }

  getHoldingData(holding: Holding): Observable<Holding> {
    const tickerData$ = this.service.getTickerData(holding.ticker).pipe(shareReplay());
    tickerData$.subscribe(tickerData => {
      console.log(tickerData);
      holding.data$ = tickerData;
    });
    return tickerData$;
  }

  // Used when I need to wait for more API time ;) #free
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}
}
