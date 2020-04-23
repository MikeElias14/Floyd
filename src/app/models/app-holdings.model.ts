import { Observable } from 'rxjs';
export interface IHolding {
    ticker: string;
    ammount: number;
    type: string;
    data$: Observable<any>;
}

export interface ITickerData {
    'Meta Data': {
        '1. Information': string;
        '2. Symbol': string;
        '3. Last Refreshed': string;
        '4. Output Size': string;
        '5. Time Zone': string;
    };
    'Time Series (Daily)': {
        [key: string]: ITickerDayData;
    };
}

interface ITickerDayData {
    '1. open': string;
    '2. high': string;
    '3. low': string;
    '4. close': string;
    '5. volume': string;
}
