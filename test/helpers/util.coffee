fixture = (name) -> require "./../fixtures/#{name}"

[
  "single_issues"
  "multiple_issues"
  "multiple_issues_without_top"
  "empty_issues"
].forEach (name) ->
  module.exports[name] = fixture name
