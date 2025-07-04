import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),
    svgr({
      include: ["**/*.svg?component"], // recognise your suffix
      // force “named export” mode
      exportAsDefault: false,
      svgrOptions: {
        exportType: "named",
        namedExport: "ReactComponent", // same alias your code expects
      },
    }),
  ],
  build: {
    lib: {
      entry: "src/index.js", // barrel file
      name: "CUI", // UMD global (optional)
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format}.js`,
      cssFileName: "cui",
    },
    rollupOptions: {
      external: ["react", "react-dom"], // keep peer deps out of bundle
    },
  },
});
