let path = require("path")
let Promise = require("bluebird")
let lcov_parse = require("lcov-parse")
let _ = require("lodash")
let vile = require("@brentlintner/vile")

let relative_path = (file) =>
  path.normalize(file)
    .replace(process.cwd(), "")
    .replace(/^\.?\//, "")

let total_cov = (lines) =>
  !lines ? 0 :
  lines.length <= 0 ? 100 :
  (_.reduce(lines, (count, item) => {
    return item.hit > 0 ? count + 1 : count
  }, 0) / lines.length) * 100

let into_issues = (lcov) =>
  _.map(lcov, (item) =>
    vile.issue(
      vile.COV,
      relative_path(item.file),
      undefined,
      undefined,
      undefined, {
        coverage: {
          total: Number(total_cov(
            _.get(item, "lines.details")
          ).toFixed(2))
        }
      }
    )
  )

let report_cov = (plugin_config) =>
  new Promise((resolve, reject) => {
    let log = vile.logger.create("coverage")
    let lcov_path = _.get(plugin_config, "config.path")

    if (lcov_path) {
      lcov_parse(lcov_path, (err, lcov) => {
        if (err) log.error(err), resolve([])
        else resolve(into_issues(lcov))
      })
    } else {
      log.error("no lcov path provided!")
      resolve([])
    }
  })

module.exports = {
  punish: report_cov
}
