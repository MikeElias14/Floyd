import { IHoldingInfo } from './holding-info.model';

export class Holding implements IHolding {
  ticker: string;
  exchange: string;
  name: string;
  sector: string;
  price: number;
  changepct: number;
  marketcap: number;
  history: Array<IDatePrice>;
  info: IHoldingInfo;
  owned: number;

  constructor(ticker: string, exchange: string, sector: string,
              price: number, changepct: number, marketcap: number, name?: string, owned?: number) {
    this.ticker = ticker;
    this.exchange = exchange;
    this.name = name || '';
    this.sector = sector;
    this.price = price;
    this.changepct = changepct;
    this.marketcap = marketcap;
    this.owned = owned || 0;
  }
}

export interface IHolding {
  ticker: string;
  exchange: string;
  name: string;
  sector: string;
  price: number;
  changepct: number;
  marketcap: number;
  history: Array<IDatePrice>;
  info: IHoldingInfo;
  owned: number;
}


export interface IDatePrice {
  price: number;
  date: string;
}
