const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const App = require('./server/app');
require('dotenv').load();

module.exports = merge(common, {
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    before(app) {
      var regApp = new App(app);

      regApp.registerTranslateApis();
    }
  }
});