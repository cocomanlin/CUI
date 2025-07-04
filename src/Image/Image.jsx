import React from "react";
import styles from "./Image.module.css";
import { symbolMap } from "./symbolMap";
import {
  processVariantProps,
  processCoreProps,
  processLayerProps,
} from "../utils/propHelpers.js";
import { mergeClassName, mergeStyle } from "../utils/marge.js";

export default function Image(incomingProps) {
  let variant = incomingProps.variant;
  if (!variant) {
    if (incomingProps.systemName) {
      variant = "symbol";
    } else if (incomingProps.type) {
      variant = `photo-${incomingProps.type}`;
    } else {
      variant = "photo-default";
    }
  }

  variant = processVariantProps({ variant }, [
    "photo-default",
    "photo-square",
    "symbol",
  ]);

  const core = processCoreProps(
    incomingProps,
    {
      base: {
        url: {},
        filePath: { development_only: true },
        className: {
          deprecated: ({ value, incomingProps, variant }) => {
            const firstPart = variant.split("-")[0];
            if (firstPart === "photo") {
              mergeClassName(incomingProps.containerLayer, value);
            } else if (firstPart === "symbol") {
              mergeClassName(incomingProps.symbolLayer, value);
            } else {
              console.warn("No method to handle className:", value);
            }
          },
        },
        style: {
          deprecated: ({ value, incomingProps, variant }) => {
            const firstPart = variant.split("-")[0];
            if (firstPart === "photo") {
              mergeStyle(incomingProps.containerLayer, value);
            } else if (firstPart === "symbol") {
              mergeStyle(incomingProps.symbolLayer, value);
            } else {
              console.warn("No method to handle style:", value);
            }
          },
        },
        type: { deprecated: true },
        systemName: {},
      },
      "photo-default": {
        url: { required: true },
      },
      "photo-square": {
        url: { required: true },
      },
      symbol: { systemName: { required: true } },
    },
    variant
  );

  if (variant.split("-")[0] === "photo" && !core.url && !core.filePath) {
    console.warn("Missing required props: url or filePath");
  }

  const layers = processLayerProps(incomingProps, [
    "container",
    "img",
    "symbol",
  ]);

  if (variant.split("-")[0] === "symbol") {
    return renderSymbol(variant, core, layers);
  }

  return renderPhoto(variant, core, layers);
}

function renderPhoto(variant, corePorps, layers = {}) {
  const { url, filePath } = corePorps;
  const variantPrefix = "photo";

  let src = url;
  if (filePath) {
    src = filePath;
  }

  switch (variant) {
    case `${variantPrefix}-square`: {
      const customizeClass = layers.container?.className || "";
      const { className, ...otherPorps } = layers.container;
      return (
        <div
          className={`${styles.squareContainer} ${customizeClass}`}
          {...otherPorps}
        >
          <img src={src} {...layers.img} />
        </div>
      );
    }

    case `${variantPrefix}-default`:
      return <img src={src} {...layers.img} />;

    default:
      console.warn(`Unknown variant: ${variant}`);
  }
}

function renderSymbol(variant, corePorps, layers = {}) {
  const { systemName } = corePorps;
  const SVG = symbolMap[systemName];
  const customizeClass = layers.symbol?.className || "";
  const { className, ...otherPorps } = layers.container;

  if (!SVG) {
    console.warn(`⛔ Image "${systemName}" not found.`);
    return (
      <span className={`${styles.default} ${customizeClass}`} {...otherPorps} />
    );
  }

  return (
    <SVG className={`${styles.default} ${customizeClass}`} {...otherPorps} />
  );
}
