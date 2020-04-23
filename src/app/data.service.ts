import { Injectable } from '@angular/core';
import { AppConfig } from './app.config';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, concat } from 'rxjs';
import { catchError, retry, map, tap } from 'rxjs/operators';
import { Holding } from './models/app.holdings';



// TODO: Error handling
@Injectable()
export class DataService {
    protected marketKey = AppConfig.settings.alpha_api_key;
    protected marketUrl = AppConfig.settings.alpha_url;

    constructor(private httpClient: HttpClient) {}

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<any> => {
          console.error(error);
          return;
        };
      }

    getHoldings(): Array<Holding> {

        let res: Array<Holding> = [
            new Holding('ABX.TO', 17, 'gold'),
            new Holding('AC.TO', 10, 'other')
        ];

        res.forEach(holding => {
            this.getTickerData(holding.ticker).subscribe(tickerData => {
                console.log(tickerData);
                holding.data$ = tickerData;
            });
        });
            // 'CDZ.TO': {
            //     ammount: 25,
            //     char: 'div'
            // },
            // 'CGR.TO': {
            //     ammount: 8,
            //     char: 'reit'
            // },
            // 'CWW.TO': {
            //     ammount: 5,
            //     char: 'other'
            // },
            // 'HR.UN': {
            //     ammount: 5,
            //     char: 'reit'
            // },
            // 'REI.UN': {
            //     ammount: 3,
            //     char: 'reit'
            // },
            // 'VDY.TO': {
            //     ammount: 25,
            //     char: 'div'
            // },
            // 'XUU.TO': {
            //     ammount: 4,
            //     char: 'market'
            // },

        return res;
    }

    getTickerData(ticker: string): Observable<any> {
        const url = `${this.marketUrl}/query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=${this.marketKey}`;
        console.log(`GET: ${url}`);
        return this.httpClient.get<any>(url).pipe(
            tap(_ => console.log('fetched TickerData')),
            catchError(this.handleError<any>('getTickerData', ''))
          );
    }
}
