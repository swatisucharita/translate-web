const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

 module.exports = {
   entry: {
     app: './src/index.js'
   },
   plugins: [
     new CleanWebpackPlugin(['dist']),
     new HtmlWebpackPlugin({
       title: 'Translator'
     }),
     new ExtractTextPlugin({
      filename: 'styles.css'
    })
   ],
   output: {
     filename: 'bundle.js',
     path: path.resolve(__dirname, 'dist')
   },
   module: {
    loaders: [
      {
        test: /\.js$/, 
        include: path.join(__dirname, 'src'), 
        loader: 'babel-loader',
        query: {
            presets: ['es2015']
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: "css-loader"
        })
    },
    // static assets
    { test: /\.html$/, loader: 'html-loader' },
    { test: /\.(png|jpg|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader' }
    ]
  }
 };