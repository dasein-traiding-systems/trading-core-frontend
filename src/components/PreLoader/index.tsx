import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import React from "react";
import "./styles.less";
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const PreLoader: React.FC = () => (
  <div className="preloader">
    <Spin indicator={antIcon} />
  </div>
);

export default PreLoader;
