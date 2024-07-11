import { SymbolItems, SymbolCandles, SummaryItem, LargeSummaryItem, ArbitrageStatsItem, ArbitrageChartData } from "../types/apiTypes";
import axios, { AxiosResponse } from "axios";
import { MocksBackend } from "./mocks";

const USE_MOCK = false;
// const BACKEND_URL = "http://localhost:8777";
// const BACKEND_URL = process.env.NODE_ENV == "development" ? "http://5.75.137.107:8777" : "http://oracle_backend:8777";
const BACKEND_URL = "http://5.75.137.107:8777";

const instance = axios.create({
  baseURL: BACKEND_URL,
  timeout: 25000,
});

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
  get: (url: string) => instance.get(url).then(responseBody),
  post: (url: string, body: {}) => instance.post(url, body).then(responseBody),
  put: (url: string, body: {}) => instance.put(url, body).then(responseBody),
  delete: (url: string) => instance.delete(url).then(responseBody),
};

// const axios = require("axios").default;

axios.interceptors.response.use(undefined, (error: any) => {
  console.log("ERRRR:", error);
  if (error.response.status === 401) {
    //   ipcRenderer.send('response-unauthenticated');
  }
  return Promise.reject(error);
});

export const Backend = {
  fetchSymbols: (): Promise<SymbolItems> => (USE_MOCK ? MocksBackend.getSymbols() : requests.get("symbols")),
  fetchCandles: (symbol: string, tf: string): Promise<SymbolCandles> => (USE_MOCK ? MocksBackend.getCandles(symbol, tf) : requests.get(`candles/${symbol}/${tf}`)),
  fetchMarketSummary: (): Promise<SummaryItem[]> => (USE_MOCK ? MocksBackend.getMarketSummary() : requests.get("market-summary")),
  fetchLongSummary: (): Promise<LargeSummaryItem[]> => (USE_MOCK ? MocksBackend.getLongSummary() : requests.get("long-summary")),
  fetchArbitrageStats: (): Promise<ArbitrageStatsItem[]> => (USE_MOCK ? MocksBackend.getArbitrageStats() : requests.get("arbitrage-stats")),
  fetchArbitrageChartData: (): Promise<ArbitrageChartData> => (USE_MOCK ? MocksBackend.getArbitrageChartData() : requests.get("arbitrage-chart-data")),

  // getAPost: (id: number): Promise<PostType> => requests.get(`posts/${id}`),
  // createPost: (post: PostType): Promise<PostType> =>
  // 	requests.post('posts', post),
  // updatePost: (post: PostType, id: number): Promise<PostType> =>
  // 	requests.put(`posts/${id}`, post),
  // deletePost: (id: number): Promise<void> => requests.delete(`posts/${id}`),
};
