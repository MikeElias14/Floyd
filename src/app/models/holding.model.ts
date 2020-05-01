 // My Holding
export class MyHolding implements IMyHolding {
  ticker: string;
  exchange: string;
  numberShares: number;
  sharePrice: number;
  totalPrice: number;
  sector: string;
  history: Array<DatePrice>;

  constructor(ticker: string, exchange: string, numberShares: number,
              sharePrice: number, totalPrice: number, sector: string, history: Array<DatePrice>) {
    this.ticker = ticker;
    this.exchange = exchange;
    this.numberShares = numberShares;
    this.sharePrice = sharePrice;
    this.totalPrice = totalPrice;
    this.sector = sector;
    this.history = history;
  }
}

export interface IMyHolding {
  ticker: string;
  exchange: string;
  numberShares: number;
  sharePrice: number;
  totalPrice: number;
  sector: string;
  history: Array<DatePrice>;
}

// Market Holding
export class MarketHolding implements IMarketHolding {
  ticker: string;
  exchange: string;
  name: string;
  sector: string;
  price: number;
  high52: number;
  low52: number;
  changepct: number;
  marketcap: number;
  history: Array<DatePrice>;

  constructor(ticker: string, exchange: string, name: string, sector: string,
              price: number, high52: number, low52: number, changepct: number, marketcap: number, history: Array<DatePrice>) {
    this.ticker = ticker;
    this.exchange = exchange;
    this.name = name;
    this.sector = sector;
    this.price = price;
    this.high52 = high52;
    this.low52 = low52;
    this.changepct = changepct;
    this.marketcap = marketcap;
    this.history = history;
  }
}

export interface IMarketHolding {
  ticker: string;
  exchange: string;
  name: string;
  sector: string;
  price: number;
  high52: number;
  low52: number;
  changepct: number;
  marketcap: number;
  history: Array<DatePrice>;
}

// Date Price
export class DatePrice implements IDatePrice {
  price: number;
  date: string;

  constructor(  price: number, date: string) {
    this.price =  price;
    this.date =  date;
  }
}

export interface IDatePrice {
  price: number;
  date: string;
}
