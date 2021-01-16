import React from "react";

import { H2 } from "../components/H2";
import { Divider } from "../components/Divider";

export function EnvironmentBuilding() {
  return (
    <>
      <Divider />
      <div className="mt-6 opacity-10 flex flex-col items-center">
        <H2 className="mb-6">Reserving Machine...</H2>
        <svg
          style={{
            width: "50%",
            height: "auto",
          }}
          version="1.1"
          id="L2"
          x="0px"
          y="0px"
          viewBox="0 0 100 100"
          enableBackground="new 0 0 100 100"
        >
          <circle
            fill="none"
            stroke="#000"
            strokeWidth="4"
            strokeMiterlimit="10"
            cx="50"
            cy="50"
            r="48"
          ></circle>
          <line
            fill="none"
            strokeLinecap="round"
            stroke="#000"
            strokeWidth="4"
            strokeMiterlimit="10"
            x1="50"
            y1="50"
            x2="85"
            y2="50.5"
          >
            <animateTransform
              attributeName="transform"
              dur="2s"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              repeatCount="indefinite"
            ></animateTransform>
          </line>
          <line
            fill="none"
            strokeLinecap="round"
            stroke="#000"
            strokeWidth="4"
            strokeMiterlimit="10"
            x1="50"
            y1="50"
            x2="49.5"
            y2="74"
          >
            <animateTransform
              attributeName="transform"
              dur="15s"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              repeatCount="indefinite"
            ></animateTransform>
          </line>
        </svg>
      </div>
    </>
  );
}
