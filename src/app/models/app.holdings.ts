import { Observable } from 'rxjs';
import { IHolding } from './app-holdings.model';

export class Holding implements IHolding {
    ticker: string;
    ammount: number;
    type: string;
    data$: Observable<any>;

    constructor(ticker: string, ammount: number, type: string, data$?: any) {
        this.ticker = ticker;
        this.ammount = ammount;
        this.type = type;
        this.data$ = data$ || null;
    }
}
