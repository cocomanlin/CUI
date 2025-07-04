export function processVariantProps(incomingProps = {}, validVariants = []) {
  const variant = incomingProps.variant;
  if (!variant) {
    console.warn("Missing variant prop");
    return null;
  }
  if (!validVariants.includes(variant)) {
    console.warn(
      `Invalid variant "${variant}". Allowed variants: ${validVariants.join(
        ", "
      )}`
    );
  }
  return variant;
}

export function processCoreProps(
  incomingProps = {},
  variantConfigs = {},
  variant = "base"
) {
  const baseConfig = variantConfigs.base || {};
  const variantConfig = variantConfigs[variant] || {};

  const mergedConfig = { ...baseConfig };
  Object.keys(variantConfig).forEach((key) => {
    mergedConfig[key] = { ...(baseConfig[key] || {}), ...variantConfig[key] };
  });

  const result = {};

  Object.keys(mergedConfig).forEach((key) => {
    const {
      default: def,
      required = false,
      development_only = false,
      deprecated = false,
      type,
    } = mergedConfig[key];

    let value = incomingProps[key];

    if (value === undefined || value === "") {
      if (def !== undefined) {
        value = def;
      }
    }

    if (value !== undefined && value !== '' && type) {
      const actual = Array.isArray(value) ? 'array' : typeof value;
      if (actual !== type) {
        console.warn(
          `Prop "${key}" expected type "${type}" but got "${actual}"`
        );
      }
    }

    if ((value === undefined || value === '') && required) {
      console.warn(`Missing required prop: ${key}`);
    }

    if (development_only && value !== undefined && value !== "") {
      console.warn(`Prop "${key}" is for development only`);
    }

    if (deprecated && value !== undefined && value !== '') {
      console.warn(`Prop "${key}" is deprecated`);
      if (typeof deprecated === 'function') {
        try {
          deprecated({ value, incomingProps, result, variant });
        } catch (err) {
          console.error(`Error in deprecated handler for prop "${key}":`, err);
        }
      }
    }

    if (value !== undefined && value !== '') {

      result[key] = value;
    }
  });

  Object.keys(incomingProps).forEach((key) => {
    if (key === "variant") return;
    if (key.endsWith("Layer")) return;
    if (mergedConfig[key]) return;
    console.warn(`Prop "${key}" will not be processed`);
  });

  return result;
}

export function processLayerProps(incomingProps = {}, layerNames = []) {
  const layers = {};
  Object.keys(incomingProps).forEach((key) => {
    if (!key.endsWith("Layer")) return;
    const name = key.slice(0, -5);
    if (!layerNames.includes(name)) {
      console.warn(`Unknown layer: ${name}`);
      return;
    }
    layers[name] = incomingProps[key];
  });
  return layers;
}

export function processComponentProps() {
  console.warn("This function is deprecated");
}

export function extractLayerProps() {
  console.warn("This function is deprecated");
}
