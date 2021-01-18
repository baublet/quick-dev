import React from "react";

export function ButtonSpinner() {
  return (
    <div
      className="absolute top-1/2 left-1/2"
      style={{
        transform: "translate(-50%, -50%)",
        height: "2em",
        width: "2em",
      }}
    >
      <svg
        x="0"
        y="0"
        viewBox="0 0 100 100"
        enableBackground="new 0 0 0 0"
        className="fill-current"
      >
        <path d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            dur="1s"
            from="0 50 50"
            to="360 50 50"
            repeatCount="indefinite"
          ></animateTransform>
        </path>
      </svg>
    </div>
  );
}
