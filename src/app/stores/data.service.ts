import { AppConfig } from './../app.config';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Holding } from '../models/holding.model';

@Injectable()
export class DataService {
  protected myHoldingsUrl = AppConfig.settings.my_holdings_sheet_url;
  protected tseHoldingsUrl = AppConfig.settings.market_holdings_sheet_url;
  protected floydApiUrl =  AppConfig.settings.floyd_api_url;


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

  getHistory(holdings: Array<Holding>, time: string, interval: string) {
    console.log(`GET: History`);

    const symbols: Array<string> = [];

    holdings.forEach(holding => {
      if (holding.exchange === 'TSE') {
        symbols.push(`${holding.ticker}.TO`);
      } else {
        symbols.push(holding.ticker);
      }
    });

    const res = this.httpClient.get<any>(
      `${this.floydApiUrl}/holding/history?tickers=${symbols}&time=${time}&interval=${interval}`).pipe(
      map(obj => obj),
      catchError(this.handleError())
    );

    return res;
  }

  getInfo(holdings: Array<Holding>) {
    console.log(`GET: Info`);

    const symbols: Array<string> = [];

    holdings.forEach(holding => {
      if (holding.exchange === 'TSE') {
        symbols.push(`${holding.ticker}.TO`);
      } else {
        symbols.push(holding.ticker);
      }
    });

    const res = this.httpClient.get<any>(
      `${this.floydApiUrl}/holding/info?tickers=${symbols}`).pipe(
      map(obj => obj),
      catchError(this.handleError())
    );

    return res;
  }
}
