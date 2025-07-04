import React from "react";
import {
  processVariantProps,
  processCoreProps,
  processLayerProps,
} from "../utils/propHelpers.js";
import { mergeClassName, mergeStyle } from "../utils/marge.js";

export default function VStack(incomingProps) {
  const variant = processVariantProps(incomingProps, ["default"]);

  const core = processCoreProps(
    incomingProps,
    {
      base: {
        spacing: { default: 0 },
        align: { default: "stretch" },
        justify: { default: "flex-start" },
        className: {
          deprecated: ({ value, incomingProps }) => {
            mergeClassName(incomingProps.stackLayer, value);
          },
        },
        style: {
          deprecated: ({ value, incomingProps }) => {
            mergeStyle(incomingProps.stackLayer, value);
          },
        },
        children: {},
      },
    },
    variant
  );


  const layers = processLayerProps(incomingProps, ["stack"]);

  const { children, ...otherCorePorps } = core;
  const customizeStyle = layers.stack?.style || "";
  const { style, ...otherPorps } = layers.stack || {};
  const stackStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: core.align,
    justifyContent: core.justify,
    gap: `${core.spacing}px`,
    ...customizeStyle,
  };

  return (
    <div style={stackStyle} {...otherPorps}>
      {children}
    </div>
  );
}
