### Welcome to the `backend section` of the Hub !

This is a [Node](https://nodejs.org) application built with [Express](https://expressjs.com) and [TypeScript](https://www.typescriptlang.org).

It uses strict linting rules to ensure a fast, modern, and maintainable development experience.

---

### 🛠️ Install dependencies

```bash
npm i
```

---

### 📦 Scripts

| Script          | Description                                       |
|-----------------|-------------------------------------------------- |
| `npm run dev`   | Start the dev server in watch mode ( `nodemon` )  |
| `npm run lint`  | Run [ESLint](https://eslint.org) on project files |
| `npm run build` | Type-check & build for production                 |
| `npm run start` | Run the production build                          |

#### 🚀 Start development server

```bash
npm run dev
```

Runs the app in development mode ( `watch` ).

`TypeScript` files will not be compiled if errors are detected.

#### 🧹 Lint

```bash
npm run lint
```

Runs `ESLint`.

`ESLint` is configured in strict mode ( treating warnings as errors ) for `TypeScript`.

#### 🏗️ Build

```bash
npm run build
```

Runs `TypeScript` build command to create a production build of the app placed in the `dist/` folder.

#### 🟢 Start production build

```bash
npm run start
```

Starts the production build locally by serving the files from the `dist/` folder.

---

### 🔵 TypeScript

`TypeScript` is configured in strict mode, targeting modern ECMAScript.

---

### ⏩ Release process

The [`release.sh`](./release.sh) script automates :

- Auditing

- Linting

- Building

- Tagging the release commit