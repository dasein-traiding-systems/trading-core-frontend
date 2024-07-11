import React from "react";

import Plot from "react-plotly.js";
import { ISymbolTs } from "../../types/common";
import { SymbolCandles } from "../../types/apiTypes";
import { Backend } from "../../services/api";
import { findIndex, reduce, findLastIndex, clone, min, max, slice, apply } from "ramda";
import "./styles.less";
import { Datum, TypedArray } from "plotly.js";
import PreLoader from "../PreLoader";
import dayjs, { Dayjs } from "dayjs";
var utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
export interface IChartState {
  candles?: Partial<Plotly.CandlestickData>;
  volumes?: Partial<Plotly.PlotData>;
  layout?: Partial<Plotly.Layout>;
  clusterItems: Array<Partial<Plotly.PlotData>>;
  loaded: boolean;
}

var selectorButtons: Partial<Plotly.RangeSelectorButton>[] = [
  {
    step: "day",
    stepmode: "backward",
    count: 1,
    label: "1d",
  },
  {
    step: "day",
    stepmode: "backward",
    count: 7,
    label: "7-days",
  },
  {
    step: "month",
    stepmode: "backward",
    count: 1,
    label: "1m",
  },
  {
    step: "month",
    stepmode: "backward",
    count: 6,
    label: "6m",
  },
  {
    step: "year",
    stepmode: "backward",
    count: 1,
    label: "1y",
  },
  {
    step: "all",
    label: "RESET",
  },
];

const candlesDefault: Partial<Plotly.CandlestickData> = {
  type: "candlestick",
  xaxis: "x",
  // yaxis: "y",
  decreasing: { line: { color: "#7F7F7F" } },
  increasing: { line: { color: "#17BECF" } },
  name: "Candles",
};

const volumesDefault: Partial<Plotly.PlotData> = {
  type: "bar",
  xaxis: "x",
  yaxis: "y2",
  name: "D/N Volume",
};

const clustersDefault: Partial<Plotly.ScatterData> = {
  xaxis: "x",
  mode: "markers",
};

const findMinMaxIndex = (data: any[], minValue: any, maxValue: any): { minIndex: any; maxIndex: any } => {
  const timestamps = data.map((d) => dayjs(d).toDate());
  const minIndex = findIndex<any>((i) => i >= dayjs(minValue).toDate(), timestamps);
  const maxIndex = findLastIndex<any>((i) => i <= dayjs(maxValue).toDate(), data);
  return { minIndex, maxIndex };
};

const findMinMaxValues = (data: any[], indexFrom: number = 0, indexTo: number | undefined): { minValue: any; maxValue: any } => {
  const indexTo_ = indexTo || data.length - 1;
  const minValue = reduce(min, Infinity, slice(indexFrom, indexTo_, data));
  // @ts-ignore: Object is possibly 'undefined'.
  const maxValue = reduce(max, -Infinity, slice(indexFrom, indexTo_, data));
  return { minValue, maxValue };
};
class Chart extends React.PureComponent<ISymbolTs, IChartState> {
  constructor(props: ISymbolTs) {
    super(props);

    this.state = {
      candles: candlesDefault,
      layout: {},
      volumes: volumesDefault,
      loaded: false,
      clusterItems: [],
    };
  }
  componentDidMount() {
    this.loadCandles();
  }

