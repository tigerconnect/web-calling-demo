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
        "self": "writable"
      },
    },
  },
  webpack: {
    plugins: [
      new webpack.DefinePlugin({
        __SDK_VERSION__: `"${require('./src/js-sdk/package.json').version}"`,
      }),
    ],
  },
};

module.exports = config;
