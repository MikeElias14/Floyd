import { Injectable } from '@angular/core';
import { AppConfig } from './app.config';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, concat } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable()
export class DataService {
    protected wtdToken = AppConfig.settings.wtd_api_token;
    protected getWtd = AppConfig.settings.get_wtd;
    constructor(private httpClient: HttpClient) {}

    getHoldings() {
        const res = {
            ABX: {
                ammount: 17,
                char: 'gold'
            },
            AC: {
                ammount: 10,
                char: 'other'
            },
            CDZ: {
                ammount: 25,
                char: 'div'
            },
            CGR: {
                ammount: 8,
                char: 'reit'
            },
            CWW: {
                ammount: 5,
                char: 'other'
            },
            'HR.UN': {
                ammount: 5,
                char: 'reit'
            },
            'REI.UN': {
                ammount: 3,
                char: 'reit'
            },
            VDY: {
                ammount: 25,
                char: 'div'
            },
            XUU: {
                ammount: 4,
                char: 'market'
            },
        };
        return res;
    }

    // TODO: Error handling
    getTickerData(tickers: Array<string>) {
        const tickersString = tickers.toString();
        const url = `${this.getWtd}/stock?symbol=${tickersString}&api_token=${this.wtdToken}`;

        console.log(`GET: ${url}`);

        return this.httpClient.get(url);
    }
}
