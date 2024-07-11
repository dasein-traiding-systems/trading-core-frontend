import React, { useState, useEffect } from "react";
import { Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useNavigate, Link } from "react-router-dom";
import { SummaryItem, SummaryItemByTf } from "../../types/apiTypes";
import { Backend } from "../../services/api";
import "./styles.less";
import classNames from "classnames";
import { humanize } from "../../utils";
const renderTfCell = (symbol: string, item: SummaryItemByTf) => {
  return (
    <div className="tf-summary">
      <Link
        className={classNames({
          red1: item.volumeDiff > 100 && item.volumeDiff < 200,
          red2: item.volumeDiff > 200 && item.volumeDiff < 300,
          red3: item.volumeDiff > 300 && item.volumeDiff < 400,
          red4: item.volumeDiff > 400,
        })}
        to={`/chart/${symbol}/${item.tf}`}
      >
        {item.volumeDiff}%
      </Link>
      <div>{item.volume}</div>
      <div>{item.volumeAvg100}</div>
      <div>{item.volumeLevel}</div>
    </div>
  );
};

interface ISummaryProps {
  large?: boolean;
}

const columns: ColumnsType<SummaryItem> = [
  {
    title: "Symbol",
    dataIndex: "symbol",
    key: "name",
    render: (symbol) => symbol,
  },
  {
    title: "1d",
    key: "tf_1d",
    dataIndex: "tf_1d",
    render: (cell, row, index) => renderTfCell(row.symbol, cell),
  },
  {
    title: "4h",
    key: "tf_4h",
    dataIndex: "tf_4h",
    render: (cell, row, index) => renderTfCell(row.symbol, cell),
  },
  {
    title: "1h",
    key: "tf_1h",
    dataIndex: "tf_1h",
    render: (cell, row, index) => renderTfCell(row.symbol, cell),
  },
  {
    title: "ATR",
    key: "atr",
    dataIndex: "atr",
    render: (cell, row, index) => {
      return (
        <>
          <div>{humanize(cell.last_24h)}</div>
          <div>{humanize(cell.last)}</div>
        </>
      );
    },
  },
];

export default function Summary({ large = false }: ISummaryProps) {
  const [summary, setSummary] = useState<SummaryItem[]>([]);

  useEffect(() => {
    Backend.fetchMarketSummary().then((data) => setSummary(data));
  }, []);

  if (!summary) {
    return <div>Loading...</div>;
  }

  return (
    <div className="market-summary">
      <Table columns={columns} dataSource={summary} pagination={false} size="small" />
    </div>
  );
}
