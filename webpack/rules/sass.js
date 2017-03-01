import ExtractTextPlugin from 'extract-text-webpack-plugin';

const getCssLoaders = config =>
  [
    { loader: 'style-loader' },
    {
      loader: 'css-loader',
      options: {
        sourceMap: config.ENV_DEVELOPMENT,
        // modules: true,
        // import: true,
        importLoaders: 1,
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: config.ENV_DEVELOPMENT ? 'inline' : false,
      },
    },
  ];

const setup = (config, webpackConf) => {
  const cssLoaders = getCssLoaders(config);
  const sassLoaderOptions = {
    sourceMap: config.ENV_DEVELOPMENT,
    includePaths: [config.dir.css],
  };
  const sassLoaders = cssLoaders.concat([{
    loader: 'sass-loader',
    options: sassLoaderOptions,
  }]);
  const extractSass = new ExtractTextPlugin({
    filename: 'css/[name].[contenthash].css',
    disable: config.ENV_DEVELOPMENT,
  });
  const extractSassLoader = extractSass.extract({
    fallbackLoader: 'style-loader',
    loader: [
      // Use cssLoaders without style-loader
      ...cssLoaders.slice(1),
      {
        loader: 'sass-loader',
        options: {
          ...sassLoaderOptions,
          outputStyle: 'compressed',
          precision: 10,
          sourceComments: false,
        },
      },
    ],
  });

  webpackConf.module.rules.push(
    {
      test: /\.scss$/,
      // Note: using 'loader' vs 'use' as workaround for 'unexpected character' error
      // TODO: test if upgraded modules now allows for use of rules instead of loader
      loader: config.ENV_DEVELOPMENT ? sassLoaders : extractSassLoader,
    },
  );

  if (config.ENV_PRODUCTION) {
    webpackConf.plugins.push(extractSass);
  }

  return webpackConf;
};


export default setup;
export {
  setup,
};
