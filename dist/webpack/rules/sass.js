'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var getCssLoaders = function getCssLoaders(config) {
  return [{ loader: 'style-loader' }, {
    loader: 'css-loader',
    options: {
      sourceMap: config.ENV_DEVELOPMENT,
      // modules: true,
      // import: true,
      importLoaders: 1
    }
  }, {
    loader: 'postcss-loader',
    options: {
      sourceMap: config.ENV_DEVELOPMENT ? 'inline' : false
    }
  }];
};

var setup = function setup(config, webpackConf) {
  var cssLoaders = getCssLoaders(config);
  var sassLoaderOptions = {
    sourceMap: config.ENV_DEVELOPMENT,
    includePaths: [config.dir.css]
  };
  var sassLoaders = cssLoaders.concat([{
    loader: 'sass-loader',
    options: sassLoaderOptions
  }]);
  var extractSass = new _extractTextWebpackPlugin2.default({
    filename: 'css/[name].[contenthash].css',
    disable: config.ENV_DEVELOPMENT
  });
  var extractSassLoader = extractSass.extract({
    fallbackLoader: 'style-loader',
    loader: [].concat(_toConsumableArray(cssLoaders.slice(1)), [{
      loader: 'sass-loader',
      options: _extends({}, sassLoaderOptions, {
        outputStyle: 'compressed',
        precision: 10,
        sourceComments: false
      })
    }])
  });

  webpackConf.module.rules.push({
    test: /\.scss$/,
    // Note: using 'loader' vs 'use' as workaround for 'unexpected character' error
    // TODO: test if upgraded modules now allows for use of rules instead of loader
    loader: config.ENV_DEVELOPMENT ? sassLoaders : extractSassLoader
  });

  if (config.ENV_PRODUCTION) {
    webpackConf.plugins.push(extractSass);
  }

  return webpackConf;
};

exports.default = setup;
exports.setup = setup;