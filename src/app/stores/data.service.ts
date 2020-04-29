import { Injectable } from '@angular/core';
import { AppConfig } from '../app.config';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable()
export class DataService {
    protected myHoldingsUrl = AppConfig.settings.my_holdings_sheet_url;
    protected marketHoldingsUrl = AppConfig.settings.market_holdings_sheet_url;

    constructor(private httpClient: HttpClient) {}

    private handleError() {
        return (error: any): Observable<any> => {
          console.error(error);
          return;
        };
      }

    getMyHoldings(): Observable<any> {
        console.log(`GET: ${this.myHoldingsUrl}`);

        const res = this.httpClient.get<any>(this.myHoldingsUrl).pipe(
          map(obj => obj.feed.entry),
          catchError(this.handleError())
        );

        return res;
    }

    getMarketHoldings(): Observable<any> {
      console.log(`GET: ${this.marketHoldingsUrl}`);

      const res = this.httpClient.get<any>(this.marketHoldingsUrl).pipe(
        map(obj => obj.feed.entry),
        catchError(this.handleError())
      );

      return res;
  }
}
