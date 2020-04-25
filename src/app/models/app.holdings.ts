import { IHolding } from './app-holdings.model';

export class Holding implements IHolding {
    ticker: string;
    numberShares: number;
    sharePrice: number;
    totalPrice: number;
    type: string;

    constructor(ticker: string, numberShares: number, sharePrice: number, totalPrice: number, type: string) {
        this.ticker = ticker;
        this.numberShares = numberShares;
        this.totalPrice = totalPrice;
        this.type = type;
    }
}
