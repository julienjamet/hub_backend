### Welcome to the `backend section` of the Hub !

This is a [Node](https://nodejs.org) application built with [Express](https://expressjs.com) and [TypeScript](https://www.typescriptlang.org).

It uses strict linting rules to ensure a fast, modern, and maintainable development experience.

It connects to a [MongoDB](https://www.mongodb.com) database using [Mongoose](https://www.npmjs.com/package/mongoose), with modular connections for scalable domain-based data access.

---

### 🛠️ Install dependencies

```bash
npm i
```

---

### 🌍 Environment configuration

The app uses [dotenv](https://www.npmjs.com/package/dotenv) to load environment variables.

⚠️ Before proceeding, make sure to create a `.env` file by copying the [.env.example](./.env.example) file.

---

### 🔐 Security

This project includes basic security middlewares, configured dynamically via the `NODE_ENV` environment variable :

- [CORS](https://developer.mozilla.org/fr/docs/Web/HTTP/Guides/CORS)

    - `development` → allows all origins ( `*` )

    - `preproduction` / `production` → allows only origins defined in the `.env` file

- [Helmet](https://helmetjs.github.io)

    - `development` → disabled

    - `preproduction` / `production` → activated in strict mode ( see [configuration](./src/methods/methods.ts) )

---

### 🛢️ Database ( MongoDB + Mongoose )

The app connects to a `MongoDB` database using `Mongoose`'s `createConnection` method.

The connection is abstracted through the [connectToDatabase](./src/methods/methods.ts) method and configured via environment variables, allowing the project to support multiple database connections.

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

### 🐳 Docker

The project supports [Docker](https://www.docker.com) builds for production deployment.

#### 🏗️ Build the Docker image

```bash
docker build -t your-image-name .
```

Builds the app with `Node`.

#### 🚀 Serve with Docker

```bash
docker run -p 8080:8080 your-image-name
```

#### 🏷️ Docker Hub

You can find all versions of my `Docker` image on [Docker Hub](https://hub.docker.com/r/julienjamet1992/hub_backend).

![Docker Image Version](https://img.shields.io/docker/v/julienjamet1992/hub_backend?sort=semver)

---

### 🔵 TypeScript

`TypeScript` is configured in strict mode, targeting modern ECMAScript.

---

### ⏩ Release process

The [`release.sh`](./release.sh) script automates :

- Auditing

- Linting

- Building

- Creating and pushing ( optional ) a `Docker` image

- Tagging the release commit

---

### 🧭 Routing

The following routes are available :

- `Hub`

  - `GET` [/page_header/:location](./src/routes/hub/get_routes/get_routes.ts) : returns the page header matching the provided location

  - `GET` [/projects/:category](./src/routes/hub/get_routes/get_routes.ts) : returns all projects matching the provided category

- `Pokedex`

  - `POST` [/trainers/signup](./src/routes/pokemon/post_routes/post_routes.ts) : creates a trainer account

  - `POST` [/trainers/login](./src/routes/pokemon/post_routes/post_routes.ts) : logs in

  - `POST` [/pokemon](./src/routes/pokemon/post_routes/post_routes.ts) : catches a Pokemon

  - `GET` [/pokemon](./src/routes/pokemon/get_routes/get_routes.ts) : returns all Pokemon

  - `GET` [/pokemon/:id](./src/routes/pokemon/get_routes/get_routes.ts) : returns one Pokemon

  - `PUT` [/pokemon/:id](./src/routes/pokemon/put_routes/put_routes.ts) : makes a Pokemon evolve

  - `DELETE` [/pokemon/:id](./src/routes/pokemon/delete_routes/delete_routes.ts) : deletes a Pokemon