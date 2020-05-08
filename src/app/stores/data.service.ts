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

  getHistory(holdings: Array<any>, time: string, interval: string) {
    console.log(`GET: History`);

    const symbols: Array<string> = this.getSymbols(holdings);

    const res = this.httpClient.get<any>(
      `${this.floydApiUrl}/holding/history?tickers=${symbols}&time=${time}&interval=${interval}`).pipe(
      map(obj => obj),
      catchError(this.handleError())
    );

    return res;
  }

  getDividendHistory(holdings: Array<any>) {
    console.log(`GET: Dividend History`);

    const symbols: Array<string> = this.getSymbols(holdings);

    const res = this.httpClient.get<any>(
      `${this.floydApiUrl}/holding/div?tickers=${symbols}`).pipe(
      map(obj => obj),
      catchError(this.handleError())
    );

    return res;
  }

  getInfo(holdings: Array<any>, index: boolean = false) {
    console.log(`GET: Info - Index: ${index}`);

    const symbols: Array<string> = this.getSymbols(holdings);

    const res = this.httpClient.get<any>(
      `${this.floydApiUrl}/holding/info?tickers=${symbols}&index=${index}`).pipe(
      map(obj => obj),
      catchError(this.handleError())
    );

    return res;
  }

  getEvents(holdings: Array<any>) {
    console.log(`GET: Events`);

    const symbols: Array<string> = this.getSymbols(holdings);

    const res = this.httpClient.get<any>(
      `${this.floydApiUrl}/holding/events?tickers=${symbols}`).pipe(
      map(obj => obj),
      catchError(this.handleError())
    );

    return res;
  }

  /* Helpers */

  private handleError() {
    return (error: any): Observable<any> => {
      console.error(error);
      return;
    };
  }

  private getSymbols(holdings: Array<any>): Array<string> {
    const symbols: Array<string> = [];
    holdings.forEach(holding => {
      if (holding.exchange && holding.exchange === 'TSE') {  // This covers index's as they don't have exchange field
        symbols.push(`${holding.ticker}.TO`);
      } else {
        symbols.push(holding.ticker);
      }
    });

    return symbols;
  }

}
