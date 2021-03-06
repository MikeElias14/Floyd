// Holding Info from Floyd-api

export interface IHoldingInfo {
  beta: number ;
  bookValue: number;
  currency: string;
  dividendRate: number;
  dividendYield: number;
  enterpriseValue: number;
  exDividendDate: string;
  fiftyDayAverage: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  fiveYearAverageReturn: number;
  fiveYearAvgDividendYield: number;
  forwardEps: number;
  forwardPE: number;
  fullTimeEmployees: number;
  industry: string;
  'logo_url': string;
  marketCap: number;
  payoutRatio: number;
  pegRatio: number;
  priceToBook: number;
  priceToSalesTrailing12Months: number;
  profitMargins: number;
  revenueQuarterlyGrowth: number;
  sharesPercentSharesOut: number;
  shortName: string;
  trailingAnnualDividendRate: number;
  trailingAnnualDividendYield: number;
  trailingEps: number;
  trailingPE: number;
  twoHundredDayAverage: number;
  website: string;
  yield: number;
  ytdReturn: number;
}

export interface IIndexInfo {
  currency: string;
  open: number;
  previousClose: number;
  shortName: string;
}
