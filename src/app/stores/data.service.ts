import { Injectable } from '@angular/core';
import { AppConfig } from '../app.config';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable()
export class DataService {
  protected myHoldingsUrl = AppConfig.settings.my_holdings_sheet_url;
  protected tseHoldingsUrl = AppConfig.settings.market_holdings_sheet_url;

  constructor(private httpClient: HttpClient) {}

  private handleError() {
    return (error: any): Observable<any> => {
      console.error(error);
      return;
    };
  }

  getMyHoldings(): Observable<any> {
    console.log(`GET: MyHoldings`);

    const res = this.httpClient.get<any>(this.myHoldingsUrl).pipe(
      map(obj => obj.feed.entry),
      catchError(this.handleError())
    );

    return res;
  }

  getTSEHoldings(): Observable<any> {
    console.log(`GET: MarketHoldings`);

    const res = this.httpClient.get<any>(this.tseHoldingsUrl).pipe(
      map(obj => obj.feed.entry),
      catchError(this.handleError())
    );

    return res;
  }
}
