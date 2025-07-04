import { mergeConfig } from "vite";
import svgr from "vite-plugin-svgr";

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@chromatic-com/storybook",
    "@storybook/experimental-addon-test",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  // eslint-disable-next-line no-unused-vars
  viteFinal: async (config, { configType }) => {
    return mergeConfig(config, {
      plugins: [svgr()],
    });
  },
};
export default config;
