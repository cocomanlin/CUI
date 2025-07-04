# CUI

CUI is a collection of React components used across many projects. It aims to provide a consistent look and feel while adhering closely to Apple’s Human Interface Guidelines (HIG).

## Design principles

- Components mimic native Apple platforms and follow Apple HIG.
- Simple styles with minimal configuration.
- Icons and fonts ship with the library for a seamless out‑of‑the‑box experience.

## Development

The following npm scripts are available:

- `npm run dev` – start Vite in development mode.
- `npm run build` – build the library for distribution.
- `npm run storybook` – open the Storybook environment.
- `npm run build-storybook` – produce a static Storybook build.
- `npm run lint` – run ESLint on the project.

## VS Code tasks

A "Developer Mode" task is provided under `.vscode/tasks.json`. It runs both the build watcher and Storybook in parallel:

```
"Developer Mode": {
  "dependsOn": ["Run build", "Run Storybook"],
  "dependsOrder": "parallel"
}
```

Run this task to automatically rebuild the package and refresh Storybook whenever files change.

## Components

The repository currently includes the following components:

- VStack
- Image

## Fonts

CUI bundles the [Noto Sans](https://fonts.google.com/noto/specimen/Noto+Sans) variable font. The font CSS is imported automatically from the library entry point, so no extra setup is required.

## Adding new components

Run the interactive helper to scaffold a new component capsule:

```bash
python scripts/new_component.py
```

This asks for the component name and creates `src/<Name>/<Name>.jsx`,
`src/<Name>/<Name>.module.css`, and `src/<Name>/index.js`.
After implementing your component, update the public barrel and Storybook
story by running:

```bash
python scripts/generate_export.py
```
