export class Holding implements IHolding {
    ticker: string;
    numberShares: number;
    sharePrice: number;
    totalPrice: number;
    type: string;

    constructor(ticker: string, numberShares: number, sharePrice: number, totalPrice: number, type: string) {
        this.ticker = ticker;
        this.numberShares = numberShares;
        this.sharePrice = sharePrice;
        this.totalPrice = totalPrice;
        this.type = type;
    }
}

export interface IHolding {
    ticker: string;
    numberShares: number;
    sharePrice: number;
    totalPrice: number;
    type: string;
}
