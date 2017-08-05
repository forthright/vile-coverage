"use strict";

var Promise = require("bluebird");
var lcov_parse = require("lcov-parse");
var _ = require("lodash");
var vile = require("vile");

var DEFAULT_COV_DIR = "coverage";

var total_cov = function total_cov(lines) {
  return !lines ? 0 : lines.length <= 0 ? 100 : _.reduce(lines, function (count, item) {
    return item.hit > 0 ? count + 1 : count;
  }, 0) / lines.length * 100;
};

var lcov_into_issues = function lcov_into_issues(lcov) {
  return _.map(lcov, function (item) {
    var total = Number(total_cov(_.get(item, "lines.details")).toFixed(2));

    return vile.issue({
      type: vile.COV,
      path: _.get(item, "file", ""),
      message: "Total coverage is " + total + "%.",
      signature: "coverage::" + total,
      coverage: { total: total }
    });
  });
};

var possible_lcov_file = function possible_lcov_file(target) {
  return (/\.(info|lcov)$/i.test(target)
  );
};

var parse_lcov_file_into_issues = function parse_lcov_file_into_issues(lcov_path) {
  return new Promise(function (resolve, reject) {
    lcov_parse(lcov_path, function (err, lcov) {
      if (err) reject(err);else resolve(lcov_into_issues(lcov));
    });
  });
};

var detect_lcov_into_issues = function detect_lcov_into_issues() {
  return vile.promise_each(DEFAULT_COV_DIR, function (target, is_dir) {
    return is_dir || possible_lcov_file(target);
  }, function (file) {
    return parse_lcov_file_into_issue(file);
  }, { read_data: false });
};

var report_cov = function report_cov(plugin_config) {
  var lcov_paths = _.get(plugin_config, "config.path");

  if (_.isEmpty(lcov_paths)) {
    return detect_lcov_into_issues();
  } else {
    return Promise.map(_.concat([], lcov_paths), function (lcov_path) {
      return detect_lcov_into_issues(lcov_path);
    });
  }
};

module.exports = {
  punish: report_cov
};