const path = require('path');

const commonConfig = require('../common.config');
const CompactMimeDB = require('./plugins/CompactMimeDB');

module.exports = (env, argv) => {
  const common = commonConfig(env, argv, __dirname);
  return {
    ...common,
    plugins: [
      ...common.plugins,
      new CompactMimeDB({
        filename: path.resolve(__dirname, 'mime-images.json'),
      }),
    ],
  };
};
