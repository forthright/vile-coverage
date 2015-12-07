Promise = require "bluebird"
vile_issues = require "./../fixtures/vile_issues"
example_lcov_parse = require "./../fixtures/example_lcov_parsed"

module.exports =
  coverage_issues: vile_issues
  parsed_lcov: example_lcov_parse
