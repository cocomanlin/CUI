import React from "react";
import styles from "./Text.module.css";
import {
  processVariantProps,
  processCoreProps,
  processLayerProps,
} from "../utils/propHelpers.js";
import { mergeClassName, mergeStyle } from "../utils/marge.js";

const ALLOWED_TAGS = ["p", "h1", "h2", "h3", "h4", "h5", "h6"];

export default function Text(incomingProps) {
  let variant = processVariantProps(incomingProps, ALLOWED_TAGS);

  const core = processCoreProps(
    incomingProps,
    {
      base: {
        text: { required: true, type: "string" },
        content: {},
        className: {
          deprecated: ({ value, incomingProps }) => {
            mergeClassName(incomingProps.textLayer, value);
          },
        },
        style: {
          deprecated: ({ value, incomingProps }) => {
            mergeStyle(incomingProps.textLayer, value);
          },
        },
      },
    },
    variant
  );

  if (core.content) {
    console.warn("content porps is deprecated please using text porps");
    if (!core.text) core.text = core.content;
  }


  if (core.type) {
    console.warn("type porp is deprecated please using variant porp");
    variant = core.type;
  }

  const layers = processLayerProps(incomingProps, ["text"]);

  if (!ALLOWED_TAGS.includes(variant)) {
    console.warn(
      `Invalid HTML tag: "${variant}". Allowed tags are: ${ALLOWED_TAGS.join(
        ", "
      )}`
    );
    return null;
  }

  const customizeClass = layers.text?.className || "";
  const { className, ...otherPorps } = layers.text || {};

  const Tag = variant;

  return (
    <Tag className={`${styles.default} ${customizeClass}`} {...otherPorps}>
      {core.text}
    </Tag>
  );
}
