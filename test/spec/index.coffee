path = require "path"
mimus = require "mimus"
sinon = require "sinon"
chai = require "./../helpers/sinon_chai"
util = require "./../helpers/util"
cov = mimus.require "../../lib", __dirname
expect = chai.expect
log = mimus.get cov, "log"

CWD = process.cwd()
SINGLE_FILE_TEST_DIR = path
  .join "test", "fixtures", "single"
MULTIPLE_FILE_TEST_DIR = path
  .join "test", "fixtures", "multiple"
EMPTY_FILE_TEST_DIR = path
  .join "test", "fixtures", "empty"
BAD_FILE_DATA_TEST_DIR = path
  .join "test", "fixtures", "bad_file_data"
NO_FILE_TEST_DIR = path
  .join "test", "fixtures", "no_file"
NO_DIR_TEST_DIR = path
  .join "test", "fixtures", "no_dir"

describe "vile-coverage", ->
  before ->
    mimus.stub log, "warn"

  after mimus.restore

  afterEach ->
    process.chdir CWD
    mimus.reset()

  describe "manual paths", ->
    beforeEach ->
      process.chdir MULTIPLE_FILE_TEST_DIR

    describe "with a different dir than coverage", ->
      it "does not pickup any data", ->
        cov.punish(config: paths: "foobar")
          .should.eventually.eql []

    describe "with specific dir paths", ->
      paths = [ "coverage/1", "coverage/2" ]

      it "resolves into expected issues", ->
        cov.punish(config: paths: paths).should
          .eventually.eql util.multiple_issues_without_top

    describe "with specific file and dir path", ->
      paths = [
        "coverage/1",
        "coverage/2/example.info"
      ]

      it "does not pickup any data", ->
        cov.punish(config: paths: paths).should
          .eventually.eql util.multiple_issues_without_top

    describe "with specific file paths", ->
      paths = [
        "coverage/1/example.lcov",
        "coverage/2/example.info"
      ]

      it "does not pickup any data", ->
        cov.punish(config: paths: paths).should
          .eventually.eql util.multiple_issues_without_top

    describe "with nested non-existing dir", ->
      conf = config: paths: "coverage/3000"

      it "does not pickup any data", ->
        cov.punish(conf)
          .should.eventually.eql []

      it "logs a warning about it", (done) ->
        cov.punish(conf).should.be.fulfilled.notify ->
          process.nextTick ->
            log.warn.should.have.been
              .calledWith "can't find path: \"coverage/3000\""
            done()
        return

    describe "with a file inside a dir that does not exist", ->
      conf = config: paths: "coverage/file.lcov"

      it "does not pickup any data", ->
        cov.punish(conf)
          .should.eventually.eql []

      it "logs a warning about it", (done) ->
        cov.punish(conf).should.be.fulfilled.notify ->
          process.nextTick ->
            log.warn.should.have.been
              .calledWith "can't find path: \"coverage/file.lcov\""
            done()
        return

    describe "with a file that does not exist", ->
      conf = config: paths: "file.lcov"

      it "does not pickup any data", ->
        cov.punish(conf)
          .should.eventually.eql []

      it "logs a warning about it", (done) ->
        cov.punish(conf).should.be.fulfilled.notify ->
          process.nextTick ->
            log.warn.should.have.been
              .calledWith "can't find path: \"file.lcov\""
            done()
        return

  describe "auto detecting", ->
    describe "multiple files", ->
      beforeEach ->
        process.chdir MULTIPLE_FILE_TEST_DIR

      it "resolves into expected issues", ->
        cov.punish().should.eventually
          .eql util.multiple_issues

    describe "empty file data", ->
      beforeEach ->
        process.chdir EMPTY_FILE_TEST_DIR

      it "resolves into an issue with no coverage", ->
        cov.punish().should.eventually
          .eql util.empty_issues

    describe "no dir", ->
      beforeEach ->
        process.chdir NO_DIR_TEST_DIR

      it "resolves into no issues", ->
        cov.punish().should.eventually.eql []

      it "warns about no data found", (done) ->
        cov.punish().should.be.fulfilled.notify ->
          process.nextTick ->
            log.warn.should.have.been
              .calledWith "can't find path: \"coverage\""
            done()
        return

    describe "no files with existing dir", ->
      beforeEach ->
        process.chdir NO_FILE_TEST_DIR

      it "resolves into no issues", ->
        cov.punish().should.eventually.eql []

      it "warns about no data found", (done) ->
        cov.punish().should.be.fulfilled.notify ->
          process.nextTick ->
            log.warn.should.have.been
              .calledWith "no coverage data was found"
            done()
        return

    describe "an invalid lcov file", ->
      beforeEach ->
        process.chdir BAD_FILE_DATA_TEST_DIR

      it "resolves into no issues", ->
        cov.punish().should.eventually.eql []

      it "warns about the error", (done) ->
        cov.punish().should.be.fulfilled.notify ->
          process.nextTick ->
            log.warn.should.have.been
              .calledWith "Failed to parse string"
            done()
        return
