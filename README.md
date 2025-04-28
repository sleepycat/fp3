# FP3

This project has a few main components that are visible at the top level
* ui: a web application/UI using React Router
* db: rqlite a fault tolerant distributed database

## Development

Most of the development action is going to happen in the `ui` folder for now. Using docker compose will bring up both the app (listing on port 3000) and the database (listing on port 4001):

```sh
docker compose up
```
If you want this to detach from the terminal and run in the background use the `-d` option:

```sh
docker compose up -d
```

## Scripts/Tasks

In every project there are a number of related tasks that need to get automated. This project uses a [Taskfile](https://taskfile.dev/) and the `task` command.
You can list the automations with `task -l`.

## General TODO

* Switch UI to deno: Doing so has a number of [security benefits](https://docs.deno.com/runtime/fundamentals/security/) and we can use their official [distroless](https://hub.docker.com/layers/denoland/deno/distroless/images/sha256-8da07681b361cd4bcd1b73d153e8129e4c1f67ba8e8177cb52d7af7725289af3) image and enable [OpenTelemetry](https://docs.deno.com/runtime/fundamentals/open_telemetry/) later.
* Adopt [podman-compose](https://docs.podman.io/en/latest/markdown/podman-compose.1.html) for dev: being able to bring up a local dev environment is important. Kubernetes to come later.
