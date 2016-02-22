# vile-coverage [![Circle CI](https://circleci.com/gh/brentlintner/vile-coverage.svg?style=svg&circle-token=99e11e5fda6649fe9d8ee644b3d1e1337322a5d6)](https://circleci.com/gh/brentlintner/vile-coverage)

[![score-badge](http://joffrey-baratheon.herokuapp.com/brentlintner/vile-coverage/badges/score?token=-1hqvssNyv6oFhXvWMy7)](http://joffrey-baratheon.herokuapp.com/brentlintner/vile-coverage) [![security-badge](http://joffrey-baratheon.herokuapp.com/brentlintner/vile-coverage/badges/security?token=-1hqvssNyv6oFhXvWMy7)](http://joffrey-baratheon.herokuapp.com/brentlintner/vile-coverage) [![coverage-badge](http://joffrey-baratheon.herokuapp.com/brentlintner/vile-coverage/badges/coverage?token=-1hqvssNyv6oFhXvWMy7)](http://joffrey-baratheon.herokuapp.com/brentlintner/vile-coverage) [![dependency-badge](http://joffrey-baratheon.herokuapp.com/brentlintner/vile-coverage/badges/dependency?token=-1hqvssNyv6oFhXvWMy7)](http://joffrey-baratheon.herokuapp.com/brentlintner/vile-coverage)

A [vile](http://vile.io) plugin for tracking your project's test coverage.

## Supported Formats

* lcov

## Requirements

- [nodejs](http://nodejs.org)
- [npm](http://npmjs.org)

## Installation

    npm i vile-coverage

## Specify Data

```yml
coverage:
  config:
    path: path/to/data.lcov
```

## Licensing

This project is licensed under the [MPL](https://www.mozilla.org/MPL/2.0) license.

Any contributions made to this project are made under the current license.

## Hacking

    cd vile-coverage
    npm install
    npm test

To run compile task with file watch in the background:

    npm run dev

To run tests with coverage:

    npm run test-cov

See `package.json` for other available scripts.

## Versioning

This project ascribes to [semantic versioning](http://semver.org).

## Contributions

Current list of [Contributors]().

Any contributions are welcome and appreciated!

All you need to do is submit a [Pull Request]().

1. Please consider tests and code quality before submitting.
2. Please try to keep commits clean, atomic and well explained (for others).

### Issues

Current issue tracker is on [GitHub]().

Even if you are uncomfortable with code, an issue or question is welcome.

### Code Of Conduct

This project ascribes to CoralineAda's [Contributor Covenant](https://github.com/CoralineAda/contributor_covenant).

### Maintainers

- Brent Lintner - [@brentlintner](http://github.com/brentlintner)

## Architecture

- `src` is es6+ syntax compiled with [Babel](https://babeljs.io)
- `lib` generated js library
- `test` is any test code, written in [CoffeeScript](http://coffeescript.org)
- `.test` where coffeescript is generated to
