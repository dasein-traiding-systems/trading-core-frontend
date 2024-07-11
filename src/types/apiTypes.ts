/* tslint:disable */
/* eslint-disable */
/**
/* This file was automatically generated from pydantic models by running pydantic2ts.
/* Do not modify it by hand - just update the pydantic models and then re-run the script
*/

export interface ArbitrageChartData {
  timestamp: string[];
  delta_perc: {
    [k: string]: number[];
  };
}
export interface ArbitrageHistoryStatsItem {
  tf: string;
  delta: number;
  delta_perc: number;
  delta_max: number;
  delta_perc_max: number;
  delta_min: number;
  delta_perc_min: number;
}
export interface ArbitragePriceDeltaItem {
  spot: number;
  futures: number;
  delta: number;
  delta_perc: number;
}
export interface ArbitrageStatsItem {
  symbol: string;
  price: ArbitragePriceDeltaItem;
  history: ArbitrageHistoryStatsItem[];
}
export interface AtrItem {
  last: number;
  last_24h: number;
}
export interface CandlesBounds {
  minPrice: number;
  maxPrice: number;
  maxVolume: number;
  minVolume: number;
}
export interface CandlesItem {
  timestamp: string[];
  o: number[];
  h: number[];
  l: number[];
  c: number[];
  v: number[];
}
export interface ClustersItem {
  timestamp: string[];
  volume: number[];
  price: number[];
}
export interface LargeAtrItem {
  last: number;
  last_5: number;
  last_60: number;
  volatility: number;
}
export interface LargeSummaryItem {
  symbol: string;
  tfs: {
    [k: string]: LargeSummaryItemByTf;
  };
}
export interface LargeSummaryItemByTf {
  tf: string;
  volumeLevel: number;
  volume: number;
  volumeRatio: number;
  volumeAvg_60d: number;
  atr: LargeAtrItem;
  price: number;
  priceLevels: number[];
  priceLevelsRatio: number[];
}
export interface SummaryItem {
  symbol: string;
  tf_1d?: SummaryItemByTf;
  tf_4h?: SummaryItemByTf;
  tf_1h?: SummaryItemByTf;
  tf_15m?: SummaryItemByTf;
  atr: AtrItem;
}
export interface SummaryItemByTf {
  tf: string;
  volumeLevel: number;
  volume: number;
  volumeDiff: number;
  volumeAvg100: number;
}
export interface SymbolCandles {
  symbol: string;
  tf: string;
  candles: CandlesItem;
  bounds: CandlesBounds;
  priceLevels: number[];
  volumeLevel: number;
  clusters: {
    [k: string]: ClustersItem;
  };
}
export interface SymbolItems {
  symbols: string[];
  tfs: string[];
}
export interface SymbolPriceItem {
  price: number;
}
