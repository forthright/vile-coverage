mimus = require "mimus"
newline = require "./../lib"
sinon = require "sinon"
chai = require "./helpers/sinon_chai"
util = require "./helpers/util"
cov = mimus.require "../lib", __dirname, []
expect = chai.expect
lcov_parse = mimus.stub()
lcov_path = "some/path/to/info.lcov"
vile = mimus.get cov, "vile"

describe "vile-coverage", ->
  after mimus.restore
  afterEach mimus.reset

  before ->
    mimus.set cov, "lcov_parse", lcov_parse

  describe "an example lcov file", ->
    log = error: mimus.stub()

    before ->
      mimus
        .stub vile.logger, "create"
        .returns log

    describe "when no config is given", ->
      it "resolves with an empty array", ->
        cov
          .punish()
          .should.eventually.become []

      it "logs an error to the console", (done) ->
        cov
          .punish()
          .should.eventually.be.fulfilled.notify ->
            setTimeout ->
              log.error.should.have.been.calledWith(
                "no lcov path provided!"
              )
              done()

    describe "when no config path is given", ->
      it "resolves with an empty array", ->
        cov
          .punish config: {}
          .should.eventually.become []

      it "logs an error to the console", (done) ->
        cov
          .punish config: {}
          .should.eventually.be.fulfilled.notify ->
            setTimeout ->
              log.error.should.have.been.calledWith(
                "no lcov path provided!"
              )
              done()

    describe "when there is an lcov parse err", ->
      error = undefined

      beforeEach ->
        error = mimus.stub()
        lcov_parse.callsArgWith 1, error, undefined

      it "resolves with an empty array", ->
        cov
          .punish config: path: lcov_path
          .should.eventually.become []

      it "logs an error to console", (done) ->
        cov
          .punish config: path: lcov_path
          .should.eventually.be.fulfilled.notify ->
            setTimeout ->
              log.error.should.have.been.calledWith error
              done()

    describe "when file exists", ->
      beforeEach ->
        lcov_parse.callsArgWith 1, undefined, util.parsed_lcov
        mimus.stub process, "cwd"
        process.cwd.returns "/process/cwd"

      it "generates the appropriate issues", ->
        cov
          .punish config: path: lcov_path
          .should.become util.coverage_issues
