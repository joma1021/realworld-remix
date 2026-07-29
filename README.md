# ![RealWorld Example App](logo.png)

> ### [React Router](https://reactrouter.com/) codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API.

### [Demo](https://realworld-remix.vercel.app/)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)

This codebase was created to demonstrate a frontend application built with [React Router](https://reactrouter.com/) (formerly Remix) including CRUD operations, authentication, routing, pagination, and more.

For more information on how this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.

# Getting started

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Make sure to deploy the output of `react-router build`:

- `build/client/`
- `build/server/`

## Vercel

This app is configured for Vercel via `@vercel/react-router` and `vercel.json` (`framework: "react-router"`).

If an existing Vercel project was previously set to the **Remix** framework preset, change it to **React Router** (or leave detection to `vercel.json`) and redeploy.
