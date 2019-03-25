# Contributing

Contributions are always welcome, no matter how large or small. Before contributing, please read the [code of conduct](CODE_OF_CONDUCT.md).

## Setup

1. Ensure your environment is running Node.js 10+
2. Git clone the [`styled-hooks` repository](https://github.com/colingourlay/styled-hooks).
3. From the root of the repository, run `npm i` to install development dependencies.

## Development

You can develop against the example project by running:

```sh
npm start
```

This will create a build of the example project and watch the `src` and `example` directories for code changes, which will trigger a rebuild.

It will also start a live development server on [http://localhost:8080/](http://localhost:8080/), which you can use to view the example app and verify your changes.

## Building

You can build the project by running:

```sh
npm run build
```

The build process uses [`microbundle`](https://github.com/developit/microbundle) to create two artifacts from the `src/styled-hooks.js` entry point:

- `dist/styled-hooks.js` for `require()`-ing with CommonJS
- `dist/styled-hooks.m.js` for `import`-ing as an ECMAScript Module

## Pull Requests

Please submit pull requests to initiate discussions about your contributions, and allow us to merge them!

1. Fork the repo and create your branch from master.
2. If you’ve changed APIs, update the documentation.
3. Make sure your code lints.
4. Push your changes to your own fork.
5. Create your pull request.

## License

By contributing to `styled-hooks`, you agree that your contributions will be licensed under its [Unlicense license](LICENSE).
