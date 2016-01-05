"use strict";

var path = require("path");
var Promise = require("bluebird");
var lcov_parse = require("lcov-parse");
var _ = require("lodash");
var vile = require("@brentlintner/vile");

var relative_path = function relative_path(file) {
  return path.normalize(file).replace(process.cwd(), "").replace(/^\.?\//, "");
};

var total_cov = function total_cov(lines) {
  return !lines ? 0 : lines.length <= 0 ? 100 : _.reduce(lines, function (count, item) {
    return item.hit > 0 ? count + 1 : count;
  }, 0) / lines.length * 100;
};

var into_issues = function into_issues(lcov) {
  return _.map(lcov, function (item) {
    return vile.issue(vile.COV, relative_path(item.file), undefined, undefined, undefined, {
      coverage: {
        total: Number(total_cov(_.get(item, "lines.details")).toFixed(2))
      }
    });
  });
};

var report_cov = function report_cov(plugin_config) {
  return new Promise(function (resolve, reject) {
    var log = vile.logger.create("coverage");
    var lcov_path = _.get(plugin_config, "config.path");

    if (lcov_path) {
      lcov_parse(lcov_path, function (err, lcov) {
        if (err) log.error(err), resolve([]);else resolve(into_issues(lcov));
      });
    } else {
      log.error("no lcov path provided!");
      resolve([]);
    }
  });
};

module.exports = {
  punish: report_cov
};