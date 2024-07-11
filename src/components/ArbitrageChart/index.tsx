import React from "react";

import Plot from "react-plotly.js";
import { ISymbolTs } from "../../types/common";
import { ArbitrageChartData } from "../../types/apiTypes";
import { Backend } from "../../services/api";
import { findIndex, reduce, findLastIndex, clone, min, max, slice, apply } from "ramda";
import "./styles.less";
import { Datum, TypedArray } from "plotly.js";
import PreLoader from "../PreLoader";
import dayjs, { Dayjs } from "dayjs";
import { Select, Space } from "antd";
var utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
export interface IChartState {
  charts?: Array<Partial<Plotly.PlotData>>;
  symbols: Array<string>;
  symbol: string;
  layout?: Partial<Plotly.Layout>;
  loaded: boolean;
}

var selectorButtons: Partial<Plotly.RangeSelectorButton>[] = [
  {
    step: "hour",
    stepmode: "backward",
    count: 12,
    label: "12h",
  },
  {
    step: "day",
    stepmode: "backward",
    count: 1,
    label: "1d",
  },
  {
    step: "day",
    stepmode: "backward",
    count: 3,
    label: "7-days",
  },
  {
    step: "day",
    stepmode: "backward",
    count: 7,
    label: "7-days",
  },
  {
    step: "all",
    label: "RESET",
  },
];

const chartDefault: Partial<Plotly.ScatterData> = {
  xaxis: "x",
  mode: "markers",
};

class Chart extends React.PureComponent<ISymbolTs, IChartState> {
  constructor(props: ISymbolTs) {
    super(props);

    this.state = {
      charts: [],
      symbols: [],
      symbol: "",
      layout: {},
      loaded: false,
    };
  }
  componentDidMount() {
    this.loadCharts();
  }

  componentDidUpdate(prevProps: ISymbolTs, prevState: IChartState) {
    const { symbol } = this.state;

    if (prevState.symbol !== symbol) {
      this.filterCharts();
    }
  }
  filterCharts() {}

  loadCharts() {
    Backend.fetchArbitrageChartData().then((data) => {
      const { timestamp, delta_perc } = data;

      const charts: Array<Partial<Plotly.PlotData>> = [];
      let minValue = Infinity;
      let maxValue = -Infinity;
      const symbols = Object.keys(delta_perc);
      symbols.forEach(function (key, index) {
        minValue = Math.min(...[minValue, ...delta_perc[key]]);
        maxValue = Math.max(...[maxValue, ...delta_perc[key]]);
        const item: Partial<Plotly.PlotData> = {
          ...chartDefault,
          x: timestamp,
          y: delta_perc[key],
          name: key,
          marker: { color: index, size: 4, opacity: 0.8, colorscale: "Viridis" },
        };
        charts.push(item);
      });

      const layout: Partial<Plotly.Layout> = {
        margin: {
          l: 10,
          r: 10,
          b: 10,
          t: 10,
          pad: 4,
        },
        autosize: true,
        showlegend: true,
        xaxis: {
          automargin: true,
          autorange: true,
          rangeselector: { buttons: selectorButtons },
          title: "Date",
          type: "date",
        },
        yaxis: {
          automargin: true,
          autorange: false,
          range: [minValue, maxValue],
        },
      };
      this.setState({ charts, loaded: true, symbols, layout });
    });
  }
  // onPlotRelayout(e: Plotly.PlotRelayoutEvent) {
  //   const { layout, candles, volumes, loaded } = this.state;
  //   if (!loaded) return;
  //   // @ts-ignore
  //   const minRange: string | undefined = e["xaxis.range"] ? e["xaxis.range"][0] : e["xaxis.range[0]"];
  //   // @ts-ignore
  //   const maxRange: string | undefined = e["xaxis.range"] ? e["xaxis.range"][1] : e["xaxis.range[1]"];
  //   console.log("---slc1", e, minRange, maxRange);

  //   if ((!minRange && !maxRange) || !layout) return;

  //   const dateIndexes = findMinMaxIndex(candles?.x as string[], minRange, maxRange);

  //   const minValue = reduce(min, Infinity, slice(dateIndexes.minIndex, dateIndexes.maxIndex, candles?.low as number[]));
  //   const maxValue = reduce(max, -Infinity, slice(dateIndexes.minIndex, dateIndexes.maxIndex, candles?.high as number[]));

  //   const volumeBounds = findMinMaxValues(volumes?.y as number[], dateIndexes.minIndex, dateIndexes.maxIndex);

  //   // @ts-ignore
  //   layout.yaxis.range = [minValue, maxValue];
  //   // @ts-ignore
  //   layout.yaxis2.range = [volumeBounds.minValue, volumeBounds.maxValue];
  //   // console.log("-----scale", candles?.x?.length, minValue, maxValue, slice(dateIndexes.minIndex, dateIndexes.maxIndex, candles?.low as number[]));

  //   layout.uirevision = Date.now();
  //   this.setState({ layout });
  //   this.forceUpdate();
  // }
  onSymbolChange = (symbol: string): void => {
    this.setState({ symbol });
  };
  public render() {
    const { charts, layout, symbol, symbols } = this.state;
    if (!charts || !layout) return <PreLoader />;
    const chartData = !!symbol ? charts.filter((c) => c.name == symbol) : charts;
    console.log("----red", chartData, symbol, layout);

    return (
      <div className="arbitrage-chart">
        <Space className="symbol-select">
          <Select
            value={symbol}
            showSearch
            placeholder="Select a Symbol"
            optionFilterProp="children"
            style={{ width: 120 }}
            onChange={(s) => this.onSymbolChange(s)}
            filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
            options={[{ value: "", label: "    ALL   " }, ...symbols.map((s) => ({ value: s, label: s }))]}
          />
        </Space>
        <Plot
          className="arbitrage-chart-wrapper"
          config={{ responsive: true }}
          useResizeHandler={true}
          data={chartData}
          layout={layout}
          // onRelayout={(e) => this.onPlotRelayout(e)}
          onSelected={(figure) => console.log("----f", figure)}
        />
      </div>
    );
  }
}

export default Chart;
