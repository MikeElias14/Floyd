export class MyHolding implements IMyHolding {
  ticker: string;
  exchange: string;
  numberShares: number;
  sharePrice: number;
  totalPrice: number;
  sector: string;

  constructor(ticker: string, exchange: string, numberShares: number, sharePrice: number, totalPrice: number, sector: string) {
    this.ticker = ticker;
    this.exchange = exchange;
    this.numberShares = numberShares;
    this.sharePrice = sharePrice;
    this.totalPrice = totalPrice;
    this.sector = sector;
  }
}

export interface IMyHolding {
  ticker: string;
  exchange: string;
  numberShares: number;
  sharePrice: number;
  totalPrice: number;
  sector: string;
}


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

  constructor(ticker: string, exchange: string, name: string, sector: string,
              price: number, high52: number, low52: number, changepct: number, marketcap: number) {
    this.ticker = ticker;
    this.exchange = exchange;
    this.name = name;
    this.sector = sector;
    this.price = price;
    this.high52 = high52;
    this.low52 = low52;
    this.changepct = changepct;
    this.marketcap = marketcap;
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
}

export class AdvHolding implements IAdvancedHolding {
  ticker: string;
  exchange: string;
  name: string;
  sector: string;
  price: number;
  high52: number;
  low52: number;
  changepct: number;
  marketcap: number;

  constructor(ticker: string, exchange: string, name: string, sector: string,
              price: number, high52: number, low52: number, changepct: number, marketcap: number) {
    this.ticker = ticker;
    this.exchange = exchange;
    this.name = name;
    this.sector = sector;
    this.price = price;
    this.high52 = high52;
    this.low52 = low52;
    this.changepct = changepct;
    this.marketcap = marketcap;
  }
}

export interface IAdvancedHolding {


}

export class DatePrice implements IDatePrice {
  date: string;
  price: number;

  constructor(date: string, price: number) {
    this.date = date;
    this.price = price;
  }
}

export interface IDatePrice {
  date: string;
  price: number;
}
