# GeNYG Native - React Native Expo Yeoman Generator

Yeoman generator for scaffolding React Native (Expo) projects with Expo Router, NativeWind, Redux Toolkit + Sagas, TanStack Form, and i18next.

## Installation

Make sure you have `yeoman` installed globally:

```bash
npm i -g yo
npm i -g @thegrinch00/generator-g-native
```

## Usage

Use the `g-native` CLI shortcut:

```bash
g-native <subcommand>
```

## Commands

### Bootstrap

| Command | Description |
|---------|-------------|
| `g-native app` | Creates a new Expo app using `create-expo-app` with blank TypeScript template |
| `g-native pkg-core` | Installs core dev tools: ESLint, Prettier, Husky, Jest, Zod, React Query, Axios |
| `g-native pkg-ui` | Installs NativeWind (Tailwind CSS for React Native) and configures it |
| `g-native pkg-redux` | Installs Redux Toolkit, Redux Saga, Redux Persist, and scaffolds the store |
| `g-native pkg-translations` | Installs i18next with expo-localization and sets up translation files (en/it) |

### Generators

| Command | Description |
|---------|-------------|
| `g-native comp` | Creates a new component with hooks file under `src/components/` |
| `g-native page` | Creates an Expo Router screen with optional `_layout.tsx` under `app/` |
| `g-native form` | Creates a form component with TanStack Form + Zod validation |
| `g-native model` | Creates a TypeScript model (interface + class) under `src/models/` |
| `g-native slice` | Creates a Redux slice with interfaces, selectors, and optional sagas |
| `g-native version` | Displays the current generator version |

## Recommended Setup Order

1. `g-native app` - Create the Expo project
2. `g-native pkg-core` - Install core development tools
3. `g-native pkg-ui` - Set up NativeWind
4. `g-native pkg-redux` - Set up Redux store
5. `g-native pkg-translations` - Set up i18n (optional)
6. Start generating components, pages, forms, models, and slices as needed
