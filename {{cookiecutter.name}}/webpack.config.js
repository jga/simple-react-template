const webpack = require('webpack')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require("html-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const APPVERSION = JSON.stringify(require("./package.json").version)

module.exports = {
  // Enable webpack's built-in optimizations that correspond to the production environment.
  //
  // Sets process.env.NODE_ENV on DefinePlugin to value production . Enables FlagDependencyUsagePlugin , FlagIncludedChunksPlugin , ModuleConcatenationPlugin , NoEmitOnErrorsPlugin , OccurrenceOrderPlugin , SideEffectsFlagPlugin and TerserPlugin .
  mode: 'development',
  // The module webpack should use to begin building out its internal dependency graph.
  entry: ['./src/index.js'],
  // The output property tells webpack where to emit the bundles it creates and how to name these files.
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    // The "chunkFilename" determines the name of non-entry chunk files
    chunkFilename: '[name].ck.js',
    /* The publicPath specifies the public URL of the output directory when referenced in a browser. A relative URL is resolved relative
     * to the HTML page (or <base> tag). Server-relative URLs, protocol-relative URLs or absolute URLs are also possible and sometimes
     * required, i. e. when hosting assets on a CDN. The value of the option is prefixed to every URL created by the runtime or loaders.
     * Because of this the value of this option ends with / in most cases.
     */
    publicPath: '/'
  },
  // Whether after the initial build, webpack will continue to watch for changes in any of the resolved files.
  watch: true,
  // Override the default minimizer (TerserPlugin)
  optimization: {
    minimizer: [
      // This plugin uses uglify-js to minify JavaScript.
      new UglifyJsPlugin({
        /* Enable file caching for speed, but uses storage.
         * Default path to cache directory: node_modules/.cache/uglifyjs-webpack-plugin. (default value is false)
         */
        cache: true,
        /* Use multi-process parallel running to improve the build speed.
         * Default number of concurrent runs: os.cpus().length - 1.
         * Helps speed up build.
         */
        parallel: true,
        // set to true if you want JS source maps
        sourceMap: false
      }),
      /* Searches for CSS assets during the Webpack build and will optimize \ minimize the CSS
       * (by default it uses cssnano but a custom CSS processor can be specified). Since extract-text-webpack-plugin
       * only bundles (merges) text chunks, if it's used to bundle CSS, the bundle might have duplicate
       * entries (chunks can be duplicate free but when merged, duplicate CSS can be created).
       */
      new OptimizeCSSAssetsPlugin({})
    ],
    splitChunks: {
      chunks: 'async',
      minSize: 0,
      maxSize: 244000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 7,
      automaticNameDelimiter: '~',
      name: false,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          name: (module) => {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace('@', '')}`;
          }
        }
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin({
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/assets/images',
        to: 'public/images',
        ignore: ['.DS_Store']
      },
      {
        from: 'src/fonts',
        to: 'fonts/',
        ignore: ['.DS_Store']
      }
    ]),
    new HtmlWebpackPlugin({
      template: 'index-template.ejs',
      title: {{cookiecutter.title}},
      appDescription: {{cookiecutter.description}},
      hash: true,
      appVersion: APPVERSION
    }),
    new BundleAnalyzerPlugin({ analyzerMode: 'static',
                               openAnalyzer: false,
                               reportFilename: '../_local/report.html'
    })
  ],
  module: {
    /* Useful reminders:
    * - The `use` rule processes loaders last first
    * - In development, we use the style-loader (as opposed to an extract plugin), which places a style tag in the index.html head
    *
    *   */
    rules: [
      {
        test: /\.scss$/,
        include: [
          path.resolve(__dirname, "src/components/")
        ],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: [
          path.resolve(__dirname, "src/components/")
        ],
        use: [
          'style-loader',
          // We exclude the URL so that the font-fance source is not resolved during build
          'css-loader?-url',
          'sass-loader'
        ]
      },
      {
        test: /\.(|jpe?g|png|gif|svg)$/,
        include: [
          path.resolve(__dirname, "src/assets/images/")
        ],
        loader: "file-loader?name=[name].[ext]&publicPath=public/images/&outputPath=public/images/"
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
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    historyApiFallback: true,
    proxy: {
      '/api': {
        pathRewrite: {'^/api' : ''},
        target: 'http://localhost:3000',
        secure: false
      }
    }
  },
  devtool: "cheap-eval-source-map"
}

