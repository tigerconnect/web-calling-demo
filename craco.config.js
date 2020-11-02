const webpack = require('webpack');

const disableSymlinkResolution = {
  plugin: {
    overrideWebpackConfig: ({ webpackConfig }) => {
      webpackConfig.resolve.symlinks = false;
      return webpackConfig;
    },
  },
};

const config = {
  plugins: [disableSymlinkResolution],
  babel: {
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
    ],
  },
  eslint: {
    configure: {
      "globals": {
        // "__SDK_VERSION__": "readonly",
        "self": "writable"
      },
    },
  },
  webpack: {
    plugins: [
      new webpack.DefinePlugin({
        // __DEV__: !isProduction,
        __SDK_VERSION__: `"${require('./src/js-sdk/package.json').version}"`,
        // buildInfo: JSON.stringify(buildInfo),
      }),
    ],
  },
};

module.exports = config;
