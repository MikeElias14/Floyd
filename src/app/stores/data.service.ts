import { Injectable } from '@angular/core';
import { AppConfig } from '../app.config';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable()
export class DataService {
    protected holdingsUrl = AppConfig.settings.holdings_sheet_url;

    constructor(private httpClient: HttpClient) {}

    private handleError() {
        return (error: any): Observable<any> => {
          console.error(error);
          return;
        };
      }

    getHoldings(): Observable<any> {
        console.log(`GET: ${this.holdingsUrl}`);

        const res = this.httpClient.get<any>(this.holdingsUrl).pipe(
          map(obj => obj.feed.entry),
          catchError(this.handleError())
        );

        return res;

    }
}
