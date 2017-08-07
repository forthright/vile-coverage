"use strict";

var fs = require("fs");
var Promise = require("bluebird");
var lcov_parse = require("lcov-parse");
var _ = require("lodash");
var vile = require("vile");
var fs_stat = Promise.promisify(fs.stat);

var log = vile.logger.create("coverage");

var DEFAULT_COV_DIR = "coverage";

var total_cov = function total_cov(lines) {
  return _.isEmpty(lines) ? 0 : _.reduce(lines, function (count, item) {
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
      if (err) log.warn(err);
      resolve(lcov_into_issues(lcov));
    });
  });
};

var warn_and_resolve = function warn_and_resolve(lcov_path) {
  log.warn("can't find path: \"" + lcov_path + "\"");
  return Promise.resolve([]);
};

var detect_lcov_into_issues = function detect_lcov_into_issues() {
  var dirpath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_COV_DIR;
  return fs.existsSync(dirpath) ? vile.promise_each(dirpath, function (target, is_dir) {
    return is_dir || possible_lcov_file(target);
  }, function (file) {
    return parse_lcov_file_into_issues(file);
  }, { read_data: false }) : warn_and_resolve(dirpath);
};

var lcov_paths_into_issues = function lcov_paths_into_issues(lcov_path) {
  return fs.existsSync(lcov_path) ? fs_stat(lcov_path).then(function (stats) {
    return stats.isDirectory() ? detect_lcov_into_issues(lcov_path) : parse_lcov_file_into_issues(lcov_path);
  }) : warn_and_resolve(lcov_path);
};

var report_cov = function report_cov(plugin_config) {
  var lcov_paths = _.get(plugin_config, "config.paths");

  return (_.isEmpty(lcov_paths) ? detect_lcov_into_issues() : Promise.map(_.concat([], lcov_paths), lcov_paths_into_issues)).then(function (issues) {
    var flat_issues = _.flatten(issues);
    if (_.isEmpty(flat_issues)) {
      log.warn("no coverage data was found");
    }
    return flat_issues;
  });
};

module.exports = {
  punish: report_cov
};