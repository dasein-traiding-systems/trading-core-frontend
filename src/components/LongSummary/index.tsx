import { LineChartOutlined } from "@ant-design/icons";

import React, { useState, useEffect } from "react";
import { Space, Table, Tag } from "antd";
import type { ColumnsType, ColumnType } from "antd/es/table";
import { useNavigate, Link } from "react-router-dom";
import { LargeSummaryItemByTf, LargeSummaryItem } from "../../types/apiTypes";
import { Backend } from "../../services/api";
import "./styles.less";
import classNames from "classnames";
import { humanize, flattenObject } from "../../utils";
import { Layout } from "antd";
import PreLoader from "../PreLoader";
import { getBgDownClass, getBgUpClass, getRatio } from "../../utils/styling";
const { Header, Footer, Sider, Content } = Layout;
interface ISummaryProps {
  large?: boolean;
}

export default function Summary({ large = false }: ISummaryProps) {
  const [summary, setSummary] = useState<any>();
  const [columns, setColumns] = useState<ColumnType<any>[]>([]);

  useEffect(() => {
    console.log("---useeff");
    Backend.fetchLongSummary().then((data) => {
      const getVolumeCol = (tf: string) => ({
        title: `volume(${tf})`,
        key: `volume_${tf}`,
        dataIndex: `volume_${tf}`,
        //@ts-ignore
        onCell: (row: LargeSummaryItem, index) => ({ className: getBgUpClass(row.tfs[tf].volumeRatio, [-25, -20, -10, 0, 10, 20, 30, 40, 50]) }),
        //@ts-ignore
        render: (cell, r: LargeSummaryItem, index) => {
          const row = r.tfs[tf];
          return (
            <div className="col-volume">
              <div>
                <span>level:</span> {Math.round(row.volumeLevel)}({Math.round(row.volumeRatio)}%)
              </div>
              <div className="now">
                <div>
                  <span>now:</span> {Math.round(row.volume)}
                </div>
                <Link to={`/chart/${r.symbol}/${tf}`}>
                  <LineChartOutlined />
                </Link>
              </div>
              <div>
                <span>avg 60.</span>
                {Math.round(row.volumeAvg_60d)}
              </div>
            </div>
          );
        },
      });
      const getAtrCol = (tf: string): any => ({
        title: `ATR(${tf})`,
        key: `atr_${tf}`,
        dataIndex: `atr_${tf}`,
        //@ts-ignore
        onCell: (row: LargeSummaryItem, index) => ({ className: getBgUpClass(row.tfs[tf].atr.volatility, [5, 10, 20, 30, 40, 100, 200]) }),
        //@ts-ignore
        render: (cell, r: LargeSummaryItem, index) => {
          const row = r.tfs[tf];
          return (
            <div className="col-atr">
              <div className="atr-last">{humanize(row.atr.last)}</div>
              <div className="atr-5">{humanize(row.atr.last_5)}(5)</div>
              <div className="atr-60">{humanize(row.atr.last_60)}(60)</div>
              <div>Volatility: {humanize(row.atr.volatility)}%</div>
            </div>
          );
        },
      });
      const getPriceLevelsCol = (tf: string) => ({
        title: `Levels(${tf})`,
        key: `levels_${tf}`,
        dataIndex: `levels_${tf}`,
        //@ts-ignore
        onCell: (row: LargeSummaryItem, index) => {
          const pRatio = row.tfs[tf].priceLevelsRatio;

          const color = pRatio[0] > pRatio[1] ? "green" : "blue";
          const ratio = pRatio[0] < pRatio[1] && pRatio[0] !== 0 ? pRatio[0] : pRatio[1];
          if (ratio == 0) return {};
          return { className: getBgDownClass(ratio, [10, 5, 4, 3, 2, 1, 0.5], color) };
        },
        //@ts-ignore
        render: (cell, r: LargeSummaryItem, index) => {
          const row = r.tfs[tf];
          const has_resist = row.priceLevels[1] != 0;
          const has_sup = row.priceLevels[0] != 0;
          const ratio_resist = has_resist && `(${Math.round(row.priceLevelsRatio[1])}%)`;
          const ratio_sup = has_sup && `(${Math.round(row.priceLevelsRatio[0])}%)`;
          const level_resist = has_resist ? humanize(row.priceLevels[1]) : "???";
          const level_sup = has_sup ? humanize(row.priceLevels[0]) : "???";
          return (
            <div className="col-price">
              <div className="resistance">
                {level_resist}
                {ratio_resist}
              </div>
              <div className="price">{row.price}</div>
              <div className="support">
                {level_sup}
                {ratio_sup}
              </div>
            </div>
          );
        },
      });

      let columns: any[] = [
        {
          title: "symbol",
          key: "symbol",
          dataIndex: "symbol",
          //@ts-ignore
          render: (cell, row, index) => <div>{row["symbol"]}</div>,
        },
      ];

      //   data.forEach((i) => {});

      Object.keys(data[0].tfs).map((tf: string) => {
        columns.push(getVolumeCol(tf));
        columns.push(getAtrCol(tf));
        columns.push(getPriceLevelsCol(tf));
      });

      setSummary(data as any);
      setColumns(columns);
    });
  }, []);

  if (!summary || !columns) {
    return <PreLoader />;
  }

  return (
    <Content>
      <div className="long-summary">
        <Table columns={columns} dataSource={summary} pagination={false} size="small" rowKey="symbol" />
      </div>
    </Content>
  );
}
