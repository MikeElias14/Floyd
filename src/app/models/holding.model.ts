import { ChartDataSets } from 'chart.js';
import { IHoldingInfo, IIndexInfo } from './info.model';

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
  diviendHistory: Array<IDatePrice>;
  events: Array<IHoldingEvent>;

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
    this.history = [];
    this.info = {} as IHoldingInfo;
    this.diviendHistory = [];
    this.events = [];
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
  events: Array<IHoldingEvent>;
  diviendHistory: Array<IDatePrice>;
}

export interface IHoldingEvent {
  Value: {
    'Earnings Average': number;
    'Earnings Date': string;
    'Earnings High': number;
    'Earnings Low': number;
    'Revenue Average': number;
    'Revenue High': number;
    'Revenue Low': number;
  };
}


export class IndexHolding implements IIndex {
  ticker: string;
  info: IIndexInfo;
  history: Array<IDatePrice>;
  changepct: number;
  dataset: Array<ChartDataSets>;
  labels: Array<string>;

  constructor(ticker: string) {
    this.ticker = ticker;
    this.changepct = 0;
    this.info = {} as IIndexInfo;
    this.dataset = [];
    this.history = [];
    this.labels = [];
  }
}

export interface IIndex {
  ticker: string;
  changepct: number;
  info: IIndexInfo;
  history: Array<IDatePrice>;
  dataset: Array<ChartDataSets>;
  labels: Array<string>;
}


export interface IDatePrice {
  price: number;
  date: string;
}
