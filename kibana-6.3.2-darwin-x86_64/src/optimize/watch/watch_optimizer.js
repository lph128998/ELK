'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rxjs = require('rxjs');

var _base_optimizer = require('../base_optimizer');

var _base_optimizer2 = _interopRequireDefault(_base_optimizer);

var _bundles_route = require('../bundles_route');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const STATUS = {
  RUNNING: 'optimizer running',
  SUCCESS: 'optimizer completed successfully',
  FAILURE: 'optimizer failed with stats',
  FATAL: 'optimizer failed without stats'
};

class WatchOptimizer extends _base_optimizer2.default {
  constructor(opts) {
    super(opts);

    this.compilerRunStartHandler = (watchingCompiler, cb) => {
      this.status$.next({
        type: STATUS.RUNNING
      });

      cb();
    };

    this.compilerWatchErrorHandler = error => {
      if (error) {
        this.status$.next({
          type: STATUS.FATAL,
          error
        });
      }
    };

    this.compilerDoneHandler = stats => {
      this.initialBuildComplete = true;
      const seconds = parseFloat((stats.endTime - stats.startTime) / 1000).toFixed(2);

      if (stats.hasErrors() || stats.hasWarnings()) {
        this.status$.next({
          type: STATUS.FAILURE,
          seconds,
          error: this.failedStatsToError(stats)
        });
      } else {
        this.status$.next({
          type: STATUS.SUCCESS,
          seconds
        });
      }
    };

    this.onStatusChangeHandler = ({ type, seconds, error }) => {
      switch (type) {
        case STATUS.RUNNING:
          if (!this.initialBuildComplete) {
            this.log(['info', 'optimize'], {
              tmpl: 'Optimization started',
              bundles: this.uiBundles.getIds()
            });
          }
          break;

        case STATUS.SUCCESS:
          this.log(['info', 'optimize'], {
            tmpl: 'Optimization <%= status %> in <%= seconds %> seconds',
            bundles: this.uiBundles.getIds(),
            status: 'success',
            seconds
          });
          break;

        case STATUS.FAILURE:
          // errors during initialization to the server, unlike the rest of the
          // errors produced here. Lets not muddy the console with extra errors
          if (!this.initializing) {
            this.log(['fatal', 'optimize'], {
              tmpl: 'Optimization <%= status %> in <%= seconds %> seconds<%= err %>',
              bundles: this.uiBundles.getIds(),
              status: 'failed',
              seconds,
              err: error
            });
          }
          break;

        case STATUS.FATAL:
          this.log('fatal', error);
          process.exit(1);
          break;
      }
    };

    this.log = opts.log || (() => null);
    this.prebuild = opts.prebuild || false;
    this.status$ = new _rxjs.ReplaySubject(1);
  }

  async init() {
    this.initializing = true;
    this.initialBuildComplete = false;

    // log status changes
    this.status$.subscribe(this.onStatusChangeHandler);

    await this.uiBundles.writeEntryFiles();
    await this.uiBundles.ensureStyleFiles();

    await this.initCompiler();

    this.compiler.plugin('watch-run', this.compilerRunStartHandler);
    this.compiler.plugin('done', this.compilerDoneHandler);
    this.compiler.watch({ aggregateTimeout: 200 }, this.compilerWatchErrorHandler);

    if (this.prebuild) {
      await this.onceBuildOutcome();
    }

    this.initializing = false;
  }

  bindToServer(server, basePath) {
    // pause all requests received while the compiler is running
    // and continue once an outcome is reached (aborting the request
    // with an error if it was a failure).
    server.ext('onRequest', (request, reply) => {
      this.onceBuildOutcome().then(() => reply.continue()).catch(reply);
    });

    server.route((0, _bundles_route.createBundlesRoute)({
      bundlesPath: this.compiler.outputPath,
      basePublicPath: basePath
    }));
  }

  async onceBuildOutcome() {
    return await this.status$.mergeMap(this.mapStatusToOutcomes).take(1).toPromise();
  }

  mapStatusToOutcomes({ type, error }) {
    switch (type) {
      case STATUS.RUNNING:
        return [];

      case STATUS.SUCCESS:
        return [true];

      case STATUS.FAILURE:
      case STATUS.FATAL:
        return _rxjs.Observable.throw(error);
    }
  }

}
exports.default = WatchOptimizer;
module.exports = exports['default'];