  componentDidUpdate(prevProps: ISymbolTs, prevState: IChartState) {
    const { symbol, tf } = this.props;

    if (prevProps.symbol !== symbol || prevProps.tf !== tf) {
      this.loadCandles();
    }
  }
  loadCandles() {
    const { symbol, tf } = this.props;
    console.log("-----loadCandles", symbol, tf);
    if (symbol && tf) {
      Backend.fetchCandles(symbol, tf).then((data) => {
        const { o, h, l, c, v, timestamp } = data.candles;
        const { priceLevels, volumeLevel, clusters } = data;
        // const { minPrice, maxPrice, maxVolume, minVolume } = data.bounds;
        const candles: Partial<Plotly.CandlestickData> = {
          ...candlesDefault,
          x: timestamp,
          open: o,
          high: h,
          low: l,
          close: c,
        };
        const volumes: Partial<Plotly.PlotData> = {
          ...volumesDefault,
          x: timestamp,
          y: v,
        };

        const volumeLevelShape: Partial<Plotly.Shape> = {
          type: "line",
          x0: timestamp[0],
          y0: volumeLevel,
          x1: timestamp[timestamp.length - 1],
          y1: volumeLevel,
          yref: "y2",
          line: {
            color: "red",
            width: 1.5,
            dash: "solid",
          },
        };

        const priceLevelShapes: Partial<Plotly.Shape>[] = priceLevels.map((pl) => ({
          type: "line",
          x0: timestamp[0],
          y0: pl,
          x1: timestamp[timestamp.length - 1],
          y1: pl,
          yref: "y",
          line: {
            color: "red",
            width: 1.5,
            dash: "dash",
          },
        }));
        const clusterItems: Array<Partial<Plotly.PlotData>> = [];
        Object.keys(clusters).forEach(function (key, index) {
          const item: Partial<Plotly.PlotData> = {
            ...clustersDefault,
            x: clusters[key].timestamp,
            y: clusters[key].price,
            name: `Cluster ${clusters[key].volume}`,
            marker: { color: "blue", size: (index + 1) * 1.5, opacity: 0.5 },
          };
          clusterItems.push(item);
        });
        const rangeEnd = dayjs(timestamp[timestamp.length - 1] + "Z", "YYYY-MM-DDTHH:mm:ss")
          .add(1, "hour")
          .toISOString()
          .replace("Z", "");
        // console.log("----d", rangeEnd, dayjs(timestamp[timestamp.length - 1]), timestamp[timestamp.length - 1]);
        const rangeDefault: [Datum, Datum] = [timestamp[timestamp.length - 50], rangeEnd];
        const dateIndexes = findMinMaxIndex(candles?.x as string[], rangeDefault[0], rangeDefault[1]);
        const minValue = reduce(min, Infinity, slice(dateIndexes.minIndex, dateIndexes.maxIndex, candles?.low as number[]));
        const maxValue = reduce(max, -Infinity, slice(dateIndexes.minIndex, dateIndexes.maxIndex, candles?.high as number[]));

        const volumeBounds = findMinMaxValues(volumes?.y as number[], dateIndexes.minIndex, dateIndexes.maxIndex);

        const layout: Partial<Plotly.Layout> = {
          title: `${symbol} - ${tf}`,
          autosize: true,
          showlegend: false,
          xaxis: {
            range: rangeDefault,
            autorange: false,
            rangeselector: { buttons: selectorButtons },
            title: "Date",
            type: "date",
          },
          yaxis: {
            autorange: false,
            range: [minValue, maxValue],
            domain: [0.3, 1],
          },

          yaxis2: {
            // anchor: "x",
            autorange: false,
            range: [volumeBounds.minValue, volumeBounds.maxValue],
            domain: [0, 0.3],
          },
          shapes: [...priceLevelShapes, volumeLevelShape],
        };
        this.setState({ candles, volumes, layout, loaded: true, clusterItems });
      });
    }
  }
  onPlotRelayout(e: Plotly.PlotRelayoutEvent) {
    const { layout, candles, volumes, loaded } = this.state;
    if (!loaded) return;
    // @ts-ignore
    const minRange: string | undefined = e["xaxis.range"] ? e["xaxis.range"][0] : e["xaxis.range[0]"];
    // @ts-ignore
    const maxRange: string | undefined = e["xaxis.range"] ? e["xaxis.range"][1] : e["xaxis.range[1]"];
    console.log("---slc1", e, minRange, maxRange);

    if ((!minRange && !maxRange) || !layout) return;

    const dateIndexes = findMinMaxIndex(candles?.x as string[], minRange, maxRange);

    const minValue = reduce(min, Infinity, slice(dateIndexes.minIndex, dateIndexes.maxIndex, candles?.low as number[]));
    const maxValue = reduce(max, -Infinity, slice(dateIndexes.minIndex, dateIndexes.maxIndex, candles?.high as number[]));

    const volumeBounds = findMinMaxValues(volumes?.y as number[], dateIndexes.minIndex, dateIndexes.maxIndex);

    // @ts-ignore
    layout.yaxis.range = [minValue, maxValue];
    // @ts-ignore
    layout.yaxis2.range = [volumeBounds.minValue, volumeBounds.maxValue];
    // console.log("-----scale", candles?.x?.length, minValue, maxValue, slice(dateIndexes.minIndex, dateIndexes.maxIndex, candles?.low as number[]));

    layout.uirevision = Date.now();
    this.setState({ layout });
    this.forceUpdate();
  }
  public render() {
    const { candles, layout, volumes, clusterItems } = this.state;
    if (!candles || !layout || !volumes) return <PreLoader />;

    const chartData: Plotly.Data[] = [candles, volumes, ...clusterItems]; //
    return (
      <div>
        <Plot
          className="chart-wrapper"
          config={{ responsive: true }}
          useResizeHandler={true}
          data={chartData}
          layout={layout}
          onRelayout={(e) => this.onPlotRelayout(e)}
          onSelected={(figure) => console.log("----f", figure)}
        />
      </div>
    );
  }
}

export default Chart;
