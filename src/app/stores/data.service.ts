import { AppConfig } from './../app.config';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable()
export class DataService {
  protected myHoldingsUrl = AppConfig.settings.my_holdings_sheet_url;
  protected tseHoldingsUrl = AppConfig.settings.market_holdings_sheet_url;
  protected alphaKey = AppConfig.settings.alpha_api_keys[0];
  protected alphaHoldingUrl = AppConfig.settings.alpha_url;


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

  getAdvHolding(ticker: string, exchange: string) {
    console.log(`GET: AdvHolding: ${exchange} : ${ticker}`);

    let symbol: string;

    if (exchange === 'TSE') {
      symbol = `TSX:${ticker}`;
    } else {
      symbol = ticker;
    }

    const res = this.httpClient.get<any>(
      `${this.alphaHoldingUrl}/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${this.alphaKey}`).pipe(
      map(obj => obj),
      catchError(this.handleError())
    );

    return res;
  }
}
