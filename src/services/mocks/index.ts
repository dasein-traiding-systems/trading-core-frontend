import symbols_json from "./symbols.json";
import candles_json from "./candles.json";
import market_summary_json from "./market-summary.json";
import long_summary_json from "./long-summary.json";
import arbitrage_stats_json from "./arbitrage-stats.json";
import arbitrage_chart_data_json from "./arbitrage-chart-data.json";
export const MocksBackend = {
  getSymbols: (): Promise<any> => {
    return Promise.resolve(symbols_json);
  },

  getCandles: (symbol: string, ts: string): Promise<any> => {
    return Promise.resolve(candles_json);
  },

  getMarketSummary: (): Promise<any> => {
    return Promise.resolve(market_summary_json);
  },
  getLongSummary: (): Promise<any> => {
    return Promise.resolve(long_summary_json);
  },
  getArbitrageStats: (): Promise<any> => {
    return Promise.resolve(arbitrage_stats_json);
  },
  getArbitrageChartData: (): Promise<any> => {
    return Promise.resolve(arbitrage_chart_data_json);
  },
};
