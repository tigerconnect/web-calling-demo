
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
};

module.exports = config;
