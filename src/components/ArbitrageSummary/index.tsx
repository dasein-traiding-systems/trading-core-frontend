import { LineChartOutlined } from "@ant-design/icons";

import React, { useState, useEffect } from "react";
import { Space, Table, Tag } from "antd";
import type { ColumnsType, ColumnType } from "antd/es/table";
import { useNavigate, Link } from "react-router-dom";
import { ArbitrageStatsItem, ArbitrageHistoryStatsItem } from "../../types/apiTypes";
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

export default function ArbitrageSummary({ large = false }: ISummaryProps) {
  const [summary, setSummary] = useState<any>();
  const [columns, setColumns] = useState<ColumnType<any>[]>([]);

  useEffect(() => {
    console.log("---useeff");
    Backend.fetchArbitrageStats().then((data) => {
      const getStats = (tf: string) => ({
        title: `Stats(${tf})`,
        key: `stats_${tf}`,
        dataIndex: `stats_${tf}`,
        //@ts-ignore
        // onCell: (row: ArbitrageStatsItem, index) => ({
        //   className: getBgUpClass(row.history.find((i) => i.tf === tf)?.delta || 0, [0.1, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 5]),
        // }),
        //@ts-ignore
        render: (cell, r: ArbitrageStatsItem, index) => {
          const row = r.history.find((i) => i.tf === tf);
          return (
            <div className="col-history">
              <div>
                <span>spread avg:</span> {row?.delta_perc}%
              </div>
              <div>
                <span>spread range:</span> [{row?.delta_perc_min}% ... {row?.delta_perc_max}%]
              </div>
            </div>
          );
        },
      });

      let columns: any[] = [
        {
          title: "Symbol",
          key: "symbol",
          dataIndex: "symbol",
          //@ts-ignore
          render: (cell, row: ArbitrageStatsItem, index) => <div className="col-symbol">{row.symbol}</div>,
        },
        {
          title: "Price",
          key: "price",
          dataIndex: "price",
          onCell: (row: ArbitrageStatsItem) => ({
            className:
              row.price.delta_perc > 0
                ? getBgUpClass(row.price.delta_perc, [0.1, 0.2, 0.3, 0.5, 0.7, 1, 2, 3, 4, 5])
                : getBgDownClass(row.price.delta_perc, [-0.1, -0.25, -0.5, -0.75, -1, -1.5, -2, -3, -4, -5], "green"),
          }),
          //@ts-ignore
          render: (cell, row: ArbitrageStatsItem, index) => (
            <div className="col-price">
              <div>
                <span>spot:</span>
                {humanize(row.price.spot)}
              </div>
              <div>
                <span>futures:</span>
                {humanize(row.price.futures)}
              </div>
              <div className="delta">
                <span>delta</span>
                {row.price.delta_perc}%
              </div>
            </div>
          ),
        },
      ];
      data[0].history.map((item: ArbitrageHistoryStatsItem) => {
        columns.push(getStats(item.tf));
      });

      data.sort((a, b) => Math.abs(b.price.delta_perc) - Math.abs(a.price.delta_perc));
      setSummary(data as any);
      setColumns(columns);
    });
  }, []);

  if (!summary || !columns) {
    return <PreLoader />;
  }

  return (
    <Content>
      <div className="arbitrage-summary">
        <Table columns={columns} dataSource={summary} pagination={false} size="small" rowKey="symbol" />
      </div>
    </Content>
  );
}
