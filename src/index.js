const fs = require("fs")
const Promise = require("bluebird")
const lcov_parse = require("lcov-parse")
const _ = require("lodash")
const vile = require("vile")
const fs_stat = Promise.promisify(fs.stat)

const log = vile.logger.create("coverage")

const DEFAULT_COV_DIR = "coverage"

const total_cov = (lines) =>
  _.isEmpty(lines) ? 0 :
    _.reduce(lines, (count, item) =>
      item.hit > 0 ? count + 1 : count
    , 0) / lines.length * 100

const lcov_into_issues = (lcov) =>
  _.map(lcov, (item) => {
    const total = Number(total_cov(
      _.get(item, "lines.details")
    ).toFixed(2))

    return vile.issue({
      type: vile.COV,
      path: _.get(item, "file", ""),
      message: `Total coverage is ${total}%.`,
      signature: `coverage::${total}`,
      coverage: { total: total }
    })
  })

const possible_lcov_file = (target) =>
  /\.(info|lcov)$/i.test(target)

const parse_lcov_file_into_issues = (lcov_path) =>
  new Promise((resolve, reject) => {
    lcov_parse(lcov_path, (err, lcov) => {
      if (err) log.warn(err)
      resolve(lcov_into_issues(lcov))
    })
  })

const warn_and_resolve = (lcov_path) => {
  log.warn("can't find path: \"" + lcov_path + "\"")
  return Promise.resolve([])
}

const detect_lcov_into_issues = (
  dirpath = DEFAULT_COV_DIR
) =>
  fs.existsSync(dirpath) ?
    vile.promise_each(
      dirpath,
      (target, is_dir) => is_dir || possible_lcov_file(target),
      (file) => parse_lcov_file_into_issues(file),
      { read_data: false }) :
    warn_and_resolve(dirpath)

const lcov_paths_into_issues = (lcov_path) =>
  fs.existsSync(lcov_path) ?
    fs_stat(lcov_path).then((stats) =>
      stats.isDirectory() ?
        detect_lcov_into_issues(lcov_path) :
        parse_lcov_file_into_issues(lcov_path)) :
    warn_and_resolve(lcov_path)

const report_cov = (plugin_config) => {
  const lcov_paths = _.get(plugin_config, "config.paths")

  return(_.isEmpty(lcov_paths) ?
    detect_lcov_into_issues() :
    Promise
      .map(
        _.concat([], lcov_paths),
        lcov_paths_into_issues))
  .then((issues) => {
    const flat_issues = _.flatten(issues)
    if (_.isEmpty(flat_issues)) {
      log.warn("no coverage data was found")
    }
    return flat_issues
  })
}

module.exports = {
  punish: report_cov
}
