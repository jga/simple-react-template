const webpack = require('webpack');
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');


module.exports = {
  mode: 'production',
  entry: ['./src/index.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  watch: false,
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      }
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new CopyWebpackPlugin([
      { from: 'src/extra/', to: 'assets/extra/', ignore: '.DS_Store'},
    ]),
    new HtmlWebpackPlugin({
      template: 'index-template.ejs',
      title: {{cookiecutter.title}},
      appId: 'app',
      appDescription: {{cookiecutter.description}},
      hash: true
    })
  ],
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(woff2?|ttf|eot|jpe?g|png|gif|svg)$/,
        exclude: [
          path.resolve(__dirname, "src/assets/")
        ],
        loader: 'url-loader'
      },
      {
        test: /\.(|jpe?g|png|gif|svg)$/,
        include: [
          path.resolve(__dirname, "src/assets/")
        ],
        loader: "file-loader?name=[name].[ext]&publicPath=assets/&outputPath=assets/"
      },
      {
        test: [/\.js$/, /\.jsx$/, /\.es6$/],
        exclude: [
          path.resolve(__dirname, "node_modules/")
        ],
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    ]
  }
}

