import React, { useState, useEffect } from "react";
import ArbitrageSummary from "../ArbitrageSummary";
import ArbitrageChart from "../ArbitrageChart";
export default function MainPage(props: {}) {
  return (
    <div>
      <ArbitrageChart />
      <ArbitrageSummary />
    </div>
  );
}
