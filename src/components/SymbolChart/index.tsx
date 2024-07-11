import { useParams } from "react-router-dom";
import Summary from "../Summary";

import Chart from "../Chart";
import SymbolTsSelect from "../SymbolTfSelect";
import "./styles.less";

export default function SymbolChart(props: {}) {
  let { symbol, tf } = useParams();
  return (
    <div className="content">
      <div className="main">
        <SymbolTsSelect />
        <Chart symbol={symbol} tf={tf} />
      </div>
      <div className="sidebar">
        <Summary />
      </div>
    </div>
  );
}
