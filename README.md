# vile-coverage [![Circle CI](https://circleci.com/gh/forthright/vile-coverage.svg?style=shield&circle-token=99e11e5fda6649fe9d8ee644b3d1e1337322a5d6)](https://circleci.com/gh/forthright/vile-coverage) [![Build status](https://ci.appveyor.com/api/projects/status/vivh8lh9uvdvry00/branch/master?svg=true)](https://ci.appveyor.com/project/brentlintner/vile-coverage/branch/master) [![score-badge](https://vile.io/api/v0/projects/vile-coverage/badges/score?token=USryyHar5xQs7cBjNUdZ)](https://vile.io/~brentlintner/vile-coverage) [![security-badge](https://vile.io/api/v0/projects/vile-coverage/badges/security?token=USryyHar5xQs7cBjNUdZ)](https://vile.io/~brentlintner/vile-coverage) [![coverage-badge](https://vile.io/api/v0/projects/vile-coverage/badges/coverage?token=USryyHar5xQs7cBjNUdZ)](https://vile.io/~brentlintner/vile-coverage) [![dependency-badge](https://vile.io/api/v0/projects/vile-coverage/badges/dependency?token=USryyHar5xQs7cBjNUdZ)](https://vile.io/~brentlintner/vile-coverage)

A [vile](https://vile.io) plugin for tracking your project's test coverage.

## Supported Formats

* lcov

## Requirements

- [nodejs](http://nodejs.org)
- [npm](http://npmjs.org)

## Installation

    npm i -D vile vile-coverage

## Specify Data

```yaml
coverage:
  config:
    path: path/to/data.lcov
```

## Versioning

This project ascribes to [semantic versioning](http://semver.org).

## Licensing

This project is licensed under the [MPL-2.0](LICENSE) license.

Any contributions made to this project are made under the current license.

## Contributions

Current list of [Contributors](https://github.com/forthright/vile-coverage/graphs/contributors).

Any contributions are welcome and appreciated!

All you need to do is submit a [Pull Request](https://github.com/forthright/vile-coverage/pulls).

1. Please consider tests and code quality before submitting.
2. Please try to keep commits clean, atomic and well explained (for others).

### Issues

Current issue tracker is on [GitHub](https://github.com/forthright/vile-coverage/issues).

Even if you are uncomfortable with code, an issue or question is welcome.

### Code Of Conduct

This project ascribes to [contributor-covenant.org](http://contributor-covenant.org).

By participating in this project you agree to our [Code of Conduct](CODE_OF_CONDUCT.md).

### Maintainers

- Brent Lintner - [@brentlintner](http://github.com/brentlintner)

## Architecture

- `src` is es6+ syntax compiled with [Babel](https://babeljs.io)
- `lib` generated js library
- `test` is any test code, written in [CoffeeScript](http://coffeescript.org)
- `.test` where coffeescript is generated to

## Hacking

    cd vile-coverage
    npm install
    npm test

To run compile task with file watch in the background:

    npm run dev

To run tests with coverage:

    npm run test-cov

See `package.json` for other available scripts.
