import React, { useState, useEffect } from "react";
import { Select, Space } from "antd";
import type { SpaceSize } from "antd/es/space";

import { useNavigate, useParams } from "react-router-dom";

import { Backend } from "../../services/api";
import "./styles.less";
export default function SymbolTsSelect(props: {}) {
  const navigate = useNavigate();

  const { symbol, tf } = useParams();
  console.log("----", symbol, tf, props);
  const [tfSelected, setTf] = useState<string | undefined>(tf);
  const [symbolSelected, setSymbol] = useState<string | undefined>(symbol);

  const [symbols, setSymbols] = useState<string[]>([]);
  const [tfs, setTfs] = useState<string[]>([]);

  useEffect(() => {
    console.log("----use Effect");

    Backend.fetchSymbols().then((data) => {
      const { symbols, tfs } = data;
      setSymbols(symbols);
      setTfs(tfs);
      setTf(tf);
      setSymbol(symbol);
    });
  }, []);

  useEffect(() => {
    if (tfSelected && symbolSelected) {
      navigate(`/chart/${symbolSelected}/${tfSelected}`);
    }
  }, [tfSelected, symbolSelected]);

  const onSymbolChange = (value: string): void => {
    console.log(value);
    setSymbol(value);
  };

  const onTfChange = (value: string): void => {
    console.log(value);
    setTf(value);
  };

  return (
    <Space className="symbol-tf-select">
      <Select
        value={symbol}
        showSearch
        placeholder="Select a Symbol"
        optionFilterProp="children"
        onChange={onSymbolChange}
        filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
        options={symbols.map((s) => ({ value: s, label: s }))}
      />
      <Select value={tf} placeholder="Select a TimeFrame" onChange={onTfChange} options={tfs.map((s) => ({ value: s, label: s }))} />
    </Space>
  );
}
