import React from "react";
import cx from "classnames";

import { H4 } from "../components/H4";
import { FormState } from "./useFormState";
import type { EnvironmentSize } from "../../lambda/common/entities";

const sizes: Record<EnvironmentSize, string> = {
  s: "Standard",
  m: "Power",
  l: "Professional",
  xl: "Advanced",
  xxl: "Godlike",
};

function SizeButton({
  size,
  checked,
  setSize,
}: {
  size: EnvironmentSize;
  checked: boolean;
  setSize: (size: EnvironmentSize) => void;
}) {
  const id = `size-${size}`;
  const className = cx(
    "border border-gray-200 rounded-sm p-4 w-64 h-72 text-center mr-4 shadow hover:shadow-lg cursor-pointer flex-shrink-0",
    {
      "border-gray-900 -translate-y-1": checked,
      "opacity-75": !checked,
    }
  );
  return (
    <>
      <label htmlFor={id} className={className}>
        {size}
      </label>
      <input
        id={id}
        type="radio"
        className="sr-only"
        name="size"
        value={size}
        checked={checked}
        onChange={(event) => event.target.checked && setSize(size)}
      />
    </>
  );
}

export function SizePicker({ formState }: { formState: FormState }) {
  const checked = (size: EnvironmentSize) => formState.size === size;
  const setSize = formState.setSize;
  console.log({ "formstate.size": formState.size });

  return (
    <>
      <H4>Size</H4>
      <div className="overflow-x-auto">
        <div className="flex px-2 py-4">
          <SizeButton size={"s"} checked={checked("s")} setSize={setSize} />
          <SizeButton size={"m"} checked={checked("m")} setSize={setSize} />
          <SizeButton size={"l"} checked={checked("l")} setSize={setSize} />
          <SizeButton size={"xl"} checked={checked("xl")} setSize={setSize} />
          <SizeButton size={"xxl"} checked={checked("xxl")} setSize={setSize} />
        </div>
      </div>
    </>
  );
}
