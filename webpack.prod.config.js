var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: {
    'main-app': path.join(__dirname, 'src/client/main-app/index.js'),
    'share-app': path.join(__dirname, 'src/client/share-app/index.js')
  },
  output: {
    path: path.join(__dirname, 'src/server/public/javascripts/'),
    publicPath: '/javascripts/',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.vue']
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },
  module: {
    preLoaders: [
      {
        test: /\.vue$/,
        loader: 'eslint',
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: 'eslint',
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: { presets: ['es2015'] }
      },
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: '[name].[ext]?[hash:7]'
        }
      }
    ]
  },
  vue: {
    loaders: {
      css: ExtractTextPlugin.extract('css'),
      stylus: ExtractTextPlugin.extract('css!stylus')
    }
  },
  // devtool: 'eval-source-map',
  eslint: {
    formatter: require('eslint-friendly-formatter')
  },
  plugins: [
    // short-circuits all Vue.js warning code
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    // extract css into its own file
    new ExtractTextPlugin('../stylesheets/[name].css'),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   }
    // }),
    // optimize module ids by occurence count
    new webpack.optimize.OccurenceOrderPlugin()
  ],
  externals: {
    Materialize: 'Materialize',
    THREE: 'THREE',
    ThreeBSP: 'ThreeBSP',
    Snap: 'Snap',
    jquery: 'jQuery',
    dat: 'dat',
    JSZip: 'JSZip',
    saveAs: 'saveAs'
  }
}
