import { AppConfig } from './../app.config';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class DataService {
  protected myHoldingsUrl = AppConfig.settings.my_holdings_sheet_url;
  protected tseHoldingsUrl = AppConfig.settings.market_holdings_sheet_url;
  protected alphaKey = AppConfig.settings.alpha_api_keys[0];
  protected alphaHoldingUrl = AppConfig.settings.alpha_url;
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

  getHistory(ticker: string, exchange: string) {
    console.log(`GET: History: ${exchange}:${ticker}`);

    let symbol: string;

    if (exchange === 'TSE') {
      symbol = `TSX:${ticker}`;
    } else {
      symbol = ticker;
    }

    const res = this.httpClient.get<any>(
      `${this.alphaHoldingUrl}/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${this.alphaKey}`).pipe(
      map(obj => obj),
      catchError(this.handleError())
    );

    return res;
  }

  getInfo(ticker: string, exchange: string) {
    console.log(`GET: Info: ${exchange}:${ticker}`);

    let symbol: string;

    if (exchange === 'TSE') {
      symbol = `${ticker}.TO`;
    } else {
      symbol = ticker;
    }

    const res = this.httpClient.get<any>(
      `${this.floydApiUrl}/holding/info?ticker=${symbol}`).pipe(
      map(obj => obj),
      catchError(this.handleError())
    );

    return res;
  }
}
