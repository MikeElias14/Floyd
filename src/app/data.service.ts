import { Injectable } from '@angular/core';
import { AppConfig } from './app.config';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Holding } from './models/app.holdings';

@Injectable()
export class DataService {
    protected marketKeys = AppConfig.settings.alpha_api_keys;
    protected marketUrl = AppConfig.settings.alpha_url;
    protected keyIndex = 0;

    constructor(private httpClient: HttpClient) {}

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<any> => {
          console.error(error);
          return;
        };
      }

    // Multiple keys to get around API constraints of 5 calls/min ;)
    // Update: THey seem to be smart too :(
    private incrementKey() {
        if (this.keyIndex < (this.marketKeys.length - 1)) {
            this.keyIndex++;
        }
        else {
            this.keyIndex = 0;
        }
    }

    getHoldings(): Array<Holding> {

        let res: Array<Holding> = [
            new Holding('ABX.TO', 17, 'gold'),
            new Holding('AC.TO', 10, 'other'),
            new Holding('CDZ.TO', 25, 'div'),
            new Holding('CGR.TO', 8, 'reit'),
            new Holding('CWW.TO', 5, 'other'),
            // new Holding('VDY.TO', 25, 'div'),
            // new Holding('XUU.TO', 4, 'market')
        ];
        // 'HR.UN': {
        //     ammount: 5,
        //     char: 'reit'
        // },
        // 'REI.UN': {
        //     ammount: 3,
        //     char: 'reit'
        // }

        // This is currently done after calling.
        // res.forEach(holding => {
        //     this.getTickerData(holding.ticker).subscribe(tickerData => {
        //         console.log(tickerData);
        //         holding.data$ = tickerData;
        //     });
        // });

        return res;
    }

    getTickerData(ticker: string): Observable<any> {
        const url = `${this.marketUrl}/query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=${this.marketKeys[this.keyIndex]}`;
        this.incrementKey();

        console.log(`GET: ${url}`);
        return this.httpClient.get<any>(url).pipe(
            tap(_ => console.log('fetched TickerData')),
            catchError(this.handleError<any>('getTickerData', ''))
          );
    }
}
