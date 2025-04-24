# FP3

This is a [React Router](https://reactrouter.com/) project that uses [Lingui](https://lingui.dev/) for internationalization and [PandaCSS](https://panda-css.com/) for styling.

Panda and Lingui leverage modern build tooling to manage CSS and translations files, automatically removing unused styles and translations to prevent bloat.  

Visit the [Translate your React Router app with Lingui](https://www.simondepelchin.be/articles/translate-your-remix-run-app-with-lingui) article to read more about the integration.

React Router v7 has replace Remix but their [Technical explanation](https://remix.run/docs/en/main/discussion/introduction#introduction-technical-explanation) is still accurate and interesting.
This is [a great video](https://www.youtube.com/watch?v=waI5CDisiuM) demonstrating how to build with React Router.
📖 Also see the [React Router Framework Mode Documentation](https://reactrouter.com/start/framework/installation).

## Development

Run the Vite dev server:

```sh
npm run dev
```

To run the tests:

```sh
npm t
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`

## TODO

* Use [Panda's Theme](https://panda-css.com/docs/theming/tokens): make sure branding/colors and stuff like spacing & breakpoints are all being pulled from the theme. Check out the [theme generator](https://pandacss-theme-generator.vercel.app/colors).
* Use [Radix UI](https://www.radix-ui.com/primitives/docs/components/form). Use `<RadixForm asChild><ReactRouterForm>...</ReactRouterForm></RadixForm>` to get an accessible version of a React Router form.
* Enable [ViTest test coverage](https://vitest.dev/guide/coverage.html): Make sure test coverage is visible. 80% coverage is generally considered a reasonable goal. 
* Add more tests: [RRv7 docs](https://reactrouter.com/start/framework/testing)and home page test is a reference. Add meaningful tests for switching language & filling out forms.
* Switch to Deno: Doing so has a number of [security benefits](https://docs.deno.com/runtime/fundamentals/security/) and we can use their official [distroless](https://hub.docker.com/layers/denoland/deno/distroless/images/sha256-8da07681b361cd4bcd1b73d153e8129e4c1f67ba8e8177cb52d7af7725289af3) image and enable [OpenTelemetry](https://docs.deno.com/runtime/fundamentals/open_telemetry/) later.
* Mobile first: CSS should be configured with mobile device measurements first: layouts should scale up, rather than trying to scale down.
* Use [podman-compose](https://docs.podman.io/en/latest/markdown/podman-compose.1.html) for dev (for now): being able to bring up a local dev environment is important. Kubernetes to come later.
