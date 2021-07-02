import React from "react";

const Footer = () => {
  return (
    <div className="page-footer footer">
      {/* <p style={{ "text-align": "center", justifyContent: "space-between" }}> */}
      <p>
        <span>Tack</span> - 2021 Copyright. All Rights Reserved.
        <a
          href="https://github.com/code21112"
          style={{ cursor: "pointer", marginLeft: "5px" }}
        >
          @code21112
        </a>
      </p>
    </div>
  );
};

export default Footer;
